'use client';

import ReactMarkdown from 'react-markdown';
import { useState, useEffect } from 'react';

const colors = ['#5C03BC', '#E536AB', '#39FF14']; // primary, accent, neon

function ColorfulHr() {
  const [color, setColor] = useState(colors[0]);
  
  useEffect(() => {
    // Truly random color on client side
    setColor(colors[Math.floor(Math.random() * colors.length)]);
  }, []);

  return (
    <hr 
      className="my-8 border-0 h-[2px] rounded-full" 
      style={{ 
        backgroundColor: color,
        boxShadow: `0 0 8px ${color}40, 0 0 16px ${color}20`
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
