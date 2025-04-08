import { useState, useEffect } from "react";
import { UserAuth } from "../context/AuthContext";
import { fetchNotes } from "../utilities/fetchNotes";

export default function DisplayNotesFull() {
    const { session } = UserAuth();
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNote = async () => {
            if (!session?.user?.id) {
                console.error("No session found, exiting useEffect");
                setError("No session found");
                return;
            }

            setLoading(true);
            try {
                const result = await fetchNotes(session, {single:false});

                if(result.error) {
                    console.error("Error fetching note: ", error)
                    setError(error?.message || "Unknown error fetching notes");
                } else if (result) {
                    setNotes(result);
                }
            } catch (err) {
                console.error("Unexpected fetch error: ", result.error);
                setError("Unexpected Fetch Error");
            } finally {
                setLoading(false);
            }
        };

        fetchNote();
    }, [session]);

    return (
        <div className="border">
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && notes.length === 0 && <p>No notes found</p>}
            {!loading && !error && notes.map((note, index) => (
                <div key={index} className="border-b p-4">
                    <h3 className="font-bold">{note.note_title || "Untitled"}</h3>
                    <p>{note.note_content || "No content available"}</p>
                </div>
            ))}
        </div>
    );
}