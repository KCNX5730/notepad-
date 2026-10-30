import React, { useState, useEffect, useRef } from 'react';
import { ProjectFile } from '../types';
import { Search, FileCode, Play, Sparkles, Wand2, Columns, Settings, HelpCircle, Save } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  files: ProjectFile[];
  onSelectFile: (fileId: string) => void;
  onExecuteAction: (actionKey: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  files,
  onSelectFile,
  onExecuteAction,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  interface PaletteItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    fileId?: string;
  }

  const actions: PaletteItem[] = [
    { id: 'run', label: 'Run in Live Preview (F5)', icon: <Play size={14} className="text-emerald-600" /> },
    { id: 'save', label: 'Save File (Ctrl+S)', icon: <Save size={14} className="text-blue-600" /> },
    { id: 'format', label: 'Format Document (Alt+Shift+F)', icon: <Wand2 size={14} className="text-purple-600" /> },
    { id: 'emmet', label: 'Expand Emmet Abbreviation (Tab)', icon: <Sparkles size={14} className="text-sky-600" /> },
    { id: 'split', label: 'Toggle Live Preview Split', icon: <Columns size={14} className="text-indigo-600" /> },
    { id: 'settings', label: 'Open Preferences / Settings', icon: <Settings size={14} className="text-gray-600" /> },
    { id: 'help', label: 'Open Help & Shortcuts Guide', icon: <HelpCircle size={14} className="text-amber-600" /> },
  ];

  const fileItems: PaletteItem[] = files.map(f => ({
    id: `file:${f.id}`,
    label: `Open File: ${f.name}`,
    icon: <FileCode size={14} className="text-orange-500" />,
    fileId: f.id,
  }));

  const allItems: PaletteItem[] = [...actions, ...fileItems];
  const filtered = allItems.filter(item =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (filtered.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filtered.length) % (filtered.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const chosen = filtered[selectedIndex];
      if (chosen) {
        if ('fileId' in chosen && chosen.fileId) {
          onSelectFile(chosen.fileId);
        } else {
          onExecuteAction(chosen.id);
        }
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-start justify-center pt-20 z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-2xl border border-gray-300 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-100"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 px-3 py-2.5 border-b border-gray-200">
          <Search size={16} className="text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or file name..."
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="w-full text-sm outline-none bg-transparent placeholder-gray-400"
          />
        </div>

        <div className="max-h-72 overflow-y-auto py-1">
          {filtered.length === 0 ? (
            <div className="py-6 text-center text-xs text-gray-400">No matching commands found.</div>
          ) : (
            filtered.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => {
                  if ('fileId' in item && item.fileId) {
                    onSelectFile(item.fileId);
                  } else {
                    onExecuteAction(item.id);
                  }
                  onClose();
                }}
                className={`px-3 py-2 flex items-center justify-between text-xs cursor-pointer ${
                  idx === selectedIndex ? 'bg-blue-50 text-blue-900 font-medium' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
