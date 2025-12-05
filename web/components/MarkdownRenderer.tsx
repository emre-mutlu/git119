'use client';

import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
  hideHr?: boolean;
}

export default function MarkdownRenderer({ content, hideHr = false }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      components={hideHr ? {
        hr: () => null,
      } : undefined}
    >
      {content}
    </ReactMarkdown>
  );
}
