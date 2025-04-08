import { supabase } from "../supabaseClient";
import { runSupabaseQuery } from "./runSupabaseQuery";

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
        // Assures that only the first note is shown
        query = query.limit(1).select();
    }

    return runSupabaseQuery(query);

}