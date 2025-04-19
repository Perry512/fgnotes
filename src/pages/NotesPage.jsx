import React from "react";
import DisplayNotesFull from "../components/DisplayNotesFull";
import PostNote from "../components/PostNote";

const NotesPage = () => {
    return (
        <>
            <PostNote />
            <div className="my-9"> 
                
            </div>
            <DisplayNotesFull />
        </>
    )
}

export default NotesPage;