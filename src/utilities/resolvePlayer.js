import { fetchAndCachePlayer, getCachedPlayer } from "./playerUtils";

export const resolvePlayer = async (sessionOrUserId) => {
    
    const userId = typeof sessionOrUserId === "string"
        ? sessionOrUserId
        : sessionOrUserId?.user?.id;

    if (!userId) {
        console.error("resolvePlayer: No valid userId");
        return null;
    }

    const cached = getCachedPlayer();
    if (cached?.internal_id === userId) return cached;

    const fetched = await fetchAndCachePlayer(userId);
    if (fetched) return fetched;

    console.error("Failed to resolve player from cache/ database");
    return null;
};