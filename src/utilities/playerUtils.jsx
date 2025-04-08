import { supabase } from "../supabaseClient";
import { runSupabaseQuery } from "./runSupabaseQuery";

const PLAYER_CACHE_KEY = "cache:player";
const EXPIRY_MS = 1000 * 60 * 5; // 5 mins

export const fetchAndCachePlayer = async (userId) => {

    const query = await supabase
        .from('Player')
        .select('*')
        .eq('internal_id', userId)
        .single()
        
    const data = await runSupabaseQuery(query);
    if (!data) return null;

    const payload = {
        value: data,
        expiry: Date.now() + EXPIRY_MS,
    };

    localStorage.setItem(PLAYER_CACHE_KEY, JSON.stringify(data));
        return data;
}

export const getCachedPlayer = () => {
    try {
        const raw = localStorage.getItem(PLAYER_CACHE_KEY);
        if (!raw) return null;

        const { value, expiry } = JSON.parse(raw);
        if (Date.now() > expiry) {
            clearCachedPlayer();
            return null;
        }

        return value;
    } catch {
        return null;
    }
};

export const updateCachedPlayer = (playerData) => {
    localStorage.setItem(PLAYER_CACHE_KEY, JSON.stringify(playerData));
} 

export const clearCachedPlayer = () => {
    localStorage.removeItem(PLAYER_CACHE_KEY);
};