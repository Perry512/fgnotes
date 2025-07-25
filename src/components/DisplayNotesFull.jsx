import { Spinner } from "flowbite-react";
import { NOTE_TAGS } from "../constants/noteTags";
import { TagsDropdown } from "./TagsDropdown";

export default function DisplayNotesFull({
  notes,
  loading,
  deleteNote,
  error,
}) {
  return (
    <div className="my-2 space-y">
      {loading && (
        <div className="text-right">
          <Spinner />
        </div>
      )}
      {error && (
        <p className="text-red-500">{error.message || JSON.stringify(error)}</p>
      )}
      {!loading && !error && notes.length === 0 && <p>No notes found</p>}

      {!loading &&
        !error &&
        notes.map((note) => (
          <div
            key={note.note_id}
            className="relative flex w-full max-w-2xl mx-auto border rounded-lg shadow-md overflow-visible bg-gray-900"            style={{ minHeight: "300px" }}
          >
            {/* Left Section (Title + Content) */}
            <div className="flex-1 flex flex-col p-4 space-y-4">
              <h3 className="text-white text-lg font-bold border-b border-gray-700 pb-2">
                {note.note_title || "Untitled"}
              </h3>
              <p className="text-gray-300 flex-1">
                {note.note_content || "No content available"}
              </p>
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
                 className="relative group w-6 h-6 rounded-sm cursor-pointer flex items-center justify-center text-white text-xs font-semibold z-10"
                 style={{
                   backgroundColor: NOTE_TAGS[tag]?.color || "#6B7280",
                 }}
               >
                 {NOTE_TAGS[tag]?.name?.[0] || tag[0]}
               
                 <div
                   className="absolute top-1/2 left-full transform -translate-y-1/2 translate-x-1 bg-gray-800 text-white text-xs px-2 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300 pointer-events-none z-50"
                   style={{
                     backgroundColor: NOTE_TAGS[tag]?.color || "#374151",
                   }}
                 >
                   {NOTE_TAGS[tag]?.name || tag}
                 </div>
               </div>               
                ))}
              </div>

              <TagsDropdown note={note} error={error} />
            </div>
          </div>
        ))}
    </div>
  );
}