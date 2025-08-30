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
      content: 'Olá! Eu sou o **ChatBW**, seu assistente interno da empresa. Estou aqui para ajudar a equipe de suporte Nível 1 a encontrar rapidamente e seguir procedimentos documentados.\n\n**Posso ajudá-lo com:**\n• Etapas de solução de problemas e runbooks\n• Procedimentos operacionais e processos\n• Políticas e diretrizes da empresa\n• Documentação técnica passo a passo\n\nApenas me faça qualquer pergunta "como fazer" sobre nossos processos internos, e eu pesquisarei nossa base de conhecimento para fornecer os procedimentos exatos que você precisa.',
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
        content: `Com base na sua consulta sobre "${inputValue}", aqui está o procedimento relevante:\n\n## **Processo Passo a Passo**\n\n1. **Verificação Inicial**\n   - Verificar status do sistema no painel de monitoramento\n   - Verificar permissões e níveis de acesso do usuário\n   - \`Entrar no painel administrativo > Gerenciamento de Usuários\`\n\n2. **Etapas de Diagnóstico**\n   - Executar o script de diagnóstico padrão: \`./scripts/diagnose.sh\`\n   - Revisar logs de erro em \`/var/log/application/\`\n   - Documentar descobertas no sistema de tickets\n\n3. **Protocolo de Resolução**\n   - Aplicar a correção apropriada baseada no tipo de erro\n   - Testar a solução no ambiente de teste\n   - Atualizar documentação se novos passos foram necessários\n\n**⚠️ Importante:** Sempre siga a matriz de escalação se o problema persistir após a solução inicial de problemas.`,
        isUser: false,
        timestamp: new Date(),
        sources: [
          {
            title: "Guia de Solução de Problemas Suporte Nível 1",
            path: "/docs/support/level1-troubleshooting.md",
            excerpt: "Etapas de verificação inicial para problemas de acesso do usuário e diagnósticos do sistema..."
          },
          {
            title: "Manual de Procedimentos de Escalação",
            path: "/docs/processes/escalation-matrix.md",
            excerpt: "Quando escalar tickets e como documentar adequadamente as descobertas..."
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
            placeholder="Pergunte-me sobre procedimentos, solução de problemas ou processos da empresa..."
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