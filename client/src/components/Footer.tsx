import React from 'react';
import { Link } from 'wouter';
import { Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="backdrop-blur-sm border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 md:gap-x-8 text-xs text-gray-500 dark:text-gray-400">
          <Link 
            href="/privacy" 
            className="hover:text-primary dark:hover:text-primary transition-colors"
          >
            Privacy Policy
          </Link>
          <Link 
            href="/terms" 
            className="hover:text-primary dark:hover:text-primary transition-colors"
          >
            Terms of Use
          </Link>
          <Link 
            href="/about" 
            className="hover:text-primary dark:hover:text-primary transition-colors"
          >
            About
          </Link>
          <Link 
            href="/blog" 
            className="hover:text-primary dark:hover:text-primary transition-colors"
          >
            Blog
          </Link>
          <Link 
            href="/contact" 
            className="hover:text-primary dark:hover:text-primary transition-colors"
          >
            Contact
          </Link>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center justify-center">
            <Shield className="h-3 w-3 mr-1.5 text-primary/60" />
            <span>&copy; {currentYear} privateNote.ai - End-to-end encrypted notes</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
