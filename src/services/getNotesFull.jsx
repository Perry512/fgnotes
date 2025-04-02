import { supabase } from "../supabaseClient";

export const getNotesFull = async (session) => {
    if (!session?.user?.id) {
        console.error("No session found");
        return { error: "No session found" }
    }

    const {data, error } = await supabase
        .from('Note')
        .select("note_title, note_content")
        .eq("note_creator", session.user.id)
        .order("created_at", { ascending: false })
        .select();

    if (error) {
        console.error("Supabase fetch error: ", error);
        return { error }
    }

    return {...data};
};