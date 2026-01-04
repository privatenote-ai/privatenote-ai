import React, { useEffect, useState } from 'react';
import { useRoute } from 'wouter';
import { NoteDisplay } from '@/components/note/NoteDisplay';

const ViewNote: React.FC = () => {
  const [match, params] = useRoute('/note/:id');
  const [key, setKey] = useState<string | null>(null);
  
  useEffect(() => {
    // Get key from URL fragment
    const hash = window.location.hash.substring(1); // Remove the # character
    if (hash) {
      setKey(hash);
      
      // Remove the key from the URL for security
      history.replaceState(null, '', window.location.pathname);
    }
  }, []);
  
  if (!match || !params.id) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Note Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300">
            The note you're looking for doesn't exist or has already been read.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <NoteDisplay id={params.id} encryptionKey={key} />
    </div>
  );
};

export default ViewNote;
