import React from "react";
import DisplayNotesFull from "../components/DisplayNotesFull";
import PostNote from "../components/PostNote";
import Calendar from "../components/Calendar";
import { useNotes } from "../hooks/useNotes";
import { UserAuth } from "../context/AuthContext";

const NotesPage = () => {
const { player } = UserAuth();
if (!player) return;
const { notes, loading, error, deleteNote, reloadNotes } = useNotes({ userId: player?.internal_id })

    return (
        <>
            <PostNote reloadNotes={reloadNotes}/>
            <div className="my-9"> 
                
            </div>
            <DisplayNotesFull notes={notes} loading={loading} error={error} deleteNote={deleteNote} />
            <Calendar />
        </>
    )
}

export default NotesPage;