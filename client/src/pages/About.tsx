import React from 'react';
import { GraduationCap, Heart, Coffee, Github, Linkedin, Twitter } from 'lucide-react';

export default function About() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-16 mb-24 relative">
      {/* Ambient Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 blur-[120px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 blur-[100px] -z-10" />

      <div className="max-w-4xl mx-auto text-center mb-12 relative z-10">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-10 pb-1 leading-[1.05] tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-primary to-blue-500 dark:from-blue-300 dark:to-blue-500 relative z-10">
          About
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed relative z-10">
          The mission, values, and people behind privateNote.ai.
        </p>
      </div>

      <div className="space-y-6 max-w-4xl mx-auto">
        <section className="backdrop-blur-sm p-6 rounded-lg border border-gray-100 dark:border-gray-800">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center flex-shrink-0 mx-auto md:mx-0">
              <img
                src="/mare.jpeg"
                alt="Marjan Skrobot"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <div>
              <h2 className="text-xl font-medium mb-2 text-center md:text-left">Marjan Skrobot, Ph.D.</h2>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4 justify-center md:justify-start">
                <GraduationCap className="h-4 w-4 mr-1" />
                <span>Cryptography and Security Protocols</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                I am passionate about personal freedom, the right to privacy, and making the world a bit better 
                every day with a smile and warm connections. With a background in advanced cryptography, I've 
                dedicated my career to protecting digital privacy and developing secure communication tools that 
                respect fundamental human rights.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                My journey in cryptography began with a fascination for mathematics and evolved into a deep commitment 
                to applying these principles to real-world privacy challenges. I believe that privacy isn't just a 
                technical feature—it's a fundamental right that underpins our freedom of expression, thought, and association.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Through privateNote.ai, I aim to provide a simple yet powerful tool that makes secure communication 
                accessible to everyone. Beyond the technical aspects, I value human connection and believe that 
                privacy technologies should enhance, rather than replace, meaningful human interactions.
              </p>
            </div>
          </div>
        </section>

        <section className="backdrop-blur-sm p-6 rounded-lg border border-gray-100 dark:border-gray-800">
          <div className="flex items-start mb-4">
            <Heart className="h-6 w-6 text-primary mr-3 mt-1" />
            <div>
              <h2 className="text-xl font-medium mb-2">My Mission</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                I believe that privacy is essential for personal freedom and democracy to flourish. My mission is to:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                <li>Create accessible, user-friendly privacy tools that anyone can use</li>
                <li>Educate people about digital privacy and security best practices</li>
                <li>Advocate for stronger privacy protections in our increasingly digital world</li>
                <li>Bridge the gap between complex cryptography and everyday users</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="backdrop-blur-sm p-6 rounded-lg border border-gray-100 dark:border-gray-800">
          <div className="text-center">
            <h2 className="text-xl font-medium mb-4">Support My Work</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-lg mx-auto">
              If you find privateNote.ai valuable, consider supporting my work. Your contribution helps me maintain this service and develop new privacy-focused tools.
            </p>
            <a 
              href="https://www.buymeacoffee.com/marjanskrobot" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#FFDD00] text-black font-medium rounded-lg hover:bg-[#FFDD00]/90 transition-colors"
            >
              <Coffee className="h-5 w-5" />
              <span>Buy Me a Coffee</span>
            </a>
          </div>
        </section>

        <section className="backdrop-blur-sm p-6 rounded-lg border border-gray-100 dark:border-gray-800">
          <div className="text-center">
            <h2 className="text-xl font-medium mb-4">Connect With Me</h2>
            <div className="flex justify-center gap-4">
              <a 
                href="https://github.com/marjanskrobot" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="https://linkedin.com/in/marjanskrobot" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a 
                href="https://twitter.com/marjanskrobot" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
