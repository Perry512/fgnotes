import { useEffect, useState }  from "react";
import { deleteNoteService, fetchPlayerNotes, getCachedPlayerNotes } from "../utilities/noteUtils";
import { resolveNotes } from "../utilities/resolveNotes";

export const useNotes = ({ userId }) => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadNotes = async () => {
        console.log("useNotes: userId in useNotes: ", userId);

        if (!userId) {
            setError("Player internal_id not available");
            setLoading(false);
            return;
        }

        setLoading(true);
        const { notes, status } = await resolveNotes(userId, { debounce: false, verbose: true});

        if (status === "error") {
            setError("Failed to fetch notes");
            setNotes([]);
        } else {
            console.log("useNotes fetchNotes: ", notes);
            setNotes(notes || []);
        }

        setLoading(false);
    }

    const deleteNote = async (noteId) => {
        if (!userId){
            setError("Player not available")
            return;
        } 

        setLoading(true);
        const result = await deleteNoteService(userId, noteId);
        if (result.error) {
            setError(result?.error);
            console.log("useNotes: deleteNoteService result", result)
        } else {
            await loadNotes();
        }

        setLoading(false);
    }

    useEffect(() => {
        const cached = getCachedPlayerNotes()
        if (cached?.notes) {
            setNotes(cached.notes);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (userId) {
            loadNotes();
        }
    }, [userId]);

    return { notes, loading, error, deleteNote, reloadNotes: loadNotes };

};