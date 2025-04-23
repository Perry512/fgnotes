import { fetchAndCachePlayer, getCachedPlayer } from "./playerUtils";
import { supabase } from "../supabaseClient";
import { runSupabaseQuery } from "./runSupabaseQuery";

let debounceTimer;

const extractUserId = async (input, {verbose=true} = {}) => {
    let userId;

    console.log("extractUserId: ", typeof(input));
    if (input?.session) {
        if (verbose) console.log("input has session key: "); 
        userId = extractUserId(input.session);
    }
    if (typeof input === "string") {
        if (verbose) console.log("input eq string: ", input);
        userId = input;
    }
    if (input?.user?.id) {
        if (verbose) console.log("input eq user.id: ", input.user.id);
        userId = input.user.id;
    }
    if (input?.session?.user?.id) {
        if (verbose) console.log("input eq session.user.id: ", input.session.user.id);
        userId =  input.session.user.id;
    }
    if (userId) {
        console.log("Returning Player: ", input);
        return userId;
    }
    
    const query = supabase
    .from("Player")
    .select("*")
    .eq("internal_id", userId)
    .maybeSingle();

    return runSupabaseQuery(query);
  };

export const resolvePlayer = async (
    sessionOrUserId,
    options = { debounce: false, delay: 250, verbose: false }
) => {
    
    console.log("resolvePlayer: Session/UserId: ", sessionOrUserId );
    const userId = await extractUserId(sessionOrUserId);

    if (!userId) {
        console.error("resolvePlayer: No valid userId", userId);
        return null;
    }

    const cached = getCachedPlayer( {verbose: true} );
    
    if (cached?.internal_id === userId) {
        console.log("resolvePlayer: Found cached player: ", cached);
        return cached;
    }

    if (options.debounce) { 
        return new Promise((resolve) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(async () => {
                console.log("fetchingAndCaching player: ", userId);
                const fetched = await fetchAndCachePlayer(userId , {verbose: true });
                resolve(fetched || null);
            }, options.delay || 250);
        });
    }

    const fetched = await fetchAndCachePlayer(userId, {verbose: false });

    if (options.verbose) {
        console.log("Fetched Player: ", fetched);
    }

    if (fetched?.data) return fetched;

    console.error("Failed to resolve player from cache/ database");
    return null;
};