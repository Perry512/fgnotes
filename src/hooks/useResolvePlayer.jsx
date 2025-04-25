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

            if (cached?.code || typeof cached !== "object" || !cached.internal_id) {
                console.warn("useResolvePlayer: Corrupt or invalid cached player: ", cached);
                clearCachedPlayer({ verbose: true });
                setStatus("error");
            }

            if (cached?.internal_id === userId) {
                setPlayer(cached);
                setStatus(accessToken ? "stale_cache_with_token" : "cached");
                
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

            let resolved = await resolvePlayer(userId, { verbose: true });
            if (!resolved) {
                await createPlayer(userId);
                resolved = await resolvePlayer(userId, { verbose: true });
            }

            if (resolved) {
                setPlayer(resolved);
                updateCachedPlayer(resolved, { verbose: true });
                setStatus("fetched");
            } else {
                setStatus("error");
            }
        };

        if (userId && accessToken) fetchPlayer()
    }, [userId, accessToken]);
};