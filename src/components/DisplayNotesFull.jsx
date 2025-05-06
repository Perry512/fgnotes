import { Spinner } from "flowbite-react";
import { NOTE_TAGS } from "../constants/noteTags";

export default function DisplayNotesFull({notes, loading, deleteNote, error}) {
    console.log("Notes: ", notes);

    return (
        <div className="border my-2 space-y">
            {loading && <div className="text-right"><Spinner /></div>}
            {error && <p className="text-red-500">{error.message || JSON.stringify(error)}</p>}
            {!loading && !error && notes.length === 0 && <p>No notes found</p>}
            {!loading && !error && notes.map((note) => (
                <div key={note.note_id} className="relative">
                    <div className="absolute right-0 top-0 h-full w-5 rounded-r overflow-hidden flex flex-col">
                        {note.note_tag?.map((tag, i) => (
                            <div 
                                key={`${note.note_id}-${tag}-${i}`}
                                className="w-full"
                                style={{
                                    backgroundColor: NOTE_TAGS[tag]?.color || "#6B7280",
                                    flex: 1,
                                }}
                            />
                        ))}
                </div>
                <div className="border-b p-4 space-y-9">
                    <h3 className="font-bold">{note.note_title || "Untitled"}</h3>
                    <p>{note.note_content || "No content available"}</p>
                    <button onClick={() => { deleteNote(note.note_id)}}> Delete </button>
                </div>
                </div>
            ))}
        </div>
    );
}
