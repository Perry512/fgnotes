export const runSupabaseQuery = async (query, {verbose = true} = {}) => {
    try {
        const { data, error } = await query;
        if (error) {
            console.error("Supabase error: ", error);
            return error;
        }
        if (verbose) console.log("Supabase data: ", data);
        return {data, error: null};
    } catch (err){
        console.error("Unexpected Error: ", err);
        return { data:null, error: err.message || "Unknown error D:" };
    }
};