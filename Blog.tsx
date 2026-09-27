import React from 'react';
import { Link } from 'react-router-dom';

const Blog: React.FC = () => {
    const categories = [
        { id: 'private-notes', name: 'Private Notes' },
        { id: 'secure-messaging', name: 'Secure Messaging' },
        { id: 'anonymous-browsing', name: 'Anonymous Browsing' },
        { id: 'secure-email', name: 'Secure Email' },
        { id: 'secure-browsing', name: 'Secure Browsing' },
        { id: 'passwords', name: 'Passwords' }
    ];

    return (
        <div className="blog-container">
            <div className="blog-header">
                <h1>PrivateNote Blog</h1>
                <div className="blog-divider"></div>
                <p className="blog-subtitle">Stories, insights, and advice about privacy and secure communication.</p>
            </div>

            <div className="blog-categories">
                {categories.map(category => (
                    <Link
                        key={category.id}
                        to={`/blog/${category.id}`}
                        className="blog-category-link"
                    >
                        {category.name}
                    </Link>
                ))}
            </div>

            <div className="blog-breadcrumbs">
                <Link to="/">Home</Link>
                <span className="breadcrumb-separator">/</span>
                <span>Blog</span>
            </div>
        </div>
    );
};

export default Blog;
