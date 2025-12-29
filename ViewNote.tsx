import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ViewNote: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [note, setNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        // Here you would typically fetch the note from your backend
        // For now, we'll just simulate a delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setNote('This is a sample note. In a real application, this would be fetched from the server.');
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Failed to load note');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchNote();
    }
  }, [id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="view-note">
      <h1>View Note</h1>
      {note && (
        <div className="note-content">
          <p>{note}</p>
        </div>
      )}
    </div>
  );
};

export default ViewNote;
