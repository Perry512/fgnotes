import React from "react";
import DisplayNotesFull from "../components/DisplayNotesFull";
import PostNote from "../components/PostNote";
import { useNotes } from "../hooks/useNotes";
import { UserAuth } from "../context/AuthContext";
import { Spinner } from "flowbite-react";

const NotesPage = () => {
const { player } = UserAuth();
const { notes, loading, error, deleteNote, reloadNotes } = useNotes({ userId: player?.internal_id })

if (!player) return <Spinner />;

    return (
        <>
            <PostNote reloadNotes={reloadNotes}/>
            <div className="my-9"> 
                
            </div>
            <DisplayNotesFull notes={notes} loading={loading} error={error} deleteNote={deleteNote} />
        </>
    )
}

export default NotesPage;