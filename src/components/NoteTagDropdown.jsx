import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { UserAuth } from "../context/AuthContext";
import { NOTE_TAGS } from "../constants/noteTags";
import { MultiSelectDropdown } from "./MultiSelectDropdown";

export function NoteTagDropdown() {
    const { session } = UserAuth();
    const [selectedTags, setSelectedTags] = useState([]);

}