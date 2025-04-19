import { supabase } from "../supabaseClient";
import { runSupabaseQuery } from "./runSupabaseQuery";
import { resolvePlayer } from "./resolvePlayer";

export const fetchPlayerNotes = async (sessionOrUserId, { single = false } = {}) => {
    const player = await resolvePlayer(sessionOrUserId, {verbose: true});
    const playerData = player?.data || player;
    console.log("Player in fetchPlayerNotes: ", playerData);

    if (!playerData) {
        console.error("No player found for this user");
        return null;
    }

    const query = supabase
        .from("Note")
        .select("*")
        .eq("note_creator", playerData.internal_id)
        .order("created_at", {ascending: false});

    if (single) {
        query = query.limit(1);
    }

    console.log("Running Supabase query: ", query);
    const {data, error} = await runSupabaseQuery(query);
    if (error) {
        console.error("Error fetching player notes: ", error);
        return [];
    }

    console.log("Fetched player notes: ", data);
    return data;
};

export const createNoteService = async (session, noteTitle, noteContent, {verbose = false} = {}) => {
    
    console.log("Session: ", session);
    const player = await resolvePlayer( 
        {session, verbose}
    );

    const playerData = player?.data || player;

    console.log("Player: ", player);

    const query = supabase
        .from('Note')
        .insert([ {note_title: noteTitle,  note_content: noteContent, note_creator: playerData.internal_id} ])

    if (verbose) {
        console.log("Session: ", session, "\nNoteTitle: ", noteTitle, "\nNoteContent: ", noteContent, "\nQuery: ", query);
    }
    return runSupabaseQuery(query);
    
}

export const deleteNoteService = async (sessionOrUserId, noteId) => {
    const player = await resolvePlayer(sessionOrUserId, {verbose: true});
    if (!player) {
        console.error("No player found for this user");
        return null;
    }

    console.log("PlayerID: ", player.internal_id, "NoteID: ", noteId);

    const query = supabase
        .from("Note")
        .delete()   
        .eq("note_id", noteId)
        .eq("note_creator", playerData.internal_id);

    return await runSupabaseQuery(query);
}