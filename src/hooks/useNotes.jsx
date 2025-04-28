import { useEffect, useState }  from "react";
import { UserAuth } from "../context/AuthContext";
import { deleteNoteService, fetchPlayerNotes } from "../utilities/noteUtils";
import { usePlayer } from "./usePlayer";

export const useNotes = () => {
    const { session } = UserAuth();
    const { player, loading: usePlayerLoading, error: usePlayerError } = usePlayer(session, {useData: true});
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadNotes = async () => {
        setLoading(true);
        setError(null);

        if (usePlayerLoading) {
            console.log("useNotes: Player is loading, returning early.");
            setLoading(false);
            return;
        }

        if (player === null || player === undefined) {
            setError("Player is null or undefined in useNotes.loadNotes");
            setLoading(false);
            usePlayerError("Player is null or undefined in useNotes.loadNotes");
            return;
        }

        if (error || usePlayerError) {
            console.log("useNotes: Error in usePlayer: ", error || usePlayerError);
            setLoading(false);
            return;
        }
        
        console.log("Player in useNotes: ", player);
        if (!player.internal_id) {
            setError("Player internal_id not available");
            setLoading(false);
            return;
        }
        const result = await fetchPlayerNotes(player.internal_id);
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
        // I will likely need to change player into player if delete isn't working
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

        setLoading(false);
    }

    useEffect(() => {
        console.log("Session in useEffect: ", session);
        console.log("Player in useEffect: ", player);

        if (session && player && !usePlayerLoading) { loadNotes() };
    }, [session, player]);

    useEffect(() => {
        console.log("Notes state updated: ", notes);
    }, [notes]);

    return { notes, loading, error, deleteNote, reloadNotes: loadNotes };
};