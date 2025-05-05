import { useState, useEffect } from "react";
import { getNote } from "../services/getNote";
import { UserAuth } from "../context/AuthContext";

export default function DisplayNote() {
    const { session } = UserAuth();
    const [title, setTitle] = useState(null);
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
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
                const note = await getNote(session);
    
                if (error) {
                    console.error("Error fetching note:", error);
                    setError(error.message || "Unknown error fetching note");
                } else if (note) {
                    setTitle(note.note_title);
                    setContent(note.note_content);
                }
            } catch (err) {
                console.error("Fetch failed:", err);
                setError("Unexpected fetch failure");
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
            {!loading && !error && (
                <>
                    <div className="flex px-4 py-3 mt-4"> {title || "No Title Found"} </div>
                    <div className="flex px-4 py-3 mt-4"> {content || "No Content Found"} </div>
                </>
            )}
        </div>
    );
}