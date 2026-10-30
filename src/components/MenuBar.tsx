import React, { useState, useEffect, useRef } from 'react';
import { 
  FileCode, Play, Sparkles, Settings, HelpCircle, 
  Terminal, Search, GitBranch as GitIcon, Layout, Eye,
  Code, Save, FolderOpen, Undo2, Redo2, Scissors, Copy, Clipboard, Check
} from 'lucide-react';

interface MenuBarProps {
  onNewFile: () => void;
  onOpenFile: () => void;
  onSaveFile: () => void;
  onSaveAll: () => void;
  onExportZip: () => void;
  onImportFile: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onCut: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onSelectAll: () => void;
  onFormat: () => void;
  onExpandEmmet: () => void;
  onToggleComment: () => void;
  onRenamePairedTag: () => void;
  onFind: () => void;
  onReplace: () => void;
  onFindInFiles: () => void;
  onToggleSplit: () => void;
  onToggleWordWrap: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onToggleFullscreen: () => void;
  onOpenConsole: () => void;
  onOpenProblems: () => void;
  onOpenOutline: () => void;
  onCloseActiveTab: () => void;
  onCloseAllTabs: () => void;
  onRunPreview: () => void;
  onRunExternal: () => void;
  onOpenSettings: () => void;
  onOpenHelp: () => void;
  onOpenCommandPalette: () => void;
  onSelectSample: (id: string) => void;
  wordWrap: boolean;
  isFullscreen: boolean;
}

export const MenuBar: React.FC<MenuBarProps> = ({
  onNewFile,
  onOpenFile,
  onSaveFile,
  onSaveAll,
  onExportZip,
  onImportFile,
  onUndo,
  onRedo,
  onCut,
  onCopy,
  onPaste,
  onSelectAll,
  onFormat,
  onExpandEmmet,
  onToggleComment,
  onRenamePairedTag,
  onFind,
  onReplace,
  onFindInFiles,
  onToggleSplit,
  onToggleWordWrap,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onToggleFullscreen,
  onOpenConsole,
  onOpenProblems,
  onOpenOutline,
  onCloseActiveTab,
  onCloseAllTabs,
  onRunPreview,
  onRunExternal,
  onOpenSettings,
  onOpenHelp,
  onOpenCommandPalette,
  onSelectSample,
  wordWrap,
  isFullscreen,
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [encoding, setEncoding] = useState('UTF-8');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuClick = (menu: string) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  const handleMenuHover = (menu: string) => {
    if (activeMenu !== null) {
      setActiveMenu(menu);
    }
  };

  const executeAction = (action: () => void) => {
    setActiveMenu(null);
    action();
  };

  return (
    <div 
      ref={menuRef} 
      className="bg-[#f0f0f0] border-b border-[#d4d4d4] text-[13px] text-gray-800 select-none flex items-center px-1 relative z-50 font-sans shadow-xs"
    >
      {/* Brand Icon Notepad++ style */}
      <div className="flex items-center gap-1.5 px-2 py-1 text-emerald-800 font-bold text-xs tracking-tight mr-1 border-r border-[#d4d4d4]/60">
        <span className="w-4 h-4 rounded bg-emerald-600 text-white flex items-center justify-center text-[10px] shadow-xs">N</span>
        <span className="hidden sm:inline">Notepad++ HTML Studio</span>
      </div>

      {/* FILE MENU */}
      <div className="relative">
        <button
          className={`px-2.5 py-1 rounded-xs hover:bg-[#e0e0e0] cursor-default transition-colors ${
            activeMenu === 'file' ? 'bg-[#cce8ff] text-blue-900 ring-1 ring-blue-300' : ''
          }`}
          onClick={() => handleMenuClick('file')}
          onMouseEnter={() => handleMenuHover('file')}
        >
          File
        </button>
        {activeMenu === 'file' && (
          <div className="absolute top-full left-0 mt-0.5 bg-white border border-[#b4b4b4] shadow-lg rounded-xs py-1 min-w-[220px] text-gray-800 text-xs z-50 animate-in fade-in-50 duration-75">
            <button onClick={() => executeAction(onNewFile)} className="w-full px-3 py-1.5 hover:bg-[#91c9f7]/40 flex justify-between items-center text-left">
              <span>New File</span>
              <span className="text-gray-400 text-[11px]">Ctrl+N</span>
            </button>
            <button onClick={() => executeAction(onOpenFile)} className="w-full px-3 py-1.5 hover:bg-[#91c9f7]/40 flex justify-between items-center text-left">
              <span>Open File...</span>
              <span className="text-gray-400 text-[11px]">Ctrl+O</span>
            </button>
            <div className="my-1 border-t border-gray-200" />
            <button onClick={() => executeAction(onSaveFile)} className="w-full px-3 py-1.5 hover:bg-[#91c9f7]/40 flex justify-between items-center text-left font-medium">
              <span>Save</span>
              <span className="text-gray-400 text-[11px]">Ctrl+S</span>
            </button>
            <button onClick={() => executeAction(onSaveAll)} className="w-full px-3 py-1.5 hover:bg-[#91c9f7]/40 flex justify-between items-center text-left">
              <span>Save All</span>
              <span className="text-gray-400 text-[11px]">Ctrl+Shift+S</span>
            </button>
            <div className="my-1 border-t border-gray-200" />
            <button onClick={() => executeAction(onExportZip)} className="w-full px-3 py-1.5 hover:bg-[#91c9f7]/40 flex justify-between items-center text-left">
              <span>Export Project as ZIP...</span>
              <span className="text-emerald-600 text-[11px]">📦 Zip</span>
            </button>
            <button onClick={() => executeAction(onImportFile)} className="w-full px-3 py-1.5 hover:bg-[#91c9f7]/40 flex justify-between items-center text-left">
              <span>Import HTML / ZIP file...</span>
            </button>
            <div className="my-1 border-t border-gray-200" />
            <div className="px-3 py-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Sample Projects</div>
            <button onClick={() => executeAction(() => onSelectSample('starter-showcase'))} className="w-full px-3 py-1.5 hover:bg-[#91c9f7]/40 text-left">
              Load: Modern Web Showcase
            </button>
            <button onClick={() => executeAction(() => onSelectSample('retro-game'))} className="w-full px-3 py-1.5 hover:bg-[#91c9f7]/40 text-left">
              Load: Retro Brick Breaker Game
            </button>
            <button onClick={() => executeAction(() => onSelectSample('blank-canvas'))} className="w-full px-3 py-1.5 hover:bg-[#91c9f7]/40 text-left">
              Load: Blank HTML5 Boilerplate
            </button>
            <div className="my-1 border-t border-gray-200" />
            <button onClick={() => executeAction(onCloseActiveTab)} className="w-full px-3 py-1.5 hover:bg-[#91c9f7]/40 flex justify-between items-center text-left text-red-600">
              <span>Close Tab</span>
              <span className="text-gray-400 text-[11px]">Ctrl+W</span>
            </button>
          </div>
        )}
      </div>

      {/* EDIT MENU */}
      <div className="relative">
        <button
          className={`px-2.5 py-1 rounded-xs hover:bg-[#e0e0e0] cursor-default transition-colors ${
            activeMenu === 'edit' ? 'bg-[#cce8ff] text-blue-900 ring-1 ring-blue-300' : ''
          }`}
          onClick={() => handleMenuClick('edit')}
          onMouseEnter={() => handleMenuHover('edit')}
        >
          Edit
        </button>
        {activeMenu === 'edit' && (
          <div className="absolute top-full left-0 mt-0.5 bg-white border border-[#b4b4b4] shadow-lg rounded-xs py-1 min-w-[230px] text-gray-800 text-xs z-50">
            <button onClick={() => executeAction(onUndo)} className="w-full px-3 py-1.5 hover:bg-[#91c9f7]/40 flex justify-between items-center text-left">
              <span>Undo</span>
              <span className="text-gray-400 text-[11px]">Ctrl+Z</span>
            </button>
            <button onClick={() => executeAction(onRedo)} className="w-full px-3 py-1.5 hover:bg-[#91c9f7]/40 flex justify-between items-center text-left">
              <span>Redo</span>
              <span className="text-gray-400 text-[11px]">Ctrl+Y</span>
            </button>
            <div className="my-1 border-t border-gray-200" />
            <button onClick={() => executeAction(onCut)} className="w-full px-3 py-1.5 hover:bg-[#91c9f7]/40 flex justify-between items-center text-left">
              <span>Cut</span>
              <span className="text-gray-400 text-[11px]">Ctrl+X</span>
            </button>
            <button onClick={() => executeAction(onCopy)} className="w-full px-3 py-1.5 hover:bg-[#91c9f7]/40 flex justify-between items-center text-left">
              <span>Copy</span>
              <span className="text-gray-400 text-[11px]">Ctrl+C</span>
            </button>
            <button onClick={() => executeAction(onPaste)} className="w-full px-3 py-1.5 hover:bg-[#91c9f7]/40 flex justify-between items-center text-left">
              <span>Paste</span>
              <span className="text-gray-400 text-[11px]">Ctrl+V</span>
            </button>
            <button onClick={() => executeAction(onSelectAll)} className="w-full px-3 py-1.5 hover:bg-[#91c9f7]/40 flex justify-between items-center text-left">
              <span>Select All</span>
              <span className="text-gray-400 text-[11px]">Ctrl+A</span>
            </button>
            <div className="my-1 border-t border-gray-200" />
            <button onClick={() => executeAction(onFormat)} className="w-full px-3 py-1.5 hover:bg-[#91c9f7]/40 flex justify-between items-center text-left text-indigo-700 font-medium">
              <span>Format Document</span>
              <span className="text-gray-400 text-[11px]">Alt+Shift+F</span>
            </button>
            <button onClick={() => executeAction(onExpandEmmet)} className="w-full px-3 py-1.5 hover:bg-[#91c9f7]/40 flex justify-between items-center text-left text-blue-700 font-medium">
              <span>Expand Emmet Abbreviation</span>
              <span className="text-gray-400 text-[11px]">Tab / Ctrl+E</span>
            </button>
            <button onClick={() => executeAction(onRenamePairedTag)} className="w-full px-3 py-1.5 hover:bg-[#91c9f7]/40 flex justify-between items-center text-left">
              <span>Rename Matching Tag</span>
              <span className="text-gray-400 text-[11px]">F2</span>
            </button>
            <button onClick={() => executeAction(onToggleComment)} className="w-full px-3 py-1.5 hover:bg-[#91c9f7]/40 flex justify-between items-center text-left">
              <span>Toggle Comment</span>
              <span className="text-gray-400 text-[11px]">Ctrl+/</span>
            </button>
          </div>
        )}
      </div>

      {/* SEARCH MENU */}
      <div className="relative">
        <button
          className={`px-2.5 py-1 rounded-xs hover:bg-[#e0e0e0] cursor-default transition-colors ${
            activeMenu === 'search' ? 'bg-[#cce8ff] text-blue-900 ring-1 ring-blue-300' : ''
          }`}
          onClick={() => handleMenuClick('search')}
          onMouseEnter={() => handleMenuHover('search')}
        >
          Search
        </button>
        {activeMenu === 'search' && (
          <div className="absolute top-full left-0 mt-0.5 bg-white border border-[#b4b4b4] shadow-lg rounded-xs py-1 min-w-[220px] text-gray-800 text-xs z-50">
            <button onClick={() => executeAction(onFind)} className="w-full px-3 py-1.5 hover:bg-[#91c9f7]/40 flex justify-between items-center text-left">
              <span>Find...</span>
              <span className="text-gray-400 text-[11px]">Ctrl+F</span>
            </button>
            <button onClick={() => executeAction(onReplace)} className="w-full px-3 py-1.5 hover:bg-[#91c9f7]/40 flex justify-between items-center text-left">
              <span>Replace...</span>
              <span className="text-gray-400 text-[11px]">Ctrl+H</span>
            </button>
            <div className="my-1 border-t border-gray-200" />
            <button onClick={() => executeAction(onFindInFiles)} className="w-full px-3 py-1.5 hover:bg-[#91c9f7]/40 flex justify-between items-center text-left font-medium">
              <span>Find in Files (Project)...</span>
              <span className="text-gray-400 text-[11px]">Ctrl+Shift+F</span>
            </button>
            <button onClick={() => executeAction(onOpenCommandPalette)} className="w-full px-3 py-1.5 hover:bg-[#91c9f7]/40 flex justify-between items-center text-left">
              <span>Go to File / Action</span>
              <span className="text-gray-400 text-[11px]">Ctrl+P</span>
            </button>
          </div>
        )}
      </div>

      {/* VIEW MENU */}
      <div className="relative">
        <button
          className={`px-2.5 py-1 rounded-xs hover:bg-[#e0e0e0] cursor-default transition-colors ${
            activeMenu === 'view' ? 'bg-[#cce8ff] text-blue-900 ring-1 ring-blue-300' : ''
          }`}
          onClick={() => handleMenuClick('view')}
          onMouseEnter={() => handleMenuHover('view')}
        >
          View
        </button>
        {activeMenu === 'view' && (
          <div className="absolute top-full left-0 mt-0.5 bg-white border border-[#b4b4b4] shadow-lg rounded-xs py-1 min-w-[220px] text-gray-800 text-xs z-50">
            <button onClick={() => executeAction(onToggleSplit)} className="w-full px-3 py-1.5 hover:bg-[#91c9f7]/40 flex justify-between items-center text-left">
              <span>Toggle Live Preview Split</span>
              <span className="text-gray-400 text-[11px]">Alt+P</span>
            </button>
            <button onClick={() => executeAction(onToggleWordWrap)} className="w-full px-3 py-1.5 hover:bg-[#91c9f7]/40 flex justify-between items-center text-left">
              <span className="flex items-center gap-1.5">
                {wordWrap && <Check size={12} className="text-blue-600" />}
                <span className={!wordWrap ? 'pl-4' : ''}>Word Wrap</span>
              </span>
              <span className="text-gray-400 text-[11px]">Alt+Z</span>
            </button>
            <div className="my-1 border-t border-gray-200" />
            <button onClick={() => executeAction(onZoomIn)} className="w-full px-3 py-1.5 hover:bg-[#91c9f7]/40 flex justify-between items-center text-left">
              <span>Zoom In</span>
              <span className="text-gray-400 text-[11px]">Ctrl++</span>
            </button>
            <button onClick={() => executeAction(onZoomOut)} className="w-full px-3 py-1.5 hover:bg-[#91c9f7]/40 flex justify-between items-center text-left">
              <span>Zoom Out</span>
              <span className="text-gray-400 text-[11px]">Ctrl+-</span>
            </button>
            <button onClick={() => executeAction(onResetZoom)} className="w-full px-3 py-1.5 hover:bg-[#91c9f7]/40 flex justify-between items-center text-left">
              <span>Restore Default Zoom</span>
              <span className="text-gray-400 text-[11px]">Ctrl+0</span>
            </button>
            <div className="my-1 border-t border-gray-200" />
            <button onClick={() => executeAction(onOpenOutline)} className="w-full px-3 py-1.5 hover:bg-[#91c9f7]/40 flex justify-between items-center text-left">
              <span>Document Outline (DOM Tree)</span>
            </button>
            <button onClick={() => executeAction(onToggleFullscreen)} className="w-full px-3 py-1.5 hover:bg-[#91c9f7]/40 flex justify-between items-center text-left">
              <span>{isFullscreen ? 'Exit Full Screen' : 'Toggle Full Screen'}</span>
              <span className="text-gray-400 text-[11px]">F11</span>
            </button>
          </div>
        )}
      </div>

      {/* ENCODING MENU */}
      <div className="relative">
        <button
          className={`px-2.5 py-1 rounded-xs hover:bg-[#e0e0e0] cursor-default transition-colors ${
            activeMenu === 'encoding' ? 'bg-[#cce8ff] text-blue-900 ring-1 ring-blue-300' : ''
          }`}
          onClick={() => handleMenuClick('encoding')}
          onMouseEnter={() => handleMenuHover('encoding')}
        >
          Encoding
        </button>
        {activeMenu === 'encoding' && (
          <div className="absolute top-full left-0 mt-0.5 bg-white border border-[#b4b4b4] shadow-lg rounded-xs py-1 min-w-[200px] text-gray-800 text-xs z-50">
            {['UTF-8', 'UTF-8 with BOM', 'ANSI', 'ISO 8859-1'].map(enc => (
              <button
                key={enc}
                onClick={() => {
                  setEncoding(enc);
                  setActiveMenu(null);
                }}
                className="w-full px-3 py-1.5 hover:bg-[#91c9f7]/40 flex items-center gap-2 text-left"
              >
                {encoding === enc ? <Check size={12} className="text-blue-600" /> : <div className="w-3" />}
                <span>Encode in {enc}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* DEBUG MENU */}
      <div className="relative">
        <button
          className={`px-2.5 py-1 rounded-xs hover:bg-[#e0e0e0] cursor-default transition-colors ${
            activeMenu === 'debug' ? 'bg-[#cce8ff] text-blue-900 ring-1 ring-blue-300' : ''
          }`}
          onClick={() => handleMenuClick('debug')}
          onMouseEnter={() => handleMenuHover('debug')}
        >
          Debug
        </button>
        {activeMenu === 'debug' && (
          <div className="absolute top-full left-0 mt-0.5 bg-white border border-[#b4b4b4] shadow-lg rounded-xs py-1 min-w-[220px] text-gray-800 text-xs z-50">
            <button onClick={() => executeAction(onOpenConsole)} className="w-full px-3 py-1.5 hover:bg-[#91c9f7]/40 flex justify-between items-center text-left">
              <span>JavaScript Console / REPL</span>
              <span className="text-gray-400 text-[11px]">Alt+C</span>
            </button>
            <button onClick={() => executeAction(onOpenProblems)} className="w-full px-3 py-1.5 hover:bg-[#91c9f7]/40 flex justify-between items-center text-left">
              <span>Validation Problems & Errors</span>
            </button>
            <div className="my-1 border-t border-gray-200" />
            <button 
              onClick={() => {
                setActiveMenu(null);
                try {
                  console.clear();
                  alert("Console log buffer cleared.");
                } catch(e) {}
              }} 
              className="w-full px-3 py-1.5 hover:bg-[#91c9f7]/40 text-left"
            >
              Clear Console History
            </button>
          </div>
        )}
      </div>

      {/* WINDOW MENU */}
      <div className="relative">
        <button
          className={`px-2.5 py-1 rounded-xs hover:bg-[#e0e0e0] cursor-default transition-colors ${
            activeMenu === 'window' ? 'bg-[#cce8ff] text-blue-900 ring-1 ring-blue-300' : ''
          }`}
          onClick={() => handleMenuClick('window')}
          onMouseEnter={() => handleMenuHover('window')}
        >
          Window
        </button>
        {activeMenu === 'window' && (
          <div className="absolute top-full left-0 mt-0.5 bg-white border border-[#b4b4b4] shadow-lg rounded-xs py-1 min-w-[200px] text-gray-800 text-xs z-50">
            <button onClick={() => executeAction(onCloseActiveTab)} className="w-full px-3 py-1.5 hover:bg-[#91c9f7]/40 text-left">
              Close Current Tab
            </button>
            <button onClick={() => executeAction(onCloseAllTabs)} className="w-full px-3 py-1.5 hover:bg-[#91c9f7]/40 text-left">
              Close All Tabs
            </button>
            <div className="my-1 border-t border-gray-200" />
            <button onClick={() => executeAction(onOpenCommandPalette)} className="w-full px-3 py-1.5 hover:bg-[#91c9f7]/40 flex justify-between items-center text-left">
              <span>Command Palette...</span>
              <span className="text-gray-400 text-[11px]">Ctrl+Shift+P</span>
            </button>
          </div>
        )}
      </div>

      {/* RUN MENU */}
      <div className="relative">
        <button
          className={`px-2.5 py-1 rounded-xs hover:bg-[#e0e0e0] cursor-default transition-colors font-medium text-emerald-800 ${
            activeMenu === 'run' ? 'bg-[#cce8ff] text-blue-900 ring-1 ring-blue-300' : ''
          }`}
          onClick={() => handleMenuClick('run')}
          onMouseEnter={() => handleMenuHover('run')}
        >
          Run
        </button>
        {activeMenu === 'run' && (
          <div className="absolute top-full left-0 mt-0.5 bg-white border border-[#b4b4b4] shadow-lg rounded-xs py-1 min-w-[220px] text-gray-800 text-xs z-50">
            <button onClick={() => executeAction(onRunPreview)} className="w-full px-3 py-1.5 hover:bg-[#91c9f7]/40 flex justify-between items-center text-left font-semibold text-emerald-700">
              <span className="flex items-center gap-1.5">
                <Play size={12} className="fill-emerald-600 text-emerald-600" />
                Run in Live Preview
              </span>
              <span className="text-gray-400 text-[11px]">F5</span>
            </button>
            <button onClick={() => executeAction(onRunExternal)} className="w-full px-3 py-1.5 hover:bg-[#91c9f7]/40 flex justify-between items-center text-left">
              <span>Launch in New Window / Tab</span>
              <span className="text-gray-400 text-[11px]">Ctrl+F5</span>
            </button>
          </div>
        )}
      </div>

      {/* HELP MENU */}
      <div className="relative">
        <button
          className={`px-2.5 py-1 rounded-xs hover:bg-[#e0e0e0] cursor-default transition-colors ${
            activeMenu === 'help' ? 'bg-[#cce8ff] text-blue-900 ring-1 ring-blue-300' : ''
          }`}
          onClick={() => handleMenuClick('help')}
          onMouseEnter={() => handleMenuHover('help')}
        >
          Help
        </button>
        {activeMenu === 'help' && (
          <div className="absolute top-full left-0 mt-0.5 bg-white border border-[#b4b4b4] shadow-lg rounded-xs py-1 min-w-[220px] text-gray-800 text-xs z-50">
            <button onClick={() => executeAction(onOpenHelp)} className="w-full px-3 py-1.5 hover:bg-[#91c9f7]/40 flex justify-between items-center text-left font-medium">
              <span>Notepad++ HTML Manual & Docs</span>
              <span className="text-gray-400 text-[11px]">F1</span>
            </button>
            <button onClick={() => executeAction(onOpenSettings)} className="w-full px-3 py-1.5 hover:bg-[#91c9f7]/40 flex justify-between items-center text-left">
              <span>Preferences / Settings</span>
            </button>
            <div className="my-1 border-t border-gray-200" />
            <button onClick={() => executeAction(onOpenHelp)} className="w-full px-3 py-1.5 hover:bg-[#91c9f7]/40 text-left">
              About Notepad++ HTML Studio
            </button>
          </div>
        )}
      </div>

      <div className="ml-auto flex items-center gap-1 pr-1">
        <button
          onClick={onOpenSettings}
          title="Preferences / Settings"
          className="p-1 hover:bg-[#e0e0e0] rounded text-gray-600 transition-colors"
        >
          <Settings size={14} />
        </button>
        <button
          onClick={onOpenHelp}
          title="Manual & Shortcuts"
          className="p-1 hover:bg-[#e0e0e0] rounded text-gray-600 transition-colors"
        >
          <HelpCircle size={14} />
        </button>
      </div>
    </div>
  );
};
