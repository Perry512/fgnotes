import { Spinner } from "flowbite-react";
import { NOTE_TAGS } from "../constants/noteTags";

export default function DisplayNotesFull({notes, loading, deleteNote, error}) {
    console.log("Notes: ", notes);

    const handleEditTags = (noteId) => {
        console.log("edit tags for: ", noteId);
    }

 return (
    <div className="my-2 space-y">
      {loading && (
        <div className="text-right">
          <Spinner />
        </div>
      )}
      {error && <p className="text-red-500">{error.message || JSON.stringify(error)}</p>}
      {!loading && !error && notes.length === 0 && <p>No notes found</p>}

      {!loading &&
        !error &&
        notes.map((note) => (
          <div
            key={note.note_id}
            className="relative flex w-full max-w-2xl mx-auto border rounded-lg shadow-md overflow-hidden bg-gray-900"
            style={{ minHeight: "300px" }}
          >
            {/* Left Section (Title + Content) */}
            <div className="flex-1 flex flex-col p-4 space-y-4">
              <h3 className="text-white text-lg font-bold border-b border-gray-700 pb-2">
                {note.note_title || "Untitled"}
              </h3>
              <p className="text-gray-300 flex-1">{note.note_content || "No content available"}</p>
              <button
                className="text-red-400 text-sm underline"
                onClick={() => deleteNote(note.note_id)}
              >
                Delete
              </button>
            </div>

            {/* Right Sidebar (Tags + Add) */}
            <div className="flex flex-col justify-between bg-gray-800 p-1">
              <div className="flex flex-col items-center space-y-1">
                {note.note_tag?.map((tag, i) => (
                  <div
                    key={`${note.note_id}-${tag}-${i}`}
                    className="w-6 h-6 rounded-sm"
                    style={{
                      backgroundColor: NOTE_TAGS[tag]?.color || "#6B7280",
                    }}
                  />
                ))}
              </div>
              <button
                className="w-6 h-6 mt-2 bg-yellow-400 text-black font-bold text-sm rounded-sm hover:bg-yellow-500"
                onClick={() => handleEditTags(note.note_id)}
              >
                +
              </button>
            </div>
          </div>
        ))}
    </div>
  );
}