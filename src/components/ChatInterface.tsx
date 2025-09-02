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
      content: 'Olá! Digite qualquer mensagem e ela será enviada para o webhook configurado.',
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

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue;
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content: userMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');

    try {
      // Send directly to webhook
      const webhookUrl = 'http://localhost:5678/webhook-test/b6115aca-da93-45e1-9ed8-277a09c92a97';
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const responseText = await response.text();
      
      // Create bot response with exact webhook response
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: responseText || 'Webhook não retornou resposta',
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Webhook error:', error);
      
      // Show specific error message
      const errorResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: 'Webhook not reachable or returned invalid JSON',
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorResponse]);
    }
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
          <p className="text-sm text-muted-foreground">Assistente Interno da Empresa</p>
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
            placeholder="Digite sua mensagem..."
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