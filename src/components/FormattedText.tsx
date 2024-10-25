"use client"

import React from 'react';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';

interface FormattedTextProps {
  content: string;
  onPageHighlight: (pageNumber: number) => void;
  highlightedPage: number | null;
}

const FormattedText: React.FC<FormattedTextProps> = ({ content, onPageHighlight, highlightedPage }) => {
  const pageRegex = /\(p\. (\d+)\)/g;
  
  return (
    <Latex>
      {content}
    </Latex>
  );
};

export default FormattedText;
