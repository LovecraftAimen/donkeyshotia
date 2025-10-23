import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Bot, Pause, Play } from 'lucide-react';
import { runQuery } from '../services/geminiService';
import { ChatMessage, ChatRole, ChatMode } from '../types';
import { ChatBubble } from './ChatBubble';
import { ControlPanel } from './ControlPanel';

interface ChatWindowProps {
    chatMode: ChatMode;
    setChatMode: React.Dispatch<React.SetStateAction<ChatMode>>;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ chatMode, setChatMode }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState<ChatMessage | null>(null);
  
  const [isPaused, setIsPaused] = useState(false);
  const isPausedRef = useRef(false);
  const intervalRef = useRef<number | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  const handlePauseResume = () => {
    isPausedRef.current = !isPausedRef.current;
    setIsPaused(isPausedRef.current);
  };

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;

    if (intervalRef.current) {
        clearInterval(intervalRef.current);
    }

    setIsLoading(true);
    const newUserMessage: ChatMessage = { id: Date.now().toString(), role: ChatRole.USER, content: message };
    setMessages(prev => [...prev, newUserMessage]);
    setInput('');
    setStreamingMessage(null);
    setIsPaused(false);
    isPausedRef.current = false;

    // FIX: Explicitly type `history` to avoid TypeScript widening `role` to a generic `string`.
    const history: { role: 'user' | 'model'; parts: { text: string }[] }[] = [...messages, newUserMessage].map(msg => ({
      role: msg.role === ChatRole.USER ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    try {
      const { text, sources } = await runQuery(message, [], chatMode);
      setIsLoading(false);

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: ChatRole.MODEL,
        content: '',
        sources
      };
      setStreamingMessage(botMessage);

      let index = 0;
      intervalRef.current = window.setInterval(() => {
        if (isPausedRef.current) return;
        
        setStreamingMessage(prev => {
            if (!prev) {
                if(intervalRef.current) clearInterval(intervalRef.current);
                return null;
            }
            
            const newContent = text.slice(0, index + 1);

            if (index >= text.length - 1) {
                if (intervalRef.current) clearInterval(intervalRef.current);
                setMessages(p => [...p, { ...prev, content: newContent }]);
                setIsPaused(false);
                isPausedRef.current = false;
                return null;
            }
            index++;
            return { ...prev, content: newContent };
        });
      }, 20); 

    } catch (error) {
        setIsLoading(false);
        const errorMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: ChatRole.MODEL,
            content: 'Ocorreu um erro ao buscar a resposta. Por favor, tente novamente.'
        };
        setMessages(prev => [...prev, errorMessage]);
    }
  }, [messages, chatMode]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };
  
  return (
    <div className="flex flex-col h-full bg-gray-800">
      <div className="flex-grow p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.length === 0 && !isLoading && !streamingMessage && (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
              <Bot size={48} className="mx-auto opacity-50" />
              <p className="mt-4">Olá! Eu sou o DonkeyShot. <br/> Pergunte-me algo sobre coquetéis, gestão de bar ou eventos.</p>
            </div>
          )}
          {messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} />
          ))}
          {streamingMessage && <ChatBubble message={streamingMessage} />}
          {isLoading && (
            <div className="flex items-start gap-3">
               <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                  <Bot size={20} className="animate-pulse" />
              </div>
              <div className="text-gray-400 bg-gray-700 px-4 py-3 rounded-xl">DonkeyShot está pensando...</div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="p-4 border-t border-gray-700 bg-gray-800">
         {streamingMessage && (
            <div className="flex justify-center mb-2">
                <button 
                    onClick={handlePauseResume} 
                    className="flex items-center gap-2 px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                    {isPaused ? <Play size={14} /> : <Pause size={14} />}
                    <span>{isPaused ? 'Continuar' : 'Pausar'}</span>
                </button>
            </div>
        )}
         <ControlPanel selectedMode={chatMode} onModeChange={setChatMode} />
        <form onSubmit={handleFormSubmit} className="flex items-center space-x-2 mt-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pergunte ao DonkeyShot..."
            className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
            disabled={isLoading || streamingMessage !== null}
          />
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg p-2 disabled:bg-gray-600 disabled:cursor-not-allowed flex-shrink-0"
            disabled={isLoading || streamingMessage !== null || !input.trim()}
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};