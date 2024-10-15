import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import 'katex/dist/katex.min.css';

interface FormattedTextProps {
  content: string;
  onPageHighlight: (pageNumber: number) => void;
  highlightedPage: number | null;
}

const FormattedText: React.FC<FormattedTextProps> = ({ content, onPageHighlight, highlightedPage }) => {
  const pageRegex = /\(p\. (\d+)\)/g;

  const renderContent = (text: string) => {
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = pageRegex.exec(text)) !== null) {
      const [fullMatch, pageNumber] = match;
      const index = match.index;

      // Add text before the page number
      if (index > lastIndex) {
        parts.push(text.slice(lastIndex, index));
      }

      // Add the page number as a clickable span
      parts.push(
        <span
          key={index}
          onClick={() => onPageHighlight(parseInt(pageNumber))}
          className={`cursor-pointer ${
            parseInt(pageNumber) === highlightedPage ? 'bg-yellow-200' : 'hover:bg-gray-200'
          }`}
        >
          {fullMatch}
        </span>
      );

      lastIndex = index + fullMatch.length;
    }

    // Add any remaining text
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts;
  };

  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        p: ({ node, ...props }) => <p className="mb-4" {...props} />,
        h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mb-2" {...props} />,
        h2: ({ node, ...props }) => <h2 className="text-xl font-bold mb-2" {...props} />,
        ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4" {...props} />,
        ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4" {...props} />,
        li: ({ node, ...props }) => <li className="mb-1" {...props} />,
        code: ({ node, inline, ...props }) => 
          inline ? (
            <code className="bg-gray-100 rounded px-1" {...props} />
          ) : (
            <code className="block bg-gray-100 p-2 rounded mb-4" {...props} />
          ),
        // Add custom rendering for text nodes
        text: ({ children }) => <>{renderContent(children as string)}</>,
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default FormattedText;
