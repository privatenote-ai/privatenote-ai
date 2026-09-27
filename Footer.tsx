import React from 'react';
import { Link } from 'react-router-dom';


const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="footer-links">
                <Link to="/how-it-works">How It Works</Link>
                <Link to="/faq">FAQ</Link>
                <Link to="/privacy-policy">Privacy Policy</Link>
            </div>

            <div className="footer-contact">
                <p>
                    Have comments, ideas, or questions? Reach out at&nbsp;
                    <a href="mailto:info@privatenote.ai">info@privatenote.ai</a>
                </p>
                <p className="footer-disclaimer">
                    Remember to check our <Link to="/faq">FAQ</Link> and <Link to="/privacy-policy">Privacy Policy</Link> first.
                </p>
            </div>

            <span className="footer-copyright">
                © PrivateNote.ai {new Date().getFullYear()}
            </span>
        </footer>
    );
};

export default Footer;
