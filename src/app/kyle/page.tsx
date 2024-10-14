"use client"

import React from 'react'
import { useChat } from 'ai/react'
import ReactMarkdown from 'react-markdown'
import 'katex/dist/katex.min.css'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { Send } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ReactNode } from 'react'

const FormattedText = ({ content }: { content: string }) => (
  <ReactMarkdown
    remarkPlugins={[remarkMath]}
    rehypePlugins={[rehypeKatex]}
    className="prose prose-invert max-w-none"
    components={{
      p: ({ children }) => <p>{highlightPageNumbers(children)}</p>,
    }}
  >
    {content}
  </ReactMarkdown>
)

const highlightPageNumbers = (children: ReactNode): ReactNode => {
  if (typeof children !== 'string') return children;
  
  const parts = children.split(/(\[Page \d+\])/);
  return parts.map((part, index) => {
    if (part.match(/\[Page \d+\]/)) {
      return (
        <span key={index} className="bg-yellow-500 text-black px-1 rounded">
          {part}
        </span>
      );
    }
    return part;
  });
};

export default function LinearAlgebraChat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat()

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100">
      <header className="bg-gray-800 p-6 text-2xl font-bold text-center shadow-md">
        Linear Algebra Chat
      </header>
      <ScrollArea className="flex-grow p-6 space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-3xl p-4 rounded-2xl shadow-lg ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-100'
              }`}
            >
              <FormattedText content={message.content} />
            </div>
          </div>
        ))}
      </ScrollArea>
      <form onSubmit={handleSubmit} className="p-6 bg-gray-800 shadow-inner">
        <div className="flex space-x-4 max-w-4xl mx-auto">
          <Input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Ask a question about linear algebra..."
            className="flex-grow bg-gray-700 text-gray-100 border-gray-600 rounded-full py-3 px-6 focus:ring-2 focus:ring-blue-500"
          />
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 rounded-full p-3 transition-colors duration-200">
            <Send className="h-6 w-6" />
          </Button>
        </div>
      </form>
    </div>
  )
}
