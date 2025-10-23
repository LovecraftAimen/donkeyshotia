
import React from 'react';
import { Bot, BrainCircuit, Search } from 'lucide-react';
import { ChatMode } from '../types';

interface ControlPanelProps {
  selectedMode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
}

const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

export const ControlPanel: React.FC<ControlPanelProps> = ({ selectedMode, onModeChange }) => {
  const modes = [
    { mode: ChatMode.STANDARD, icon: <Bot size={16} />, label: 'Padrão' },
    { mode: ChatMode.THINKING, icon: <BrainCircuit size={16} />, label: 'Complexo' },
    { mode: ChatMode.SEARCH, icon: <Search size={16} />, label: 'Web' },
  ];

  return (
    <div className="flex items-center justify-center space-x-2 bg-gray-900/50 p-1 rounded-lg mb-2">
      {modes.map(({ mode, icon, label }) => (
        <button
          key={mode}
          onClick={() => onModeChange(mode)}
          className={cn(
            'flex items-center space-x-2 px-3 py-1.5 text-xs rounded-md transition-colors duration-200 focus:outline-none',
            selectedMode === mode
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-gray-300 hover:bg-gray-700'
          )}
        >
          {icon}
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
};
