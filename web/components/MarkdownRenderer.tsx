'use client';

import ReactMarkdown from 'react-markdown';
import { useState, useEffect } from 'react';

const colors = ['#E536AB', '#39FF14']; // pink (accent) and green (neon) only

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
