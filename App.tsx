import React, { useState } from 'react';
import { ChatWindow } from './components/ChatWindow';
import { ChatMode } from './types';
import { Bot } from 'lucide-react';

const App: React.FC = () => {
  const [chatMode, setChatMode] = useState<ChatMode>(ChatMode.STANDARD);

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-2 sm:p-4 font-sans">
      <div className="w-full max-w-3xl h-[95vh] flex flex-col bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
        <header className="flex items-center p-4 border-b border-gray-700 bg-gray-900/50">
          <Bot className="w-8 h-8 text-purple-400 mr-4" />
          <div>
            <h1 className="text-xl font-bold text-white">DonkeyShot AI</h1>
            <p className="text-xs text-gray-400">Seu assistente especialista em coquetelaria.</p>
          </div>
        </header>
        <ChatWindow chatMode={chatMode} setChatMode={setChatMode} />
      </div>
    </div>
  );
};

export default App;
