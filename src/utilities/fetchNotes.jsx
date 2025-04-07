import { supabase } from "../supabaseClient";

export const fetchNotes = async (session, { single = false } = {}) => {
    if (!session?.user?.id) {
        console.error("No session found");
        return { error: "No session found" };
    }

    let query = supabase
        .from("Note")
        .select("note_title, note_content")
        .eq("note_creator", session.user.id)
        .order("created_at", { ascending: false });

    if (single) {
        query = query.limit(1).select();
    }

    const { data, error } = await query;

    if (error) {
        console.error("Supabase fetch error: ", error);
        return error;
    }

    return data;
}