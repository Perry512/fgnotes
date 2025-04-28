import { cache } from "react";
import { supabase } from "../supabaseClient";
import { runSupabaseQuery } from "./runSupabaseQuery";

const PLAYER_CACHE_KEY = "cache:player";
const EXPIRY_MS = 1000 * 60 * 5; // 5 mins

const buildCachePayload = (data) => ({
    value: data,
    expiry: Date.now() + EXPIRY_MS,

});

export const fetchAndCachePlayer = async (userId, options = {}) => {
    const { verbose = true, useData = true } = options;
    
    if (verbose) { console.log("playerUtils: Attempting fetchAndCachePlayer: ", userId); }

    const id  = typeof userId === "object" && userId?.user?.id ? userId.user.id : userId;

    const query = supabase
        .from('Player')
        .select('*')
        .eq('internal_id', id)
        .single()

    const { data, error } = await runSupabaseQuery(query);
    if (!data) return null;

    const payload = buildCachePayload(data);
    localStorage.setItem(PLAYER_CACHE_KEY, JSON.stringify(payload));
        if (options.verbose) console.log("playerUtils: Cached player: ", payload);
        return data;
}

export const fetchPlayer = async (userId, options = {}) => {
    const { verbose = true } = options;
    if (verbose) { console.log("playerUtils: Attempting fetchPlayer: ", userId); }

    const query = await supabase
        .from('Player')
        .select('*')
        .eq('internal_id', userId)
        .single()

    const { data, error } = await runSupabaseQuery(query);
    if (verbose && data) console.log("playerUtils: Fetched player: ", data);
    
    if (error) {
        console.error("playerUtils: Error fetching player: ", error);
        return null;
    }

    return data;

}

export const cachePlayer = (playerData, options = {}) => {
    const { verbose = true } = options;
    localStorage.setItem(PLAYER_CACHE_KEY, JSON.stringify(buildCachePayload(playerData)));
    if (verbose) console.log("playerUtils: Cached player: ", playerData);
}

export const updateCachedPlayer = (playerData, options = {}) => {
    cachePlayer(playerData, options);
}

export const getCachedPlayer = ( options = {}) => {
    const { verbose = false } = options;

    if (verbose) { console.log("playerUtils: Attempting getCachedPlayer"); }
    
    try {
        const raw = localStorage.getItem(PLAYER_CACHE_KEY);
        console.log("playerUtils: Raw: ", raw);
        if (!raw || raw === null)  {
            console.log("playerUtils: No cached player found");
            return null;
            
        }
        
        const { value, expiry } = JSON.parse(raw);

        if (Date.now() > expiry) {
            verbose ?? console.log("playerUtils: Cached player expired.");
            clearCachedPlayer({ verbose });
            return null;
        }

        if  (value &&
            typeof value === "object" &&
            "code" in value &&
            "message" in value &&
            !("data" in value)
        ) { 
            console.log("playerUtils: Cached player is invalid, clearing cache.");
            clearCachedPlayer({ verbose });
            return null;
        }
        if (verbose) { console.log("playerUtils: Cached Player: ", value); }

        return value?.data ?? value;
    } catch (error) {
        console.error("playerUtils: Error retrieving cached player: ", error);
        clearCachedPlayer({ verbose });
        return null;
    }
};

export const sanitizeUserId = (playerData) => {
    if (!playerData || typeof playerData !== "object") return null;
    return {
        internal_id: playerData.internal_id
    };
}

export const clearCachedPlayer = (options = {}) => {
    const { verbose = true } = options;
    localStorage.removeItem(PLAYER_CACHE_KEY);
    if (verbose) { console.log("playerUtils: Cleared cached player"); }
};

export const updatePlayerField = async (userId, field, value, options = {}) => {
    const { verbose = true } = options;
    if (!userId || !field) {
        verbose ?? console.error("playerUtils: Invalid arguments for updatePlayerField: ", userId, field, value);
        return { data: null, error: "Invalid arguments" };
    }

    const updateObject = { [field]: value };

    const { data, error } = await runSupabaseQuery(
        supabase
            .from('Player')
            .update(updateObject)
            .eq('internal_id', userId)
            .select()
            .single(),
        { verbose: true }
    );

    if (data) cachePlayer(data, { verbose });

    return { data, error };

}