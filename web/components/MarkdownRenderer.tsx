'use client';

import ReactMarkdown from 'react-markdown';
import { useId } from 'react';

const colors = ['#5C03BC', '#E536AB', '#39FF14']; // primary, accent, neon

function ColorfulHr() {
  const id = useId();
  // Use a deterministic random based on the id to avoid hydration mismatch
  const colorIndex = Math.abs(id.charCodeAt(1) + id.charCodeAt(2)) % colors.length;
  const color = colors[colorIndex];

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
