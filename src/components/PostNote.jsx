import React, { useState, useEffect } from 'react';
import { Textarea } from '@headlessui/react';
import { createNoteService } from '../services/createNoteService';

export default function PostNote() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState(null);
  const [content, setContent] = useState(null);

  const handleCreateNote = async(e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await createNoteService(title, content);

      if (result.success) {
        return {success: true } 
      } else { 
        setError(result.error || "An error has occured creating note");
      }
    } catch (error) {
      setError("An error has occured", error);
    } finally {
      setLoading(false);
    }
  }
  
  return ( 
    <div>
      <Textarea onChange={(e) => {setTitle(e.target.value)}} placeholder='Title' className="flex"></Textarea>
      <Textarea onChange={(e) => {setContent(e.target.value)}} name="description" placeholder='content'></Textarea>
      <button className='mt-6 w-full' type='submit'> Post Note </button>
    </div>
  )
}