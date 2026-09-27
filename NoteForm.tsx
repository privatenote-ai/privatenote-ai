import React from 'react';


interface NoteFormProps {
    noteContent: string;
    setNoteContent: (content: string) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    isLoading: boolean;
    noteUrl: string | null;
    copyToClipboard: () => void;
}

const NoteForm: React.FC<NoteFormProps> = ({
    noteContent,
    setNoteContent,
    handleSubmit,
    isLoading,
    noteUrl,
    copyToClipboard
}) => {
    return (
        <div className="note-form-container">
            <form onSubmit={handleSubmit} className="note-form">
                <textarea
                    placeholder="Write your private message here..."
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    rows={10}
                    required
                    className="note-textarea"
                />

                <button type="submit" disabled={isLoading} className="note-button primary">
                    {isLoading ? 'Encrypting...' : 'Create Encrypted Note'}
                </button>
            </form>

            {noteUrl && (
                <div className="note-url-container">
                    <input
                        type="text"
                        value={noteUrl}
                        readOnly
                        className="note-url-input"
                    />
                    <button onClick={copyToClipboard} className="note-button outline">
                        📋 Copy Secure Link
                    </button>
                </div>
            )}

            <p className="note-form-footer">
                <strong>PrivateNote.ai</strong> offers <strong>end-to-end encrypted notes</strong> for maximum security.
                More secure than PrivNote, with <strong>client-side encryption</strong> ensuring your messages stay private.
            </p>
        </div>
    );
};

export default NoteForm;
