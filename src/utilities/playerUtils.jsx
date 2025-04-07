import { supabase } from "../supabaseClient";

export const fetchAndCachePlayer = async (userId) => {
    try {
        const { data, error } = await supabase
            .from('Player')
            .select('*')
            .eq('internal_id', userId)
            .single()

        if (error) throw error;

        localStorage.setItem('player', JSON.stringify(data));
        return data;
    } catch (err) {
        console.error("Error fetching player: ", err.message);
        return null;
    }
};

export const getCachedPlayer = () => {
    try {
        const cached = localStorage.getItem('player');
        return cached ? JSON.parse(cached) : null;
    } catch {
        return null;
    }
};

export const clearCachedPlayer = () => {
    localStorage.removeItem('player');
};