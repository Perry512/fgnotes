import { supabase } from "../supabaseClient";
import { runSupabaseQuery } from "./runSupabaseQuery";

export const updatePlayerGamesPlayed = async (userId, gamesPlayed) => {
    
    if (!userId) {
        console.error("updatePlayerGamesPlayedNo user session found.");
        return { error: "No user session found." };
    }

    const query = await supabase
        .from('Player')
        .upsert({ games_played: gamesPlayed })
        .eq('internal_id', session.user.id);

    runSupabaseQuery(query, { verbose: true })
        .then((data) => {
            if (data) {
                console.log("Games played updated successfully", data);
                return { success: true, data };
            } else {
                console.error("Error updating games played:", error);
                return { error };
            }
        })
        .catch((error) => {
            console.error("Error updating games played:", error);
            return { error };
        });
    return { error };
    
};