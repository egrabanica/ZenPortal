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
  AlignRight,
  Type,
  Heading1,
  Heading2
} from 'lucide-react';

export interface RichEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
}

const RichEditor = React.forwardRef<HTMLDivElement, RichEditorProps>(
  ({ className, value = '', onChange, placeholder, label, ...props }, ref) => {
    const editorRef = React.useRef<HTMLDivElement>(null);

    // Initialize editor content
    React.useEffect(() => {
      if (editorRef.current && value !== editorRef.current.innerHTML) {
        editorRef.current.innerHTML = value;
      }
    }, [value]);

    // Handle content changes
    const handleContentChange = () => {
      if (editorRef.current && onChange) {
        onChange(editorRef.current.innerHTML);
      }
    };

    // Toolbar button handler using execCommand for actual formatting
    const handleFormat = (format: string) => {
      if (!editorRef.current) return;
      
      editorRef.current.focus();
      
      switch (format) {
        case 'bold':
          document.execCommand('bold', false, undefined);
          break;
        case 'italic':
          document.execCommand('italic', false, undefined);
          break;
        case 'underline':
          document.execCommand('underline', false, undefined);
          break;
        case 'h1':
          document.execCommand('formatBlock', false, 'h1');
          break;
        case 'h2':
          document.execCommand('formatBlock', false, 'h2');
          break;
        case 'h3':
          document.execCommand('formatBlock', false, 'h3');
          break;
        case 'ul':
          document.execCommand('insertUnorderedList', false, undefined);
          break;
        case 'ol':
          document.execCommand('insertOrderedList', false, undefined);
          break;
        case 'link':
          const url = prompt('Enter link URL:', 'https://');
          if (url && url !== 'https://') {
            document.execCommand('createLink', false, url);
          }
          break;
        case 'image':
          const imageUrl = prompt('Enter image URL:', 'https://');
          if (imageUrl && imageUrl !== 'https://') {
            document.execCommand('insertImage', false, imageUrl);
          }
          break;
        case 'blockquote':
          document.execCommand('formatBlock', false, 'blockquote');
          break;
        case 'code':
          document.execCommand('formatBlock', false, 'pre');
          break;
        case 'alignLeft':
          document.execCommand('justifyLeft', false, undefined);
          break;
        case 'alignCenter':
          document.execCommand('justifyCenter', false, undefined);
          break;
        case 'alignRight':
          document.execCommand('justifyRight', false, undefined);
          break;
        default:
          break;
      }
      
      handleContentChange();
    };

    return (
      <div className={cn('space-y-2', className)} ref={ref} {...props}>
        {label && <label className="text-sm font-medium">{label}</label>}
        <div className="border rounded-md">
          <div className="flex items-center p-2 border-b flex-wrap gap-1">
            <Button variant="ghost" size="icon" onClick={() => handleFormat('h1')} title="Heading 1">H1</Button>
            <Button variant="ghost" size="icon" onClick={() => handleFormat('h2')} title="Heading 2">H2</Button>
            <Button variant="ghost" size="icon" onClick={() => handleFormat('h3')} title="Heading 3">H3</Button>
            <div className="w-px h-6 bg-gray-300 mx-1" />
            <Button variant="ghost" size="icon" onClick={() => handleFormat('bold')} title="Bold"><Bold size={16} /></Button>
            <Button variant="ghost" size="icon" onClick={() => handleFormat('italic')} title="Italic"><Italic size={16} /></Button>
            <Button variant="ghost" size="icon" onClick={() => handleFormat('underline')} title="Underline"><Underline size={16} /></Button>
            <div className="w-px h-6 bg-gray-300 mx-1" />
            <Button variant="ghost" size="icon" onClick={() => handleFormat('alignLeft')} title="Align Left"><AlignLeft size={16} /></Button>
            <Button variant="ghost" size="icon" onClick={() => handleFormat('alignCenter')} title="Align Center"><AlignCenter size={16} /></Button>
            <Button variant="ghost" size="icon" onClick={() => handleFormat('alignRight')} title="Align Right"><AlignRight size={16} /></Button>
            <div className="w-px h-6 bg-gray-300 mx-1" />
            <Button variant="ghost" size="icon" onClick={() => handleFormat('ul')} title="Unordered List"><List size={16} /></Button>
            <Button variant="ghost" size="icon" onClick={() => handleFormat('ol')} title="Ordered List"><ListOrdered size={16} /></Button>
            <div className="w-px h-6 bg-gray-300 mx-1" />
            <Button variant="ghost" size="icon" onClick={() => handleFormat('link')} title="Link"><Link size={16} /></Button>
            <Button variant="ghost" size="icon" onClick={() => handleFormat('image')} title="Image"><Image size={16} /></Button>
            <Button variant="ghost" size="icon" onClick={() => handleFormat('blockquote')} title="Blockquote"><Quote size={16} /></Button>
            <Button variant="ghost" size="icon" onClick={() => handleFormat('code')} title="Code Block"><Code size={16} /></Button>
          </div>
          <div
            ref={editorRef}
            contentEditable
            onInput={handleContentChange}
            onBlur={handleContentChange}
            className="w-full p-3 min-h-[250px] bg-background rounded-b-md focus:outline-none resize-y prose prose-sm max-w-none"
            style={{ minHeight: '250px' }}
            data-placeholder={placeholder}
            suppressContentEditableWarning={true}
          />
        </div>
      </div>
    );
  }
);

RichEditor.displayName = "RichEditor";

export default RichEditor;
