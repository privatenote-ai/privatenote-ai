import React, { useState } from 'react';
import { CreateNote } from '@/components/note/CreateNote';
import { NoteResult } from '@/components/note/NoteResult';
import { SecurityFeatures } from '@/components/features/SecurityFeatures';

const Home: React.FC = () => {
  const [showCreateNote, setShowCreateNote] = useState(true);
  const [noteUrl, setNoteUrl] = useState('');
  
  // This function would be called from NoteResult when user wants to create a new note
  const handleCreateNew = () => {
    setShowCreateNote(true);
  };
  
  // This would be used when a note is created and we want to show the result
  const handleNoteCreated = (url: string) => {
    setNoteUrl(url);
    setShowCreateNote(false);
  };
  
  return (
    <div className="pt-12 pb-20">
      {/* Hero Section */}
      <section className="px-4 pb-0 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            <span className="block">Your Messages,</span>
            <span className="block mt-1 text-primary">Your Privacy.</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            End-to-end encrypted notes that self-destruct after reading.
            More secure than alternatives, with client-side encryption ensuring your messages stay private.
          </p>
        </div>
      </section>

      {/* Create Note or Result - Main Feature */}
      <div className="mt-8 mb-8 py-4 px-4">
        <div className="max-w-3xl mx-auto">
          {showCreateNote ? (
            <CreateNote />
          ) : (
            <NoteResult noteUrl={noteUrl} onCreateNew={handleCreateNew} />
          )}
        </div>
      </div>

      {/* Security Features */}
      <SecurityFeatures />
    </div>
  );
};

export default Home;
