import { forwardRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChatMessage } from './ChatInterface';
import { cn } from '@/lib/utils';
import { FileText } from 'lucide-react';

interface MessageProps {
  message: ChatMessage;
  className?: string;
}

export const Message = forwardRef<HTMLDivElement, MessageProps>(
  ({ message, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex w-full message-enter',
          message.isUser ? 'justify-end' : 'justify-start',
          className
        )}
      >
        <div
          className={cn(
            'max-w-[80%] md:max-w-[70%] lg:max-w-[60%] rounded-2xl px-4 py-3 text-sm',
            message.isUser
              ? 'chat-user-message ml-auto'
              : 'chat-bot-message mr-auto'
          )}
        >
          {message.isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                  li: ({ children }) => <li className="text-sm">{children}</li>,
                  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                  code: ({ children }) => (
                    <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">
                      {children}
                    </code>
                  ),
                  pre: ({ children }) => (
                    <pre className="bg-muted p-3 rounded-lg overflow-x-auto my-2">
                      {children}
                    </pre>
                  ),
                  h1: ({ children }) => <h1 className="text-lg font-semibold mb-2">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-base font-semibold mb-2">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-sm font-semibold mb-1">{children}</h3>,
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
          
          {/* Source References - only for bot messages */}
          {!message.isUser && message.sources && message.sources.length > 0 && (
            <div className="mt-3 pt-3 border-t border-muted/30">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Source References
                </span>
              </div>
              <div className="space-y-2">
                {message.sources.map((source, index) => (
                  <div
                    key={index}
                    className="bg-muted/30 rounded-lg p-3 border border-muted/50"
                  >
                    <div className="font-medium text-xs text-foreground/90 mb-1">
                      {source.title}
                    </div>
                    <div className="text-xs text-muted-foreground font-mono mb-1">
                      {source.path}
                    </div>
                    <div className="text-xs text-muted-foreground/80">
                      {source.excerpt}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex justify-end mt-1">
            <span className={cn(
              "text-xs opacity-70",
              message.isUser ? "text-primary-foreground" : "text-muted-foreground"
            )}>
              {message.timestamp.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>
        </div>
      </div>
    );
  }
);

Message.displayName = 'Message';