'use client';

import * as React from 'react';
import { Button } from './button';
import { cn } from '@/lib/utils';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Link, 
  Image,
  Quote,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react';

export interface RichEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
}

const RichEditor = React.forwardRef<HTMLDivElement, RichEditorProps>(
  ({ className, value, onChange, placeholder, label, ...props }, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    // Toolbar button handler
    const handleFormat = (format: string) => {
      if (!textareaRef.current) return;

      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const selectedText = value?.substring(start, end) || '';
      
      let formattedText = selectedText;
      switch (format) {
        case 'bold':
          formattedText = `**${selectedText}**`;
          break;
        case 'italic':
          formattedText = `*${selectedText}*`;
          break;
        case 'underline':
          // Markdown doesn't have a standard underline syntax, but we can use HTML
          formattedText = `<u>${selectedText}</u>`;
          break;
        case 'h1':
          formattedText = `# ${selectedText}`;
          break;
        case 'h2':
          formattedText = `## ${selectedText}`;
          break;
        case 'h3':
          formattedText = `### ${selectedText}`;
          break;
        case 'ul':
          formattedText = selectedText.split('\n').map(line => `- ${line}`).join('\n');
          break;
        case 'ol':
          formattedText = selectedText.split('\n').map((line, i) => `${i + 1}. ${line}`).join('\n');
          break;
        case 'link':
          const url = prompt('Enter link URL:', 'https://');
          if (url) {
            formattedText = `[${selectedText}](${url})`;
          }
          break;
        case 'image':
            const imageUrl = prompt('Enter image URL:', 'https://');
            if (imageUrl) {
              formattedText = `![${selectedText}](${imageUrl})`;
            }
            break;
        case 'blockquote':
            formattedText = selectedText.split('\n').map(line => `> ${line}`).join('\n');
            break;
        case 'code':
            formattedText = `\`\`\`\n${selectedText}\n\`\`\``;
            break;
        default:
          break;
      }

      const newValue = 
        (value?.substring(0, start) || '') + 
        formattedText + 
        (value?.substring(end) || '');
      
      onChange?.(newValue);

      // Re-focus and set cursor position
      setTimeout(() => {
        textareaRef.current?.focus();
        textareaRef.current?.setSelectionRange(start + formattedText.length, start + formattedText.length);
      }, 0);
    };

    return (
      <div className={cn('space-y-2', className)} ref={ref} {...props}>
        {label && <label className="text-sm font-medium">{label}</label>}
        <div className="border rounded-md">
          <div className="flex items-center p-2 border-b flex-wrap">
            <Button variant="ghost" size="icon" onClick={() => handleFormat('h1')} title="Heading 1">H1</Button>
            <Button variant="ghost" size="icon" onClick={() => handleFormat('h2')} title="Heading 2">H2</Button>
            <Button variant="ghost" size="icon" onClick={() => handleFormat('h3')} title="Heading 3">H3</Button>
            <Button variant="ghost" size="icon" onClick={() => handleFormat('bold')} title="Bold"><Bold size={16} /></Button>
            <Button variant="ghost" size="icon" onClick={() => handleFormat('italic')} title="Italic"><Italic size={16} /></Button>
            <Button variant="ghost" size="icon" onClick={() => handleFormat('underline')} title="Underline"><Underline size={16} /></Button>
            <Button variant="ghost" size="icon" onClick={() => handleFormat('ul')} title="Unordered List"><List size={16} /></Button>
            <Button variant="ghost" size="icon" onClick={() => handleFormat('ol')} title="Ordered List"><ListOrdered size={16} /></Button>
            <Button variant="ghost" size="icon" onClick={() => handleFormat('link')} title="Link"><Link size={16} /></Button>
            <Button variant="ghost" size="icon" onClick={() => handleFormat('image')} title="Image"><Image size={16} /></Button>
            <Button variant="ghost" size="icon" onClick={() => handleFormat('blockquote')} title="Blockquote"><Quote size={16} /></Button>
            <Button variant="ghost" size="icon" onClick={() => handleFormat('code')} title="Code Block"><Code size={16} /></Button>
          </div>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            className="w-full p-3 min-h-[250px] bg-background rounded-b-md focus:outline-none resize-y"
          />
        </div>
      </div>
    );
  }
);

RichEditor.displayName = "RichEditor";

export default RichEditor;
