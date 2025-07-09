import { useEffect, useState } from "react";
import { NOTE_TAGS } from "../constants/noteTags";
import { MultiSelectDropdown } from "./MultiSelectDropdown";
import { UserAuth } from "../context/AuthContext";
import { updateNoteTag } from "../utilities/noteUtils";

export function TagsDropdown({note, loading: parentLoading}) {
    const [currentTags, setCurrentTags] = useState(note.note_tag || []);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (note?.note_creator) {
            setCurrentTags(note.note_tag || []);
        }
    }, [note.note_tag]);

    const handleSave = async () => {
        setLoading(true);

        const { error } = await updateNoteTag(note.note_id, currentTags)

        if (error) {
            console.error("TagsDropdown: Error updating note tags", error);
            setError(error);
        } else {
            console.log("TagsDropdown: Note tags updated successfully");
        }

        setLoading(false);

        if (!loading || !note || parentLoading) {
            return <Spinner />
        }

        if (error) {
            return (
                <button> {":("} </button>
            )
        }
    }

    return (
        <MultiSelectDropdown
            options={
                NOTE_TAGS
                ? Object.keys(NOTE_TAGS).map((key) => NOTE_TAGS[key].name)
                : []
            }
            selected={
                NOTE_TAGS && currentTags
                ? currentTags.map((key) => NOTE_TAGS[key]?.name || key)
                : []
            }
            onChange={(selectedNames) => {
                const updatedKeys = selectedNames.map((name) =>
                    Object.keys(NOTE_TAGS).find((key) => NOTE_TAGS[key].name === name)
            );
    setCurrentTags(updatedKeys);
  }}
            onSave={handleSave}
            error={error}
        />
    )
}

export default TagsDropdown;