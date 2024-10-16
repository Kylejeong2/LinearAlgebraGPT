"use client"

import { useChat } from 'ai/react';
import FormattedText from '@/components/FormattedText';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTitleMoved, setIsTitleMoved] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim()) {
      handleSubmit(e);
      setIsTyping(false);
      setIsTitleMoved(true);  // Set this to true when a question is submitted
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-zinc-900">
      <div className="z-10 max-w-5xl w-full items-center font-mono text-sm">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            x: isTitleMoved ? '-50%' : 0,
            fontSize: isTitleMoved ? '16px' : '36px',
            top: isTitleMoved ? '20px' : 'auto',
            left: isTitleMoved ? '120px' : 'auto',
          }}
          transition={{ duration: 0.5 }}
          className={`text-4xl font-bold mb-4 text-white ${
            isTitleMoved ? 'absolute' : 'text-center'
          }`}
        >
          Linear Algebra Chat
        </motion.h1>
        <div className="mt-8 h-[60vh] overflow-y-auto pr-4">
          {messages.map((m, index) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, x: m.role === 'user' ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`mb-4 p-4 rounded-2xl backdrop-blur-md ${
                m.role === 'assistant' 
                  ? 'bg-blue-400 bg-opacity-40 text-white' 
                  : 'bg-blue-300 bg-opacity-40 text-white'
              } shadow-lg`}
            >
              <div className="font-bold mb-2">{m.role === 'user' ? 'You:' : 'AI:'}</div>
              <FormattedText 
                content={m.content} 
                onPageHighlight={() => {}} 
                highlightedPage={null}
              />
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleFormSubmit} className="mt-8 flex flex-col items-center justify-center">
          <div className="w-full max-w-md relative">
            <input
              className="w-full p-3 pr-12 border text-black border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={input}
              onChange={(e) => {
                handleInputChange(e);
                setIsTyping(e.target.value.length > 0);
              }}
              placeholder="Ask a question about linear algebra..."
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              disabled={!isTyping}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="19" x2="12" y2="5" />
                <polyline points="5 12 12 5 19 12" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
