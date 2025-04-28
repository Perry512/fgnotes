import { useEffect, useState } from "react";
import { getCachedPlayer, fetchAndCachePlayer } from "../utilities/playerUtils";

export const usePlayer = (sessionOrUserId, {useData = false} = {}) => {
    const [player, setPlayer] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!sessionOrUserId) {
            console.log("usePlayer: No session or userId provided.");
            setLoading(false);
            return;
        }

        const cached = getCachedPlayer({ verbose: true });
        if (cached) {
            console.log("usePlayer: Found cached player: ", cached);
            setPlayer(cached);
            setLoading(false);
            return;
        }

        const fetchPlayer = async () => {
            console.log("usePlayer: Fetching player");
            try {
                const resolved = await fetchAndCachePlayer(sessionOrUserId, { verbose: true });
                console.log("usePlayer: Resolved player: ", resolved);
                setPlayer(resolved || null);
            } catch (err) {
                console.error("usePlayer: Error fetching player: ", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        }

        fetchPlayer();

        console.log("usePlayer: Error: ", error);

    }, [sessionOrUserId]);

    return {
        player: useData ? player?.data : player,
        loading: loading,
        error
    };
}