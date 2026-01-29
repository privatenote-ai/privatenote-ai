import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Globe, Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLanguageOpen, setIsLanguageOpen] = useState(false);
    const languageRef = useRef<HTMLDivElement>(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (languageRef.current && !languageRef.current.contains(event.target as Node)) {
                setIsLanguageOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMenuOpen(false);
    }, [window.location.pathname]);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left: Hamburger Menu */}
                    <button
                        className="md:hidden -ml-2 p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        aria-label="Toggle Menu"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-expanded={isMenuOpen}
                    >
                        {isMenuOpen ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <Menu className="h-5 w-5" />
                        )}
                    </button>

                    {/* Center: Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <span className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent">
                            PrivateNote
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">.ai</span>
                    </Link>

                    {/* Right: Sign In + Language Selector */}
                    <div className="flex items-center gap-2">
                        <Link
                            to="/account/security"
                            className="hidden sm:inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            Security
                        </Link>
                        <Link
                            to="/auth"
                            className="hidden sm:inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                        >
                            Sign In
                        </Link>
                        <button
                            className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                            onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                        >
                            <Globe className="h-4 w-4" />
                            <span className="text-sm font-medium">EN</span>
                        </button>
                        {isLanguageOpen && (
                            <div className="absolute top-16 right-4 w-48 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg">
                                <div className="py-1">
                                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                                        English
                                    </button>
                                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                                        Deutsch
                                    </button>
                                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                                        Español
                                    </button>
                                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                                        Français
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
                    <div className="container mx-auto px-4 py-2">
                        <div className="flex flex-col space-y-1">
                            <Link
                                to="/"
                                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                            >
                                Share Private Note
                            </Link>
                            <Link
                                to="/generate-password"
                                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                            >
                                Password Generator
                            </Link>
                            <Link
                                to="/blog"
                                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                            >
                                Blog
                            </Link>
                            <Link
                                to="/about"
                                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                            >
                                About
                            </Link>
                            <Link
                                to="/contact"
                                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                            >
                                Contact
                            </Link>
                            <Link
                                to="/account/security"
                                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                            >
                                Security
                            </Link>
                            <Link
                                to="/auth"
                                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                            >
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
