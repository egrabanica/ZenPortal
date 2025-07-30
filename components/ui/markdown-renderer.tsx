'use client';

import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={cn('prose dark:prose-invert max-w-full', className)}>
      <ReactMarkdown
        components={{
          // Customize heading rendering
          h1: ({node, ...props}) => <h1 className="text-3xl font-bold my-4" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-2xl font-bold my-3" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-xl font-bold my-2" {...props} />,
          // Customize paragraph rendering
          p: ({node, ...props}) => <p className="my-4 leading-relaxed" {...props} />,
          // Customize link rendering
          a: ({node, ...props}) => <a className="text-primary hover:underline" {...props} />,
          // Customize list rendering
          ul: ({node, ...props}) => <ul className="list-disc pl-6 my-4" {...props} />,
          ol: ({node, ...props}) => <ol className="list-decimal pl-6 my-4" {...props} />,
          // Customize image rendering to be responsive
          img: ({node, ...props}) => <img className="max-w-full h-auto rounded-lg my-4" {...props} />,
          // Customize blockquote rendering
          blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-muted-foreground pl-4 italic my-4" {...props} />,
          // Customize code block rendering
          code: ({node, inline, className, children, ...props}) => {
            const match = /language-(\\w+)/.exec(className || '');
            return !inline && match ? (
              <div className="bg-muted p-4 rounded-md my-4 overflow-x-auto">
                <code className={className} {...props}>
                  {children}
                </code>
              </div>
            ) : (
              <code className="bg-muted px-1 rounded-sm" {...props}>
                {children}
              </code>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
