import { Notebook } from "lucide-react";
import { supabase } from "../supabaseClient";
import { runSupabaseQuery } from "./runSupabaseQuery";
import { data } from "react-router-dom";

const NOTES_CACHE_KEY = "cached:notes";

const buildCachePayload = (noteData) => ({
    value: noteData
    
});

export const fetchPlayerNotes = async (userId, { single = false } = {}) => {
    console.log("noteUtils: Calling resolveNotes", userId)
    const playerData = userId;

    if (!playerData) {
        //console.error("noteUtils: No player found for this user");
        return null;
    }

    if (!playerData || typeof userId !== "string") {
        // console.error("noteUtils: fetchPlayer: Invalid userId", playerData);
        return null;
    }

    let query = supabase
        .from("Note")
        .select("*")
        .eq("note_creator", playerData)
        .order("created_at", {ascending: false});

    if (single) {
        query = query.limit(1);
    }

    //console.log("Running Supabase query: ", query);
    const {data, error} = await runSupabaseQuery(query);
    if (error) {
        console.error("Error fetching player notes: ", error);
        return [];
    }

    //console.log("Fetched player notes: ", data);
    return data;
};

export const createNoteService = async (userId, noteTitle, noteContent, {verbose = false} = {}) => {
    if (!userId) {
        //console.error("createNoteService: No userId provided");
        return { error: "Missing userID" };
    }

    const query = supabase
        .from('Note')
        .insert([ {note_title: noteTitle,  note_content: noteContent, note_creator: userId} ])

    if (verbose) {
        //console.log("NoteTitle: ", noteTitle, "\nNoteContent: ", noteContent, "\nQuery: ", query);
    }
    const { error } = await runSupabaseQuery(query);

    if (error) {
        //console.error("createNoteService: Error inserting note: ", error);
        return { error };
    }

    return { success: true };
    
}

export const deleteNoteService = async (userId, noteId) => {
    if (!userId) {
        // console.error("noteUtils: No player found for this user");
        return { error: "No valid player ID" };
    }

    const query = supabase
        .from("Note")
        .delete()   
        .eq("note_id", noteId)
        .eq("note_creator", userId);

    const { error } = await runSupabaseQuery(query);
    if (error) { 
        // console.error("noteUtils: Error fetching player notes: ", error);
        return error;
    }

    return { success: true };
}

export const cachePlayerNotes = (noteData, options = {}) => {
    const { verbose = false } = options;
    localStorage.setItem(NOTES_CACHE_KEY, JSON.stringify(buildCachePayload(noteData)));
    if (verbose) console.log("noteUtils: Cached player notes: ", noteData);
}

export const updateCachedPlayerNotes = (noteData, options = {}) => {
    cachePlayerNotes(noteData, options);
}

export const getCachedPlayerNotes = ( options = {} ) => {
    const { verbose = false } = options;

    if (verbose) { console.log("noteUtils: Attempting getCachedPlayerNotes"); }
    
    try {
        const raw = localStorage.getItem(NOTES_CACHE_KEY);
        if (verbose) console.log("noteUtils: Raw: ", raw);
        if (!raw || raw === null)  {
            if (verbose) console.log("noteUtils: No cached player notes found");
            return null;
        }
        const parsed = JSON.parse(raw);
        if (verbose) { console.log("noteUtils: Parsed: ", parsed); }
        return parsed.value;
    } catch (err) {
        if (verbose) console.error("Error parsing cached player notes: ", err);
        return null;
    }
}

export const fetchAndCacheNotes = async (userId, options = {}) => {
    const { verbose = false } = options;
    if (verbose) console.log("noteUtils: Attempting fetchAndCacheNotes: ", userId);


    const notes = await fetchPlayerNotes(userId, { single: false });
    if (verbose) console.log("noteUtils: Fetched notes: ", notes);
    if (!notes) {
        console.error("noteUtils: Error fetching notes: ", notes);
        return null;
    }

    cachePlayerNotes(notes, options);
    if (verbose) console.log("noteUtils: Cached notes: ", notes);
    return notes;
}

export const clearCachedNotes = (options = {}) => {
    const { verbose = false } = options;
    localStorage.removeItem(NOTES_CACHE_KEY);
    if (verbose) console.log("noteUtils: Cleared cached notes");
}

export const updateNoteTag = async (note_id, newTags, options = {}) => {
    const { verbose = false } = options;
    if (!note_id || !Array.isArray(newTags)) {
        if (verbose) console.error("noteUtils: Invalid arguments for updateNoteTag");
        return { data: null, error: "Invalid arguments"}
    }

    const query = await supabase
        .from('Note')
        .upsert({ note_id, note_tag: newTags })
        .select();
    
    const { data, error } = await runSupabaseQuery(query);

    if (error) {
        if (verbose) console.error("noteUtils: Error updating Note Tags: ", error);
        return { error };
    }

    if (data) {
        if (verbose) console.log("noteUtils: Note Tag updated sucessfully: ", data);
        cachePlayerNotes(data, { verbose })
    }
    
    return { data, error };

};