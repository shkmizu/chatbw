import { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Message } from './Message';

export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  sources?: Array<{
    title: string;
    path: string;
    excerpt: string;
  }>;
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: 'Hello! I\'m **ChatBW**, your internal company assistant. I\'m here to help Level 1 support staff quickly find and follow documented procedures.\n\n**I can help you with:**\n• Troubleshooting steps and runbooks\n• Operational procedures and processes\n• Company policies and guidelines\n• Step-by-step technical documentation\n\nJust ask me any "how-to" question about our internal processes, and I\'ll search our knowledge base to provide you with the exact procedures you need.',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');

    // Simulate bot response with source references
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: `Based on your query about "${inputValue}", here's the relevant procedure:\n\n## **Step-by-Step Process**\n\n1. **Initial Verification**\n   - Check system status in the monitoring dashboard\n   - Verify user permissions and access levels\n   - \`Log into admin panel > User Management\`\n\n2. **Diagnostic Steps**\n   - Run the standard diagnostic script: \`./scripts/diagnose.sh\`\n   - Review error logs in \`/var/log/application/\`\n   - Document findings in the ticket system\n\n3. **Resolution Protocol**\n   - Apply the appropriate fix based on error type\n   - Test the solution in staging environment\n   - Update documentation if new steps were required\n\n**⚠️ Important:** Always follow the escalation matrix if the issue persists after initial troubleshooting.`,
        isUser: false,
        timestamp: new Date(),
        sources: [
          {
            title: "Level 1 Support Troubleshooting Guide",
            path: "/docs/support/level1-troubleshooting.md",
            excerpt: "Initial verification steps for user access issues and system diagnostics..."
          },
          {
            title: "Escalation Procedures Manual",
            path: "/docs/processes/escalation-matrix.md",
            excerpt: "When to escalate tickets and how to properly document findings..."
          }
        ]
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="flex items-center gap-3 p-4 border-b bg-card shadow-sm">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
          <MessageCircle className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-foreground">ChatBW</h1>
          <p className="text-sm text-muted-foreground">Internal Company Assistant</p>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto chat-scroll p-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map(message => (
            <Message key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-card chat-input-shadow">
        <div className="flex gap-2 max-w-3xl mx-auto">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about procedures, troubleshooting, or company processes..."
            className="flex-1 rounded-full bg-muted/50 border-muted focus:bg-background transition-colors"
          />
          <Button
            onClick={handleSendMessage}
            size="icon"
            className="rounded-full chat-user-message hover:opacity-90 transition-opacity"
            disabled={!inputValue.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};