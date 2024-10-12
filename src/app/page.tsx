"use client"

import { useChat } from 'ai/react';
import FormattedText from '@/components/FormattedText';

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center font-mono text-sm">
        <h1 className="text-4xl font-bold mb-4 text-center">Linear Algebra Chat</h1>
        <div className="mt-8">
          {messages.map((m) => (
            <div key={m.id} className="mb-4">
              <div className="font-bold ">{m.role === 'user' ? 'You:' : 'AI:'}</div>
              <FormattedText content={m.content} />
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="mt-8 flex flex-row items-center justify-center">
          <input
            className="w-full max-w-md p-2 border text-black border-gray-300 rounded"
            value={input}
            onChange={handleInputChange}
            placeholder="Ask a question about linear algebra..."
          />
          <button type="submit" className="ml-2 p-2 bg-blue-500 text-white rounded">Send</button>
        </form>
      </div>
    </main>
  );
}