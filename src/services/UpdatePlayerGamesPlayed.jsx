import { supabase } from "../supabaseClient";

export const UpdatePlayerGamesPlayed = async (gamesPlayed, session) => {
    
    if (!session?.user?.id) {
        console.error("No user session found.");
        return;
    }

    const { error } = await supabase
        .from('Player')
        .update({ games_played: [gamesPlayed] })
        .eq('internal_id', session.user.id);

    if (error) {
        console.error("Error updating games played:", error);
    } else {
        console.log("Games played updated successfully");
    }
};