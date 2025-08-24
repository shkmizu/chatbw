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
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: 'Hello! I\'m your **Procedures Assistant**. I can help you with:\n\n• Process documentation\n• Step-by-step guides\n• Troubleshooting procedures\n• Best practices\n\nHow can I assist you today?',
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

    // Simulate bot response
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: `I understand you need help with: "${inputValue}"\n\nLet me provide you with a detailed procedure:\n\n1. **Initial Assessment**\n   - Review the current situation\n   - Identify key requirements\n\n2. **Planning Phase**\n   - Define clear objectives\n   - Set realistic timelines\n\n3. **Implementation**\n   - Follow best practices\n   - Monitor progress regularly\n\nWould you like me to elaborate on any of these steps?`,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
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
          <h1 className="text-lg font-semibold text-foreground">Procedures Assistant</h1>
          <p className="text-sm text-muted-foreground">AI-powered process guidance</p>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto chat-scroll p-4 space-y-4">
        {messages.map(message => (
          <Message key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-card chat-input-shadow">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
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