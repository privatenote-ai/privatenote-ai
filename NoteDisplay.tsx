import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, CheckCircle, Trash2 } from 'lucide-react';



interface NoteDisplayProps {
    noteContent: string;
    isLoading: boolean;
    error: string | null;
    isDecrypted: boolean;
}

const NoteDisplay: React.FC<NoteDisplayProps> = ({ noteContent, isLoading, error, isDecrypted }) => {
    const [copied, setCopied] = useState(false);
    const navigate = useNavigate();

    const handleCopy = () => {
        navigator.clipboard.writeText(noteContent);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (isLoading) {
        return (
            <div className="note-loading">
                <div className="spinner"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="note-error">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="note-container">
            <div className="note-header">
                <h2>🔒 Secure Note</h2>
                <p className="note-destroyed">⚠️ This note has been destroyed after reading.</p>
            </div>

            {isDecrypted && (
                <>
                    <div className="note-box">
                        <pre>{noteContent}</pre>
                    </div>

                    <div className="note-actions">
                        <button className="note-button primary" onClick={handleCopy}>
                            {copied ? <CheckCircle size={18} /> : <Copy size={18} />} {copied ? "Copied!" : "Copy"}
                        </button>

                        <button className="note-button danger" onClick={() => navigate('/')}>
                            <Trash2 size={18} /> Create New Note
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default NoteDisplay;
