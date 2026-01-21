import React from 'react';
import { Mail, MessageSquare } from 'lucide-react';

export default function Contact() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-16 mb-24 relative">
      {/* Ambient Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 blur-[120px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 blur-[100px] -z-10" />

      <div className="max-w-4xl mx-auto text-center mb-12 relative z-10">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-10 pb-2 leading-[1.05] tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-primary to-blue-500 dark:from-blue-300 dark:to-blue-500 relative z-10">
          Contact
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed relative z-10">
          Questions, feedback, or support? Reach out anytime.
        </p>
      </div>

      <div className="space-y-6 max-w-4xl mx-auto">
        <section className="backdrop-blur-sm p-6 rounded-lg border border-gray-100 dark:border-gray-800">
          <div className="flex items-start mb-4">
            <MessageSquare className="h-6 w-6 text-primary mr-3 mt-1" />
            <div>
              <h2 className="text-xl font-medium mb-3">Get in Touch</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Have questions, feedback, or suggestions about privateNote.ai? I'd love to hear from you!
              </p>
              <div className="flex items-center mt-4">
                <Mail className="h-5 w-5 text-primary mr-2" />
                <a href="mailto:contact@privatenote.ai" className="text-primary hover:underline">
                  contact@privatenote.ai
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="backdrop-blur-sm p-6 rounded-lg border border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-medium mb-4">Support for privateNote.ai</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            If you're experiencing technical issues or have questions about using privateNote.ai, please include:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300 mb-4">
            <li>A detailed description of the issue</li>
            <li>Your browser and device information</li>
            <li>Screenshots if applicable (please do not include any sensitive information)</li>
          </ul>
          <p className="text-gray-700 dark:text-gray-300">
            For security reasons, never share your encryption keys or passwords with anyone, including privateNote.ai support.
          </p>
        </section>

        <section className="text-center p-8">
          <a 
            href="https://www.buymeacoffee.com/marjanskrobot" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#FFDD00] text-black font-medium rounded-lg hover:bg-[#FFDD00]/90 transition-colors"
          >
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
              <line x1="6" y1="1" x2="6" y2="4"></line>
              <line x1="10" y1="1" x2="10" y2="4"></line>
              <line x1="14" y1="1" x2="14" y2="4"></line>
            </svg>
            <span>Buy Me a Coffee</span>
          </a>
        </section>
      </div>
    </div>
  );
}
