import React, { useState, useCallback } from 'react';
import { Check, Copy } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
}

interface CodeBlockProps {
  language: string;
  code: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, code }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [code]);

  return (
    <div className="relative group my-3 rounded-lg overflow-hidden border border-border bg-background">
      <div className="flex items-center justify-between px-4 py-2 bg-muted border-b border-border">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {language || 'code'}
        </span>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-primary" />
              <span className="text-primary">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto scrollbar-thin">
        <code className="text-sm font-mono text-foreground">{code}</code>
      </pre>
    </div>
  );
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const renderContent = (text: string) => {
    const parts: React.ReactNode[] = [];
    let currentIndex = 0;
    let keyIndex = 0;

    // Match code blocks
    const codeBlockRegex = /```(\w*)\n?([\s\S]*?)```/g;
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      // Add text before code block
      if (match.index > currentIndex) {
        const textBefore = text.slice(currentIndex, match.index);
        parts.push(
          <span key={`text-${keyIndex++}`}>
            {renderInlineElements(textBefore)}
          </span>
        );
      }

      // Add code block
      parts.push(
        <CodeBlock
          key={`code-${keyIndex++}`}
          language={match[1]}
          code={match[2].trim()}
        />
      );

      currentIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (currentIndex < text.length) {
      parts.push(
        <span key={`text-${keyIndex++}`}>
          {renderInlineElements(text.slice(currentIndex))}
        </span>
      );
    }

    return parts.length > 0 ? parts : renderInlineElements(text);
  };

  const renderInlineElements = (text: string) => {
    const lines = text.split('\n');
    
    return lines.map((line, lineIndex) => {
      let processedLine: React.ReactNode = line;

      // Headers
      if (line.startsWith('### ')) {
        return (
          <h3 key={lineIndex} className="text-lg font-semibold mt-4 mb-2 text-foreground">
            {line.slice(4)}
          </h3>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h2 key={lineIndex} className="text-xl font-semibold mt-5 mb-2 text-foreground">
            {line.slice(3)}
          </h2>
        );
      }
      if (line.startsWith('# ')) {
        return (
          <h1 key={lineIndex} className="text-2xl font-bold mt-6 mb-3 text-foreground">
            {line.slice(2)}
          </h1>
        );
      }

      // Lists
      if (line.match(/^[-*]\s/)) {
        return (
          <li key={lineIndex} className="ml-4 my-1 list-disc list-inside text-foreground/90">
            {processInlineFormatting(line.slice(2))}
          </li>
        );
      }
      if (line.match(/^\d+\.\s/)) {
        const numberMatch = line.match(/^(\d+)\.\s(.*)$/);
        if (numberMatch) {
          return (
            <li key={lineIndex} className="ml-4 my-1 list-decimal list-inside text-foreground/90">
              {processInlineFormatting(numberMatch[2])}
            </li>
          );
        }
      }

      // Empty lines
      if (line.trim() === '') {
        return <br key={lineIndex} />;
      }

      // Regular paragraph
      return (
        <p key={lineIndex} className="my-1 text-foreground/90 leading-relaxed">
          {processInlineFormatting(line)}
        </p>
      );
    });
  };

  const processInlineFormatting = (text: string): React.ReactNode => {
    // Process inline code, bold, italic, and links
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let keyIndex = 0;

    // Inline code
    const inlineCodeRegex = /`([^`]+)`/g;
    let lastIndex = 0;
    let match;

    while ((match = inlineCodeRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(processBoldItalic(text.slice(lastIndex, match.index), keyIndex++));
      }
      parts.push(
        <code
          key={`inline-code-${keyIndex++}`}
          className="px-1.5 py-0.5 rounded bg-muted text-primary font-mono text-sm"
        >
          {match[1]}
        </code>
      );
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(processBoldItalic(text.slice(lastIndex), keyIndex++));
    }

    return parts.length > 0 ? parts : processBoldItalic(text, 0);
  };

  const processBoldItalic = (text: string, key: number): React.ReactNode => {
    // Bold
    let processed: React.ReactNode = text;
    
    const boldParts = text.split(/\*\*([^*]+)\*\*/g);
    if (boldParts.length > 1) {
      processed = boldParts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={`bold-${key}-${i}`} className="font-semibold text-foreground">
            {part}
          </strong>
        ) : (
          part
        )
      );
    }

    return <span key={`text-${key}`}>{processed}</span>;
  };

  return (
    <div className="prose prose-invert max-w-none text-sm md:text-base">
      {renderContent(content)}
    </div>
  );
};
