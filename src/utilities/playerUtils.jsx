import { supabase } from "../supabaseClient";
import { runSupabaseQuery } from "./runSupabaseQuery";

const PLAYER_CACHE_KEY = "cache:player";
const EXPIRY_MS = 1000 * 60 * 5; // 5 mins

export const fetchAndCachePlayer = async (userId, {verbose = false}) => {

    if (verbose) {
        console.log("Attempting fetchAndCachePlayer");
    }
    const query = await supabase
        .from('Player')
        .select('*')
        .eq('internal_id', userId)
        .single()

    const data = await runSupabaseQuery(query);
    if (!data) return null;

    console.log("FetchAndRetrieved: ", data);
    const payload = {
        value: data,
        expiry: Date.now() + EXPIRY_MS,
    };

    localStorage.setItem(PLAYER_CACHE_KEY, JSON.stringify(payload));
        return data;
}

export const getCachedPlayer = ( {verbose = false} = {} ) => {
    if (verbose) {
        console.log("Attempting getCachedPlayer");
    }
    
    try {
        const raw = localStorage.getItem(PLAYER_CACHE_KEY);
        console.log("Raw: ", raw);
        if (!raw || raw === null)  {
            console.log("No cached player found, returning null.");
            return null;
            
        }
        
        const { value, expiry } = JSON.parse(raw);
        if (Date.now() > expiry) {
            console.log("Cached player expired.");
            clearCachedPlayer();
            return null;
        }
        if (verbose) {
            console.log("Cached Player: ", value);
        }
        return value.data;
    } catch (error) {
        console.error("Error retrieving cached player: ", error);
        clearCachedPlayer();
        return null;
    }
};

export const updateCachedPlayer = (playerData) => {
    const payload = { 
        value: playerData,
        expiry: Date.now() + EXPIRY_MS,
    };
    localStorage.setItem(PLAYER_CACHE_KEY, JSON.stringify(payload));
} 

export const clearCachedPlayer = () => {
    localStorage.removeItem(PLAYER_CACHE_KEY);
};