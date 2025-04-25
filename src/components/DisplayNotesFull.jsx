import { useNotes } from "../hooks/useNotes";
import { Spinner } from "flowbite-react";

export default function DisplayNotesFull() {
    const { notes, loading, deleteNote, error } = useNotes();

    console.log("Notes: ", notes);

    return (
        <div className="border my-2 space-y">
            {loading && <div className="text-right"><Spinner /></div>}
            {error && <p className="text-red-500">{error.message || JSON.stringify(error)}</p>}
            {!loading && !error && notes.length === 0 && <p>No notes found</p>}
            {!loading && !error && notes.map((note, index) => (
                <div key={index} className="border-b p-4 space-y-9">
                    <h3 className="font-bold">{note.note_title || "Untitled"}</h3>
                    <p>{note.note_content || "No content available"}</p>
                    <button onClick={() => { deleteNote(note.note_id)}}> Delete </button>
                </div>
            ))}
        </div>
    );
}