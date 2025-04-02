import { supabase } from "../supabaseClient";

export const createNoteService = async (session, noteTitle, noteContent) => {
    if (!session.user?.id) {
        console.error("No user session found");
        return { error: "No session found" };
    }

    const { error } = await supabase
        .from('Note')
        .insert([ {note_title: noteTitle,  note_content: noteContent, note_creator: session.user.id} ])

    return { data, error };
}