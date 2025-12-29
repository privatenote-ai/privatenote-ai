import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bs58 from "bs58";

const CreateNote: React.FC = () => {
  const [note, setNote] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  const generateNoteId = () => {
    const randomBytes = new Uint8Array(32);
    crypto.getRandomValues(randomBytes);
    return bs58.encode(randomBytes);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;

    setIsGenerating(true);
    try {
      const noteId = generateNoteId();
      // Here you would typically send the note to your backend
      // For now, we'll just navigate to the view page
      navigate(`/note/${noteId}`);
    } catch (error) {
      console.error("Error creating note:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="create-note">
      <h1>Create a Secure Note</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Enter your note here..."
          rows={10}
          required
        />
        <button type="submit" disabled={isGenerating}>
          {isGenerating ? "Generating..." : "Create Note"}
        </button>
      </form>
    </div>
  );
};

export default CreateNote;
