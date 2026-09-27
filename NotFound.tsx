import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileWarning } from 'lucide-react';

const NotFound: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="not-found-container">
            <FileWarning size={48} className="not-found-icon" />
            <h2 className="not-found-title">Oops! Page Not Found</h2>
            <p className="not-found-text">
                The note you're looking for doesn't exist or has already been read.
            </p>
            <button className="button button-primary" onClick={() => navigate('/')}>
                Create a New Note
            </button>
        </div>
    );
};

export default NotFound;
