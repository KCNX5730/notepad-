import React from 'react';
import { Play, Eye, Code, Maximize2, Minimize2, Sparkles } from 'lucide-react';

interface MobileQuickBarProps {
  onInsertChar: (char: string) => void;
  onExpandEmmet: () => void;
  onRunPreview: () => void;
  activeView: 'editor' | 'preview';
  onToggleView: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const MobileQuickBar: React.FC<MobileQuickBarProps> = ({
  onInsertChar,
  onExpandEmmet,
  onRunPreview,
  activeView,
  onToggleView,
  isFullscreen,
  onToggleFullscreen,
}) => {
  const symbols = ['<', '>', '/', '=', '"', "'", '{', '}', '(', ')', '[', ']', ';', ':', 'Tab'];

  return (
    <div className="bg-[#e4e4e4] border-t border-[#c4c4c4] px-1 py-1 flex items-center justify-between text-xs select-none shadow-md shrink-0 z-40 sm:hidden">
      {/* Quick symbols carousel */}
      <div className="flex items-center gap-1 overflow-x-auto py-0.5 px-1 flex-1 scrollbar-none">
        {symbols.map(s => (
          <button
            key={s}
            onClick={() => onInsertChar(s === 'Tab' ? '  ' : s)}
            className="px-2 py-1 bg-white active:bg-gray-200 border border-gray-300 rounded font-mono text-xs font-semibold text-gray-800 shadow-2xs shrink-0"
          >
            {s}
          </button>
        ))}

        <button
          onClick={onExpandEmmet}
          title="Expand Emmet"
          className="px-2 py-1 bg-sky-600 active:bg-sky-700 text-white rounded font-medium text-xs flex items-center gap-1 shrink-0 shadow-2xs"
        >
          <Sparkles size={11} />
          <span>Emmet</span>
        </button>
      </div>

      {/* Floating Toggle View / Run Switcher */}
      <div className="flex items-center gap-1 pl-1 border-l border-gray-300 shrink-0">
        <button
          onClick={onToggleView}
          className="px-2.5 py-1 bg-blue-600 active:bg-blue-700 text-white rounded font-bold text-xs flex items-center gap-1 shadow-xs"
        >
          {activeView === 'editor' ? (
            <>
              <Eye size={12} />
              <span>Web</span>
            </>
          ) : (
            <>
              <Code size={12} />
              <span>Code</span>
            </>
          )}
        </button>

        <button
          onClick={onRunPreview}
          title="Run Web Preview"
          className="p-1 bg-emerald-600 active:bg-emerald-700 text-white rounded shadow-xs"
        >
          <Play size={14} className="fill-white" />
        </button>

        <button
          onClick={onToggleFullscreen}
          title="Full Screen Mode"
          className="p-1 bg-gray-200 active:bg-gray-300 text-gray-700 rounded border border-gray-300"
        >
          {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
        </button>
      </div>
    </div>
  );
};
