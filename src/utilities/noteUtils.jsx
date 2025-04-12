import { supabase } from "../supabaseClient";
import { runSupabaseQuery } from "./runSupabaseQuery";
import { resolvePlayer } from "./resolvePlayer";

export const fetchPlayerNotes = async (playerId, { single = false } = {}) => {

    const query = supabase
        .from("Note")
        .select("*")
        .eq("note_creator", playerId)
        .order("created_at", {ascending: false});

    if (single) {
        query = query.limit(1).select();
    }

    console.log("Working...", query)
    const result = await runSupabaseQuery(query);
    console.log("Supabase Query Result: ", result);
    return { data: result.data };
};

export const createNoteService = async (session, noteTitle, noteContent) => {
    const player = await resolvePlayer(session);

    const query = supabase
        .from('Note')
        .insert([ {note_title: noteTitle,  note_content: noteContent, note_creator: player.internal_id} ])

    return runSupabaseQuery(query);
    
}

export const deleteNoteService = async (playerId, noteId) => {
    
    console.log("PlayerID: ", playerId, "NoteID: ", noteId)
    const query = supabase
        .from("Note")
        .delete()   
        .eq("note_id", noteId)
        .eq("note_creator", playerId);

    return await runSupabaseQuery(query);
}