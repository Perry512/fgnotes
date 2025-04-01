import React, { useState } from "react";
import { UserAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export const GetPlayer = () => {
    
    const [error, setError] = useState('');
    const [player, setPlayer] = useState([]);
    const [loading, setLoading] = useState(false); 
    
    const { session } = UserAuth();
    const navigate = useNavigate();

    const handleGetPlayer = async(e) => {
        e.preventDefault();
        setLoading(true);

        if (!session?.user?.id) {
            console.error("No session found");
            return;
        }

        const { data: Player, error } = await supabase
            .from('Player')
            .select('*')
            .eq('internal_id', session.user.id)
            .select()

        if (error) {
            setError(error);
            setPlayer(null);
            setTimeout(() => {
                setError("");
            }, 3000);

        } else {
            setPlayer(Player);

        }
        
        setLoading(false);
        console.log("Player tag: ", Player, "\nLoading? ",  loading);

    } 

    return (
        <>
            <form>
                <h1> Get Player </h1>
                <button className="mt-6 w-full" type="submit" onClick={handleGetPlayer}> get player </button>
                {error && <p className="text-red-600 text center pt-4"> {error} </p>}
            </form>
        </>
    )
    
}

export default GetPlayer;