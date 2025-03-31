import { createContext, useEffect, useState, useContext } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {

    const [session, setSession] = useState();

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

    //Sign up
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

    }

    // sign in
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
        }
    }

    useEffect(() => {
        supabase.auth.getSession().then(({data: {session}}) => {
           setSession(session); 
        });

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
    }, []);

    //Sign out
    const signOut = async () => {
        const { error } = supabase.auth.signOut();
        if(error){
            console.error("there was an error: ", error);
            return {success: false, error: error.message};
        }
    }

    return (
        <AuthContext.Provider value={{session, signUpNewUser, signOut, signInUser}}>
            {children}
        </AuthContext.Provider>
    )
}

export const UserAuth = () => {
    return useContext(AuthContext);
}