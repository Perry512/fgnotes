import React from "react";
import DisplayNotesFull from "../components/DisplayNotesFull";
import PostNote from "../components/PostNote";

const NotesPage = () => {
    return (
        <>
            <DisplayNotesFull />
            <div className="my-9"> 
                
            </div>
            <PostNote />
        </>
    )
}

export default NotesPage;