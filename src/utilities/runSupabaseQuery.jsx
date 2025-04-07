export const runSupabaseQuery = async (query, {log = false} = {}) => {
    try {
        const { data, error } = await query;
        if (error) {
            console.error("Supabase error: ", error);
            return { error };
        }
        if (log) console.log("Supabase data: ", data);
        return data;
    } catch {
        console.error("Unexpected Error: ", error);
        return { error: err.message };
    }
};