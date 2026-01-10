import React, { useState, useEffect } from 'react';
import { Shield, Copy, RefreshCw, Lock, Unlock, Eye, EyeOff } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { decryptNote, importKey, decryptWithPassword, base64ToArrayBuffer } from '@/utils/encryption';
import { useToast } from '@/hooks/use-toast';
import { SecurityRecommendations } from '@/components/features/SecurityRecommendations';

interface NoteDisplayProps {
  id: string;
  encryptionKey: string | null;
}

interface NoteData {
  content: string;
  iv: string;
  readCount: number;
  maxReads: number;
  expiresAt: string;
  isPasswordProtected?: boolean;
  salt?: string;
  encryptedKey?: string;
  encryptedKeyIv?: string;
}

export const NoteDisplay: React.FC<NoteDisplayProps> = ({ id, encryptionKey }) => {
  const [noteContent, setNoteContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [readCount, setReadCount] = useState<number | null>(null);
  const [maxReads, setMaxReads] = useState<number | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [noteData, setNoteData] = useState<NoteData | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const [hasRevealed, setHasRevealed] = useState(false);
  const { toast } = useToast();

  const getUserFriendlyError = (message: string) => {
    if (message.startsWith("404:") || message.includes("Note not found")) {
      return "This note is unavailable or has already been read.";
    }
    if (message.includes("Note has expired")) {
      return "This note has expired.";
    }
    return message;
  };

  const base64ToUint8Array = (value: string) => {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
    let padded = normalized;
    while (padded.length % 4 !== 0) {
      padded += '=';
    }
    return Uint8Array.from(atob(padded), c => c.charCodeAt(0));
  };

  useEffect(() => {
    if (!id) {
      setError('Invalid note ID');
      setIsLoading(false);
    }
  }, [id]);

  const decryptWithKey = async (data: NoteData, key: string) => {
    try {
      // Decode base64 content and IV
      const encryptedData = base64ToUint8Array(data.content);
      const ivArray = base64ToUint8Array(data.iv);
      
      console.log("Importing key:", key);
      const cryptoKey = await importKey(key);
      
      // Decrypt the note
      console.log("Decrypting content with key");
      const decryptedContent = await decryptNote(encryptedData, cryptoKey, ivArray);
      setNoteContent(decryptedContent);
    } catch (cryptoError) {
      console.error("Crypto error:", cryptoError);
      throw new Error("Failed to decrypt the note. The encryption key may be invalid.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReveal = async () => {
    if (!id) {
      setError('Invalid note ID');
      return;
    }

    setIsRevealing(true);
    setIsLoading(true);
    setError(null);

    try {
      const data = await apiRequest(`/api/notes/${id}/reveal`, "POST");

      setReadCount(data.readCount);
      setMaxReads(data.maxReads);
      setExpiresAt(data.expiresAt);
      setIsPasswordProtected(data.isPasswordProtected || false);
      setNoteData(data);
      setHasRevealed(true);

      if (data.isPasswordProtected) {
        setIsLoading(false);
        return;
      }

      if (!encryptionKey) {
        throw new Error("Missing encryption key in URL. The note cannot be decrypted.");
      }

      await decryptWithKey(data, encryptionKey);
    } catch (error) {
      console.error('Error revealing note:', error);
      if (error instanceof Error) {
        const friendlyMessage = getUserFriendlyError(error.message);
        setError(friendlyMessage);
        toast({
          title: "Error",
          description: friendlyMessage,
          variant: "destructive",
        });
      } else {
        setError('The note could not be retrieved or has already been read');
        toast({
          title: "Error",
          description: "The note could not be retrieved or has already been read",
          variant: "destructive",
        });
      }
      setIsLoading(false);
      setHasRevealed(false);
    } finally {
      setIsRevealing(false);
    }
  };
  
  const handlePasswordDecrypt = async () => {
    if (!password.trim()) {
      toast({
        title: "Error",
        description: "Please enter the password",
        variant: "destructive",
      });
      return;
    }
    
    if (!noteData) {
      toast({
        title: "Error",
        description: "Missing note data",
        variant: "destructive",
      });
      return;
    }
    
    const wrappedKey = encryptionKey || null;
    
    // Check if we have all the required fields for password decryption
    if (!wrappedKey || !noteData.encryptedKeyIv || !noteData.salt) {
      toast({
        title: "Error",
        description: "This note is missing required password protection fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsDecrypting(true);
    
    try {
      // At this point we're guaranteed that noteData and all required fields exist due to our previous checks
      // Convert base64 strings to Uint8Array objects
      const encryptedData = base64ToUint8Array(noteData.content);
      const ivArray = base64ToUint8Array(noteData.iv);
      const encryptedKey = base64ToArrayBuffer(wrappedKey);
      const encryptedKeyIv = base64ToUint8Array(noteData.encryptedKeyIv!);
      const salt = base64ToUint8Array(noteData.salt!);
      
      // Decrypt using password
      const decryptedContent = await decryptWithPassword(
        encryptedData,
        ivArray,
        encryptedKey,
        encryptedKeyIv,
        salt,
        password
      );
      
      setNoteContent(decryptedContent);
      
      // Hide password input after successful decryption
      setIsPasswordProtected(false);
      
      toast({
        title: "Success",
        description: "Note decrypted successfully",
      });
    } catch (error) {
      console.error("Password decryption error:", error);
      toast({
        title: "Error",
        description: "Failed to decrypt note. The password may be incorrect.",
        variant: "destructive",
      });
    } finally {
      setIsDecrypting(false);
    }
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(noteContent);
    toast({
      title: "Copied!",
      description: "Note content copied to clipboard",
    });
  };
  
  const handleCreateNew = () => {
    window.location.href = '/';
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden p-6">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <Shield className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Note Unavailable</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <button 
            onClick={handleCreateNew}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
          >
            Create New Note
          </button>
          
          <div className="mt-8">
            <SecurityRecommendations type="compact" context="error" />
          </div>
        </div>
      </div>
    );
  }

  if (!hasRevealed) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden p-6">
        <div className="text-center">
          <div className="text-primary mb-4">
            <Shield className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Reveal Secure Note</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            For your privacy, the note is only retrieved after you click reveal.
          </p>
          <button
            onClick={handleReveal}
            disabled={isRevealing}
            className="w-full flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRevealing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Revealing...
              </>
            ) : (
              <>
                <Unlock className="h-4 w-4 mr-2" />
                Reveal Note
              </>
            )}
          </button>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            This action may consume the note depending on its read limits.
          </p>
          <div className="mt-8">
            <SecurityRecommendations type="compact" context="general" />
          </div>
        </div>
      </div>
    );
  }
  
  // If password protected and not yet decrypted, show password input
  if (isPasswordProtected && !noteContent) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden p-6">
        <div className="text-center">
          <div className="text-primary mb-4">
            <Lock className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Password Protected Note</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            This note is protected with a password. Enter the password to decrypt it.
          </p>
          
          <div className="max-w-sm mx-auto">
            <div className="mb-4 relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-primary pr-10"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handlePasswordDecrypt();
                  }
                }}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <button
              onClick={handlePasswordDecrypt}
              disabled={isDecrypting || !password.trim()}
              className="w-full flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDecrypting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Decrypting...
                </>
              ) : (
                <>
                  <Unlock className="h-4 w-4 mr-2" />
                  Decrypt Note
                </>
              )}
            </button>
          </div>
          
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            If you don't have the password, you won't be able to decrypt this note.
          </p>
          
          <div className="mt-8">
            <SecurityRecommendations type="compact" context="general" />
          </div>
        </div>
      </div>
    );
  }

  // Regular note content view (either after password decryption or for non-password notes)
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className="px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Shield className="h-5 w-5 mr-2 text-primary" />
            Secure Note
          </h2>
          <div className="flex flex-col items-end">
            {maxReads && maxReads > 0 ? (
              <span className="text-sm text-amber-600 dark:text-amber-400">
                Read {readCount} of {maxReads} times
              </span>
            ) : (
              <span className="text-sm text-green-600 dark:text-green-400">
                Unlimited reads
              </span>
            )}
            {expiresAt && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Expires: {new Date(expiresAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-6 whitespace-pre-wrap break-words border border-gray-200 dark:border-gray-700">
          {noteContent}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy to Clipboard
          </button>
          <button 
            onClick={handleCreateNew}
            className="flex-1 flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Create New Note
          </button>
        </div>
        
        <SecurityRecommendations type="compact" context="general" />
      </div>
    </div>
  );
};
