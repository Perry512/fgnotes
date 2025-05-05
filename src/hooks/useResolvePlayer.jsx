import { useEffect } from "react";
import { getCachedPlayer, fetchAndCachePlayer, updateCachedPlayer, clearCachedPlayer } from "../utilities/playerUtils";
import { resolvePlayer } from "../utilities/resolvePlayer";

export const useResolvePlayer = ({ userId, accessToken, setPlayer, setStatus }) => {

    useEffect(() => {
        const fetchPlayer = async () => {
            if (!userId || typeof userId !== "string") {
                console.log("useResolvePlayer: Invalid userId, ", userId);
                setStatus("error");
                return;
            }

            const cached = getCachedPlayer({ verbose: true });

            const isValidCached = cached && typeof cached === "object" && !cached.code && cached.internal_id;

            if (isValidCached && cached.internal_id === userId) {
                setPlayer(cached);
                setStatus(accessToken ?  "stale_cache_with_token" : "cached");

                if (accessToken) {
                    const fresh = await fetchAndCachePlayer(userId, { verbose: true });
                    if (fresh) {
                        setPlayer(fresh);
                        updateCachedPlayer(fresh, { verbose: true });
                        setStatus("fresh_cache_with_token");
                    }
                }

                return;
            }

            if (!isValidCached) { 
                console.warn("useResolvePlayer: No valid cached player, attempting to fetch player");
                clearCachedPlayer({ verbose: true });
            }

            let resolved = await resolvePlayer(userId, { verbose: true });

            if (!resolved) {
                
                setStatus("error");
                return;
            }

            if (resolved) {
                setPlayer(resolved);
                updateCachedPlayer(resolved, { verbose: true });
                setStatus("fetched");
            } else {
                setStatus("error");
            }
        };

        fetchPlayer();
    }, [userId, accessToken]);
};