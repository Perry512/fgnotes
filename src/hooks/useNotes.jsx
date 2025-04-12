import { useEffect, useState }  from "react";
import { UserAuth } from "../context/AuthContext";
import { deleteNoteService, fetchPlayerNotes } from "../utilities/noteUtils";

export const useNotes = () => {
    const { session, player } = UserAuth();
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadNotes = async () => {
        setLoading(true);
        setError(null);

        console.log("Player in loadNotes: ", player);

        if (!player?.internal_id) {
            setError("Player not available");
            setLoading(false);
            return;
        }

        const { data, error } = await fetchPlayerNotes(player.internal_id);
        
        if (error) {
            setError(error);
        } else {
            console.log("useNotes data: ", data)
            setNotes(data || []);
        }

        setLoading(false);
    }

    const deleteNote = async (noteId) => {
        setLoading(true);
        setError(null);

        if (!player.internal_id){
            setError("Player not available")
            setLoading(false);
            return;
        } 

        const { error } = await deleteNoteService(player.internal_id, noteId);
        if (error) {
            setError(error);
        }
        //  else {
        //     await loadNotes();
        // }
        setLoading(false);
    }

    useEffect(() => {
        // console.log("Session: ", session);
        // console.log("Player: ", player);

        if (session && player?.internal_id) { loadNotes() };
    }, [session, player]);

    useEffect(() => {
        console.log("Notes state updated: ", notes);
    })

    return { notes, loading, error, deleteNote, reloadNotes: loadNotes   };
};