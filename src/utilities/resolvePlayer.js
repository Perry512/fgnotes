import { fetchAndCachePlayer, fetchPlayer, getCachedPlayer } from "./playerUtils";

let debounceTimer = null;

const access_token = localStorage.getItem("access_token");

const extractUserId = async (input, {verbose=true} = {}) => {
    //let userId;

    // console.log("extractUserId: ", typeof(input));
    // if (input?.session) {
    //     if (verbose) console.log("input has session key: "); 
    //     userId = extractUserId(input.session);
    // }
    // if (typeof input === "string") {
    //     if (verbose) console.log("input eq string: ", input);
    //     userId = input;
    // }
    // if (input?.user?.id) {
    //     if (verbose) console.log("input eq user.id: ", input.user.id);
    //     userId = input.user.id;
    // }
    // if (input?.session?.user?.id) {
    //     if (verbose) console.log("input eq session.user.id: ", input.session.user.id);
    //     userId =  input.session.user.id;
    // }
    // if (userId) {
    //     console.log("Returning Player: ", input);
    //     return userId;
    // }
    if (!input) return null;

    if (typeof input === "string") return input;
    if (input?.user?.id) return input.user.id;
    if (input?.session?.user?.id) return input.session.user.id;

    return null;
  };

export const resolvePlayer = async (
    sessionOrUserId,
    options = { debounce: false, delay: 250, verbose: true }
) => {

    const { debounce, delay, verbose } = options;
    const userId = extractUserId(sessionOrUserId, {verbose: true});
    if (options.verbose) console.log("resolvePlayer: Session/UserId: ", sessionOrUserId );

    if (!userId) {
         if (options.verbose) console.error("resolvePlayer: No valid userId", userId);
        return { player: null, status: "error"};
    }

    const cached = getCachedPlayer( {verbose} );
    if (cached?.internal_id === userId) {
        if (verbose) console.log("resolvePlayer: Found cached player: ", cached);
        if (access_token) {
            if (options.verbose) {
                console.log("resolvePlayer: Found access token, start running fetchandcache: ", cached);
                return { player: cached, status: "stale_cache_with_token" };
            }
        return { player: cached, status: "cached" };
        }
    }

    if (debounce) { 
        return new Promise((resolve) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(async () => {
                console.log("fetchingAndCaching player: ", userId);
                const fetched = await fetchAndCachePlayer(userId , {verbose: true });
                resolve({ 
                        player: fetched ?? null,
                        status: fetched ? "fetched" : "error" 
                    });
            }, delay);
        });
    }

    const fetched = await fetchAndCachePlayer(userId, {verbose: false });

    if (verbose) { console.log("Fetched Player: ", fetched); }

    if (fetched) return fetched;

    console.error("Failed to resolve player from cache/ database");
    return { player: null, status: "error" };
    
};