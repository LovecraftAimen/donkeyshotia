import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Bot, User, Globe } from 'lucide-react';
import { ChatMessage, ChatRole } from '../types';

interface ChatBubbleProps {
  message: ChatMessage;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.role === ChatRole.USER;

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center"><Bot size={20} /></div>}
      <div className={`max-w-xl rounded-xl px-4 py-3 ${isUser ? 'bg-blue-600' : 'bg-gray-700'}`}>
        <div className="prose prose-invert prose-sm max-w-none text-white prose-p:my-4">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
            </ReactMarkdown>
        </div>
        {message.sources && message.sources.length > 0 && (
            <div className="mt-3 border-t border-gray-600 pt-2">
                <h4 className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1">
                    <Globe size={14} /> Fontes da Web:
                </h4>
                <ul className="space-y-1">
                    {message.sources.map((source, index) => (
                        <li key={index}>
                            <a 
                                href={source.web.uri} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs text-blue-400 hover:underline truncate block"
                            >
                                {index + 1}. {source.web.title}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        )}
      </div>
      {isUser && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center"><User size={20} /></div>}
    </div>
  );
};