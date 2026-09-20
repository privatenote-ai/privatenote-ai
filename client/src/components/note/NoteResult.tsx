import React, { useState } from 'react';
import { Shield, Copy } from 'lucide-react';
import QRCode from 'react-qr-code';
import { useToast } from '@/hooks/use-toast';

interface NoteResultProps {
  noteUrl: string;
  onCreateNew: () => void;
}

export const NoteResult: React.FC<NoteResultProps> = ({ noteUrl, onCreateNew }) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(noteUrl);
      setCopied(true);
      void import("@/utils/productAnalytics").then(({ trackNamedEvent }) => {
        trackNamedEvent("note_link_copied");
      }).catch(() => {});
      toast({
        title: "Copied!",
        description: "Link copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };
  
  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Secure Note Created</h2>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="note-url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Share this secure link
              </label>
              <div className="flex">
                <input 
                  type="text" 
                  id="note-url" 
                  value={noteUrl}
                  className="flex-1 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4 py-2 focus:ring-primary focus:border-primary"
                  readOnly
                />
                <button 
                  onClick={handleCopy}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 text-sm font-medium rounded-r-md text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  {copied ? (
                    <>
                      <span className="text-green-600 dark:text-green-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                The link contains the decryption key. Anyone with this link can read your note.
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                QR Code
              </label>
              <div className="w-48 h-48 bg-white p-2 rounded-lg">
                <QRCode
                  size={180}
                  value={noteUrl}
                  viewBox={`0 0 180 180`}
                />
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Scan this code to access your note
              </p>
            </div>
            
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Security Level</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                  <Shield className="h-3 w-3 mr-1" />
                  Very Strong
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                AES-256-GCM encryption with 256-bit key
              </p>
            </div>
            
            <div>
              <button 
                onClick={onCreateNew}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
              >
                Create Another Note
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
