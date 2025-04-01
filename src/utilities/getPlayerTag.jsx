import { supabase } from '../supabaseClient';

export const getPlayerTag = async (session) => {
    if (!session?.user?.id) {
        console.error("No session found");
        return null;
    }

    const { data: Player, error } = await supabase
        .from('Player')
        .select('tag')
        .eq('internal_id', session.user.id)
        .single();

    if (error) {
        console.error("Error fetching player tag:", error.message);
        return null;
    }

    return Player?.tag || null;
};