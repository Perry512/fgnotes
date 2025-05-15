import { useEffect, useState } from "react";
import { NOTE_TAGS } from "../constants/noteTags";
import { MultiSelectDropdown } from "./MultiSelectDropdown";
import { updateNoteTag } from "../utilities/noteUtils";

export function TagsDropdown({note, loading: parentLoading}) {
    const [currentTags, setCurrentTags] = useState(Array.isArray(note.note_tag) ? note.note_tag : []);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log("TagsDropdown: ", note);
        if (note?.note_creator) {
            setCurrentTags(Array.isArray(note.note_tag) ? note.note_tag : []);
        }
    }, [note, parentLoading, loading]);

    const handleSave = async () => {
        setLoading(true);
        console.log("TagsDropdown: ", note)
        const { error } = await updateNoteTag(note.note_id, currentTags);

        if (error) {
            console.error("TagsDropdown: Error updating note tags", error);
            setError(error);
        } else {
            console.log("TagsDropdown: Note tags updated successfully");
        }

        setLoading(false);

    }

    return (
        <MultiSelectDropdown
            label="+"
            options={Object.values(NOTE_TAGS).map(tag => tag.name)}
            selected={currentTags.map(tagKey => NOTE_TAGS[tagKey]?.name)}
            onChange={(newTags) => {
                const tagKeys = newTags.map(
                    name => Object.keys(NOTE_TAGS).find(key => NOTE_TAGS[key].name === name)
                ).filter(Boolean);
                console.log("Selected tags updated to: ", newTags);
                setCurrentTags(tagKeys);
            }}
            onSave={handleSave}
            error={error}
        />
    )
}

export default TagsDropdown;