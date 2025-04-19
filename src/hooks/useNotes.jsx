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

        const playerData = player?.data || player;
        console.log("PlayerData in loadNotes: ", playerData);


        if (!playerData.internal_id) {
            setError("Player not available");
            setLoading(false);
            return;
        }

        const result = await fetchPlayerNotes(playerData.internal_id);
        
        console.log("Result from fetchPlayerNotes: ", result);
        if (result.error) {
            setError(error);
        } else {
            console.log("useNotes data: ", result)
            setNotes(result || []);
        }

        setLoading(false);
    }

    const deleteNote = async (noteId) => {
        // I will likely need to change player into playerData if delete isn't working
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
        console.log("Session in useEffect: ", session);
        console.log("Player in useEffect: ", player);

        if (session) { loadNotes() };
    }, [session, player]);

    useEffect(() => {
        console.log("Notes state updated: ", notes);
    }, [notes]);

    return { notes, loading, error, deleteNote, reloadNotes: loadNotes   };
};