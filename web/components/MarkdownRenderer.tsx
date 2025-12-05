'use client';

import ReactMarkdown from 'react-markdown';
import { useState, useEffect } from 'react';

const colors = ['#f0b40f', '#3cc372', '#cb349e']; // tuscan sun, dark emerald, crimson violet

function ColorfulHr() {
  const [color, setColor] = useState(colors[0]);
  
  useEffect(() => {
    // Truly random color on client side
    setColor(colors[Math.floor(Math.random() * colors.length)]);
  }, []);

  return (
    <hr 
      className="my-8 border-0 h-[1px] rounded-full" 
      style={{ 
        backgroundColor: color
      }}
    />
  );
}

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      components={{
        hr: () => <ColorfulHr />,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
