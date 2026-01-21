import React from 'react';
import { Link } from 'wouter';
import { Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="relative overflow-hidden bg-blue-600 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 right-1/3 h-64 w-64 rounded-full bg-white/10 blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 h-56 w-56 rounded-full bg-white/10 blur-[120px]" />
      </div>
      <div className="max-w-5xl mx-auto px-4 py-10 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-white/80">
            <Link 
              href="/how-it-works" 
              className="hover:text-white transition-colors"
            >
              How It Works
            </Link>
            <Link 
              href="/privacy" 
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link 
              href="/terms" 
              className="hover:text-white transition-colors"
            >
              Terms of Use
            </Link>
            <Link 
              href="/about" 
              className="hover:text-white transition-colors"
            >
              About
            </Link>
            <Link 
              href="/password-generator" 
              className="hover:text-white transition-colors"
            >
              Password Generator
            </Link>
            <Link 
              href="/blog" 
              className="hover:text-white transition-colors"
            >
              Blog
            </Link>
            <Link 
              href="/contact" 
              className="hover:text-white transition-colors"
            >
              Contact
            </Link>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-white/80">
            <Shield className="h-3.5 w-3.5 text-white/70" />
            <span>&copy; {currentYear} privateNote.ai — End-to-end encrypted notes</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
