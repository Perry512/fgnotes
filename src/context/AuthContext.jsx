import { useRef, useState, useEffect, useContext, createContext } from "react";
import { supabase } from "../supabaseClient";
import { fetchAndCachePlayer, getCachedPlayer, clearCachedPlayer, updateCachedPlayer } from "../utilities/playerUtils";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState(null);
    const [player, setPlayer] = useState(null);
    const hasFetchedPlayer = useRef(false); // 👈 survives re-renders

    const createPlayer = async (userId) => {
        await supabase
            .from("Player")
            .insert([{ internal_id: userId }])
            .select();
    };

    const handlePlayerFetch = async (userId) => {
        if (!userId || hasFetchedPlayer.current) return;
        hasFetchedPlayer.current = true;

        const cached = getCachedPlayer();
        if (cached) {
            setPlayer(cached);
        } else {
            const fetched = await fetchAndCachePlayer(userId);
            setPlayer(fetched);
        }
    };

    useEffect(() => {
        let mounted = true;

        const initAuth = async () => {
            const { data } = await supabase.auth.getSession();
            if (!mounted) return;

            setSession(data.session);
            if (data.session?.user?.id) {
                await handlePlayerFetch(data.session.user.id);
            }
            setLoading(false);
        };

        initAuth();

        const { data: authListener } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                if (!mounted) return;

                setSession(session);
                if (session?.user?.id) {
                    await handlePlayerFetch(session.user.id);
                } else {
                    setPlayer(null);
                    clearCachedPlayer();
                    hasFetchedPlayer.current = false;
                }
            }
        );

        return () => {
            mounted = false;
            authListener.subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (!session?.user?.id) return;

        const sub = supabase
            .channel("realtime-player")
            .on(
                "postgres_changes",
                { event: "UPDATE", schema: "public", table: "Player", filter: `internal_id=eq.${session.user.id}` },
                (payload) => setPlayer(payload.new)
            )
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "Player", filter: `internal_id=eq.${session.user.id}` },
                (payload) => {
                    updateCachedPlayer(payload.new);
                    setPlayer(payload.new);
                }
            )
            .subscribe();

        return () => {
            sub.unsubscribe();
        };
    }, [session?.user?.id]);

    const signUpNewUser = async (email, password) => {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) return { success: false, error };

        const userId = data.user?.id;
        if (userId) await createPlayer(userId);

        return { success: true, data };
    };

    const signInUser = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return { success: false, error: error.message };
        return { success: true, data };
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setSession(null);
        setPlayer(null);
        clearCachedPlayer();
        hasFetchedPlayer.current = false;
        return { success: true };
    };

    if (loading) return <div>Loading, please stand by</div>;

    return (
        <AuthContext.Provider value={{ session, signUpNewUser, signInUser, signOut, player, setPlayer }}>
            {children}
        </AuthContext.Provider>
    );
};

export const UserAuth = () => useContext(AuthContext);