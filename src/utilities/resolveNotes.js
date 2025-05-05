import { getCachedPlayerNotes, fetchAndCacheNotes } from "./noteUtils";

let debounceTimer = null;

export const resolveNotes = async ( userId, options = { debounce: false, delay: 250, verbose: true}) => {
    const { debounce, delay, verbose } = options;

    if (!userId) {
        if (verbose) console.error("resolveNotes: No userId");
        return { notes: null, status: error }
    }

    const cached = getCachedPlayerNotes({ verbose });

    if (cached?.note_creator === userId) {
        if (verbose) console.log("resolveNotes: Found cached notes: ", cached);
        return { notes: cached, status: "cached" };
    }

    if (debounce) {
        return new Promise((resolve) => {
            if (debounceTimer) clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                fetchAndCacheNotes(userId, { verbose })
                    .then((notes) => resolve({ notes, status: "fetched" }))
                    .catch((error) => {
                        console.error("resolveNotes: Error fetching notes", error);
                        resolve({ notes: null, status: "error" });
                    });
            }, delay);
        });
    }

    const fetched = await fetchAndCacheNotes(userId, { verbose });
    if (verbose) console.log("resolveNotes: Fetched notes: ", fetched);
    if (fetched) return { notes: fetched, status: "fetched" };

    console.error("resolveNotes: Error fetching notes: ", fetched);
    return { notes: null, status: "error" };

}