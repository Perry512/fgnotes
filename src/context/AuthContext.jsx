import { createContext, useEffect, useState, useContext } from "react";
import { supabase } from "../supabaseClient";
import { fetchAndCachePlayer, getCachedPlayer } from "../utilities/playerUtils";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [session, setSession] = useState(null);
    const [player, setPlayer] = useState(null);

    // Fetch player data from the database
    const fetchPlayer = async (userId) => {
        if (!userId) return;

        const { data, error } = await supabase
            .from("Player")
            .select("*")
            .eq("internal_id", userId)
            .single();

        if (error) {
            console.error("Error fetching player:", error);
        } else {
            setPlayer(data);
        }
    };

    // Create Player
    const createPlayer = async (userId) => {
        try {
            console.log("Creating player for userId:", userId);
            const { data, error } = await supabase
                .from('Player')
                .insert([{ internal_id: userId }])
                .select();

            if (error) {
                console.error("Error creating player:", error.message);
                return { success: false, error: error.message };
            }
            console.log("Player created successfully:", data);
            return { success: true, data };
        } catch (err) {
            console.error("Unexpected error:", err.message);
            return { success: false, error: err.message };
        }
    };

    // Sign up
    const signUpNewUser = async (email, password) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            console.error("Signup error:", error);
            return { success: false, error };
        }

        const userId = data?.user?.id;
        if (userId) {
            console.log("User signed up successfully, creating player...");
            await createPlayer(userId);
        }

        return { success: true, data };
    };

    // Sign in
    const signInUser = async(email, password) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email, 
                password: password
            });

            if(error) {
                console.error("sign in error occured: ", error);
                return {success: false, error: error.message};
            }

            console.log("sign-in success: ", data);
            return { success: true, data };

        } catch(error){
            console.error("error has occured: ", error)
            return { success: false, error: error.message };
        }
    };

    // State Listener
    useEffect(() => {
        const initializeSession = async () => {
            setLoading(true);
            const { data, error } = await supabase.auth.getSession();
    
            if (error) {
                console.error("Error fetching session: ", error);
            } else {
                setSession(data.session);
                if (data.session?.user?.id) {
                    fetchPlayer(data.session.user.id);
                }
            }
    
            setLoading(false);
        };
    
        initializeSession();
    
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session ) => {
            setSession(session);
            if (session?.user?.id) {
                fetchAndCachePlayer(session.user.id);
            } else {
                setPlayer(null);
            }
        });

        setLoading(false);
    
        return () => {
            listener?.subscription?.unsubscribe();
        };
    }, []);
    //     supabase.auth.getSession().then(({data: {session}}) => {
    //         setSession(session);
    //         if (session?.user?.id) { fetchPlayer(session.user.id); }
    //     });

    //     const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
    //         setSession(session);
    //         if (session?.user?.id) { fetchPlayer(session.user.id); }
    //     });

    //     return () => {
    //         listener?.subscription?.unsubscribe();
    //     };
    // }, []);

    // Subscribe to Player Updates
    useEffect(() => {
        if (!session?.user?.id) return;

        const playerListener = supabase
            .channel("realtime-player")
            .on(
                "postgres_changes",
                { 
                    event: "UPDATE", 
                    schema: "public", 
                    table: "Player", 
                    filter: `internal_id=eq.${session.user.id}`
                },
                (payload) => {
                    console.log("Player data updated: ", payload.new);
                    setPlayer(payload.new);
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "Player",
                    filter: `internal_id=eq.${session.user.id}`
                },
                (payload) => {
                    console.log("New Player created: ", payload.new);
                    setPlayer(payload.new);
                }
            )
            .subscribe();

        return () => {
            playerListener.unsubscribe();
        };
    }, [session]);

    // Sign out
    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Error signing out:", error);
        }
        setSession(null);
        setPlayer(null);
        return { success: true };
    };

    if (loading) return <div> Loading, please stand by </div>;

    return (
        <AuthContext.Provider value={{ session, signUpNewUser, signOut, signInUser, player, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const UserAuth = () => {
    return useContext(AuthContext);
};