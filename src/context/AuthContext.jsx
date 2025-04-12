import { useRef, useState, useEffect, useContext, createContext } from "react";
import { supabase } from "../supabaseClient";
import { fetchAndCachePlayer, getCachedPlayer, clearCachedPlayer, updateCachedPlayer } from "../utilities/playerUtils";
import { resolvePlayer } from "../utilities/resolvePlayer";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState(null);
    const [player, setPlayer] = useState(null);
    const [notes, setNotes] = useState([]);
    const hasFetchedPlayer = useRef(false);

    const createPlayer = async (userId) => {
        await supabase
            .from("Player")
            .insert([{ internal_id: userId }])
            .select();
    };

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
        setNotes([]);
        clearCachedPlayer();
        hasFetchedPlayer.current = false;
        return { success: true };
    };

    useEffect(() => {
        let mounted = true;

        const initAuth = async () => {
            const { data } = await supabase.auth.getSession();
            if (!mounted) return;

            const currentSession = data.session;
            setSession(data.session);
            if (currentSession?.user?.id) {
                const resolved = await resolvePlayer(currentSession.user.id);
                if (resolved) {
                    setPlayer(resolved.data);
                    updateCachedPlayer(resolved.data);
                }
            }
            setLoading(false);
        };

        initAuth();

        const { data: authListener } = supabase.auth.onAuthStateChange(
            async (_event, newSession) => {
                if (!mounted) return;

                setSession(newSession);

                if (newSession?.user?.id) {
                    const resolved = await resolvePlayer(newSession.user.id);
                    if (resolved) {
                        setPlayer(resolved.data);
                        updateCachedPlayer(resolved.data);
                    }
                } else {
                    setPlayer(null);
                    clearCachedPlayer();
                    hasFetchedPlayer.current = false;
                }
                setLoading(false);
            }
        );

        return () => {
            mounted = false;
            authListener.subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (!session?.user?.id) return;

        const playerSub = supabase
            .channel("realtime-player")
            .on(
                "postgres_changes",
                { event: "UPDATE", schema: "public", table: "Player", filter: `internal_id=eq.${session.user.id}` },
                (payload) => {
                    setPlayer(payload.new)
                    updateCachedPlayer(payload.new);
                })
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "Player", filter: `internal_id=eq.${session.user.id}` },
                (payload) => {
                    updateCachedPlayer(payload.new);
                    setPlayer(payload.new);
                }
            )
            .subscribe();

        const notesSub = supabase
            .channel("realtime-notes")
            .on("postgres_changes",
                { event: "*", schema: "public", table: "Note", filter: `note_creator=eq.${session.user.id}` },
                (payload) => {
                    if (payload.eventType === "INSERT") {
                        setNotes(prevNotes => [...prevNotes, payload.new]);
                    } else if (payload.eventType === "UPDATE") {
                        setNotes(prevNotes => prevNotes.map(note =>
                            note.note_id === payload.new.note_id ? payload.new : note
                        ));
                    } else if (payload.eventType === "DELETE") {
                        setNotes(prevNotes => prevNotes.filter(note => note.note_id !== payload.old.note_id));
                    }
                }
            )
            .subscribe();

        return () => {
            playerSub.unsubscribe();
            notesSub.unsubscribe();
        };
    }, [session?.user?.id]);

    useEffect(() => {
        // if (!session.user?.id || loading) return;

        const initialize = async () => {
            const cachedPlayer = getCachedPlayer();
            if (cachedPlayer) {
                setPlayer(cachedPlayer);
                hasFetchedPlayer.current = true;
            }

            const resolvedPlayer = await resolvePlayer(session?.user.id);
            if (!resolvePlayer) {
                await createPlayer(session.user.id);
                resolvedPlayer = await resolvePlayer(session.user.id);
            }

            console.log("resolve: ", resolvedPlayer)
            if (resolvedPlayer) {
                setPlayer({...resolvedPlayer.data});
                updateCachedPlayer(resolvedPlayer.data);
            }
        }

        initialize();
    }, [session, loading]);

    if (loading) return <div>Loading, please stand by</div>;

    return (
        <AuthContext.Provider value={{ session, signUpNewUser, signInUser, signOut, player, setPlayer, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const UserAuth = () => useContext(AuthContext);