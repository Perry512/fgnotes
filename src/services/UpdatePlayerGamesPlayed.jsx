import React, { useState } from "react";
import { UserAuth } from "../context/AuthContext";
import { supabase } from "../supabaseClient";

export const UpdatePlayer = () => {
    
    const [error, setError] = useState('');
    const [loading, setLoading] = useState('');
    const [tag, setTag] = useState(null);
    
    const { session } = UserAuth();

    const handleUpdatePlayer = async(e) => {
        e.preventDefault();
        setLoading(true);


        const { data: Player, error } = await supabase
            .from('Player')
            .update({ tag: tag })
            .eq('internal_id', session?.user?.id)

        if (error) {
            setError(error);
            setTag(null);
            setTimeout(() => {
                setError("");
            }, 3000)

        } else {
            setTag(tag);

        }

        setLoading(false);
        console.log(Player, loading);
        
    }

    return (
        <>
            <form>
                <h1> Update Player </h1>
                <input onChange={(e) => setTag(e.target.value)} placeholder="Your tag goes here" className="p-3 mt-2" type="tag"/>
                <button className="mt-6 w-full" type="submit" onClick={handleUpdatePlayer}> Update Player </button>
                {error && <p className="text-red-600 text center pt-4"> {error} </p>}
            </form>
        </>
    )
}

export default UpdatePlayer;