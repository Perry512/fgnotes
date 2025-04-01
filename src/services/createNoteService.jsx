import { supabase } from "../supabaseClient";
import { UserAuth } from "../context/AuthContext";

export const createNoteService = async (noteTitle, noteContent) => {
    const { session } = UserAuth();
    if (!session.user?.id) {
        console.error("No user session found");
        return;
    }

    const { error } = await supabase
        .from('Note')
        .insert([ {note_title: noteTitle,  note_content: noteContent, note_creator: session.user.id}])

}