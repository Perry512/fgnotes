export const runSupabaseQuery = async (query) => {
    try {
        const { data, error } = await query;
        if (error) {
            console.error("Supabase error: ", error);
            return { error };
        }
        return data;
    } catch {
        console.error("Unexpected Error: ", error);
        return { error: err.message };
    }
};