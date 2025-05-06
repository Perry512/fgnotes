import React, { useState, useEffect } from 'react';
import { clearCachedNotes, createNoteService } from '../utilities/noteUtils';
import { UserAuth } from '../context/AuthContext';
import { NOTE_TAGS } from '../constants/noteTags';

export default function PostNote({ reloadNotes }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const { session, player } = UserAuth();

  const handleCreateNote = async(e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await createNoteService(session?.user?.id, title, content, { verbose: true });

      if (result.success) {
        setTitle("");
        setContent("");
        console.log("PostNotes: reloadNotes: ", reloadNotes);
        clearCachedNotes();
        await new Promise((r) => setTimeout(r, 300));
        await reloadNotes();
        console.log("PostNote: finished reload notes");
        return { success: true } 
      } else { 
        setError(result.error || "An error has occured creating note");
      }
    } catch (err) {
      setError("An error has occured");
      console.error("PostNote: An error has occurred while creating note, ", err);
    } finally {
      setLoading(false);
    }
  }
  
  return (
      <div className="max-w-xl mx-auto p-6 rounded-2xl shadow-md bg-slate-800 text-slate-100 space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-100">
          New Note
        </h2>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title..."
          className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 placeholder-slate-400 text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500"
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your note here..."
          rows="6"
          className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 placeholder-slate-400 text-slate-100 resize-none focus:outline-none focus:ring-2 focus:ring-slate-500"
        />

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          onClick={handleCreateNote}
          disabled={loading}
          type='button'
          className="w-full py-2 rounded-lg bg-slate-600 hover:bg-slate-500 transition-colors duration-200 disabled:opacity-50 text-white font-medium"
        >
          {loading ? 'Posting...' : 'Post Note'}
        </button>
      </div>
  );
}