import React from 'react';
import { 
  FilePlus, FolderOpen, Save, Files, X, 
  Scissors, Copy, Clipboard, Undo2, Redo2, 
  Search, Replace, ZoomIn, ZoomOut, 
  WrapText, Sparkles, Wand2, Play, 
  Columns, ExternalLink, Terminal, ListTree,
  Download, Upload, AlertCircle
} from 'lucide-react';

interface ToolBarProps {
  onNewFile: () => void;
  onOpenFile: () => void;
  onSaveFile: () => void;
  onSaveAll: () => void;
  onCloseActive: () => void;
  onExportZip: () => void;
  onCut: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onFind: () => void;
  onReplace: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleWordWrap: () => void;
  onFormat: () => void;
  onExpandEmmet: () => void;
  onRun: () => void;
  onToggleSplit: () => void;
  onOpenConsole: () => void;
  onOpenOutline: () => void;
  onOpenProblems: () => void;
  wordWrap: boolean;
  isSplitActive: boolean;
  problemCount: number;
}

export const ToolBar: React.FC<ToolBarProps> = ({
  onNewFile,
  onOpenFile,
  onSaveFile,
  onSaveAll,
  onCloseActive,
  onExportZip,
  onCut,
  onCopy,
  onPaste,
  onUndo,
  onRedo,
  onFind,
  onReplace,
  onZoomIn,
  onZoomOut,
  onToggleWordWrap,
  onFormat,
  onExpandEmmet,
  onRun,
  onToggleSplit,
  onOpenConsole,
  onOpenOutline,
  onOpenProblems,
  wordWrap,
  isSplitActive,
  problemCount,
}) => {
  return (
    <div className="bg-[#f5f5f5] border-b border-[#d8d8d8] px-2 py-1 flex items-center gap-0.5 overflow-x-auto text-gray-700 select-none shadow-xs text-xs">
      {/* File group */}
      <button 
        onClick={onNewFile} 
        title="New (Ctrl+N)" 
        className="p-1 hover:bg-[#e4e4e4] active:bg-[#d0d0d0] rounded border border-transparent hover:border-[#c0c0c0] transition-colors"
      >
        <FilePlus size={16} className="text-gray-700" />
      </button>
      <button 
        onClick={onOpenFile} 
        title="Open File (Ctrl+O)" 
        className="p-1 hover:bg-[#e4e4e4] active:bg-[#d0d0d0] rounded border border-transparent hover:border-[#c0c0c0] transition-colors"
      >
        <FolderOpen size={16} className="text-amber-600" />
      </button>
      <button 
        onClick={onSaveFile} 
        title="Save (Ctrl+S)" 
        className="p-1 hover:bg-[#e4e4e4] active:bg-[#d0d0d0] rounded border border-transparent hover:border-[#c0c0c0] transition-colors"
      >
        <Save size={16} className="text-blue-600" />
      </button>
      <button 
        onClick={onSaveAll} 
        title="Save All (Ctrl+Shift+S)" 
        className="p-1 hover:bg-[#e4e4e4] active:bg-[#d0d0d0] rounded border border-transparent hover:border-[#c0c0c0] transition-colors"
      >
        <Files size={16} className="text-indigo-600" />
      </button>
      <button 
        onClick={onCloseActive} 
        title="Close Tab (Ctrl+W)" 
        className="p-1 hover:bg-[#e4e4e4] active:bg-[#d0d0d0] rounded border border-transparent hover:border-[#c0c0c0] transition-colors text-red-600"
      >
        <X size={16} />
      </button>
      <button 
        onClick={onExportZip} 
        title="Export Project ZIP" 
        className="p-1 hover:bg-[#e4e4e4] active:bg-[#d0d0d0] rounded border border-transparent hover:border-[#c0c0c0] transition-colors text-emerald-700"
      >
        <Download size={16} />
      </button>

      <div className="h-4 w-px bg-gray-300 mx-1" />

      {/* Clipboard group */}
      <button 
        onClick={onCut} 
        title="Cut (Ctrl+X)" 
        className="p-1 hover:bg-[#e4e4e4] active:bg-[#d0d0d0] rounded border border-transparent hover:border-[#c0c0c0] transition-colors"
      >
        <Scissors size={16} className="text-gray-600" />
      </button>
      <button 
        onClick={onCopy} 
        title="Copy (Ctrl+C)" 
        className="p-1 hover:bg-[#e4e4e4] active:bg-[#d0d0d0] rounded border border-transparent hover:border-[#c0c0c0] transition-colors"
      >
        <Copy size={16} className="text-gray-600" />
      </button>
      <button 
        onClick={onPaste} 
        title="Paste (Ctrl+V)" 
        className="p-1 hover:bg-[#e4e4e4] active:bg-[#d0d0d0] rounded border border-transparent hover:border-[#c0c0c0] transition-colors"
      >
        <Clipboard size={16} className="text-gray-600" />
      </button>

      <div className="h-4 w-px bg-gray-300 mx-1" />

      {/* Undo / Redo */}
      <button 
        onClick={onUndo} 
        title="Undo (Ctrl+Z)" 
        className="p-1 hover:bg-[#e4e4e4] active:bg-[#d0d0d0] rounded border border-transparent hover:border-[#c0c0c0] transition-colors"
      >
        <Undo2 size={16} className="text-blue-700" />
      </button>
      <button 
        onClick={onRedo} 
        title="Redo (Ctrl+Y)" 
        className="p-1 hover:bg-[#e4e4e4] active:bg-[#d0d0d0] rounded border border-transparent hover:border-[#c0c0c0] transition-colors"
      >
        <Redo2 size={16} className="text-blue-700" />
      </button>

      <div className="h-4 w-px bg-gray-300 mx-1" />

      {/* Find / Replace */}
      <button 
        onClick={onFind} 
        title="Find (Ctrl+F)" 
        className="p-1 hover:bg-[#e4e4e4] active:bg-[#d0d0d0] rounded border border-transparent hover:border-[#c0c0c0] transition-colors"
      >
        <Search size={16} className="text-teal-700" />
      </button>
      <button 
        onClick={onReplace} 
        title="Replace (Ctrl+H)" 
        className="p-1 hover:bg-[#e4e4e4] active:bg-[#d0d0d0] rounded border border-transparent hover:border-[#c0c0c0] transition-colors"
      >
        <Replace size={16} className="text-teal-700" />
      </button>

      <div className="h-4 w-px bg-gray-300 mx-1" />

      {/* Zoom / View */}
      <button 
        onClick={onZoomIn} 
        title="Zoom In (Ctrl++)" 
        className="p-1 hover:bg-[#e4e4e4] active:bg-[#d0d0d0] rounded border border-transparent hover:border-[#c0c0c0] transition-colors"
      >
        <ZoomIn size={16} className="text-gray-600" />
      </button>
      <button 
        onClick={onZoomOut} 
        title="Zoom Out (Ctrl+-)" 
        className="p-1 hover:bg-[#e4e4e4] active:bg-[#d0d0d0] rounded border border-transparent hover:border-[#c0c0c0] transition-colors"
      >
        <ZoomOut size={16} className="text-gray-600" />
      </button>
      <button 
        onClick={onToggleWordWrap} 
        title={`Word Wrap: ${wordWrap ? 'On' : 'Off'} (Alt+Z)`} 
        className={`p-1 rounded border transition-colors ${
          wordWrap ? 'bg-[#cce8ff] border-blue-400 text-blue-900' : 'hover:bg-[#e4e4e4] border-transparent text-gray-600'
        }`}
      >
        <WrapText size={16} />
      </button>

      <div className="h-4 w-px bg-gray-300 mx-1" />

      {/* Format & Emmet */}
      <button 
        onClick={onFormat} 
        title="Format Code (Alt+Shift+F)" 
        className="px-1.5 py-1 flex items-center gap-1 hover:bg-[#e4e4e4] rounded border border-transparent hover:border-[#c0c0c0] transition-colors text-purple-700 font-medium"
      >
        <Wand2 size={15} />
        <span className="hidden md:inline">Format</span>
      </button>

      <button 
        onClick={onExpandEmmet} 
        title="Expand Emmet Abbreviation (Tab or Ctrl+E)" 
        className="px-1.5 py-1 flex items-center gap-1 hover:bg-[#e4e4e4] rounded border border-transparent hover:border-[#c0c0c0] transition-colors text-sky-700 font-medium"
      >
        <Sparkles size={15} />
        <span className="hidden md:inline">Emmet</span>
      </button>

      <div className="h-4 w-px bg-gray-300 mx-1" />

      {/* Panels: Outline, Problems, Console */}
      <button 
        onClick={onOpenOutline} 
        title="Document Outline (DOM Tree)" 
        className="p-1 hover:bg-[#e4e4e4] rounded border border-transparent hover:border-[#c0c0c0] text-gray-700 transition-colors"
      >
        <ListTree size={16} />
      </button>

      <button 
        onClick={onOpenProblems} 
        title={`Problems & Warnings (${problemCount})`} 
        className="px-1.5 py-1 flex items-center gap-1 hover:bg-[#e4e4e4] rounded border border-transparent hover:border-[#c0c0c0] text-amber-700 font-medium transition-colors"
      >
        <AlertCircle size={15} />
        {problemCount > 0 && (
          <span className="bg-amber-100 text-amber-900 px-1 rounded-full text-[10px] font-bold">
            {problemCount}
          </span>
        )}
      </button>

      <button 
        onClick={onOpenConsole} 
        title="JS Console & Terminal (Alt+C)" 
        className="p-1 hover:bg-[#e4e4e4] rounded border border-transparent hover:border-[#c0c0c0] text-gray-700 transition-colors"
      >
        <Terminal size={16} />
      </button>

      <div className="h-4 w-px bg-gray-300 mx-1" />

      {/* Split Preview Toggle */}
      <button 
        onClick={onToggleSplit} 
        title="Toggle Split Live Preview" 
        className={`px-2 py-1 flex items-center gap-1.5 rounded border transition-colors ${
          isSplitActive 
            ? 'bg-blue-100 border-blue-400 text-blue-900 font-semibold' 
            : 'hover:bg-[#e4e4e4] border-transparent text-gray-700'
        }`}
      >
        <Columns size={15} />
        <span className="hidden sm:inline">Split View</span>
      </button>

      {/* RUN BUTTON - Signature Notepad++ Emerald Green Play Button */}
      <button 
        onClick={onRun} 
        title="Run / Reload Preview (F5)" 
        className="ml-auto px-3 py-1 flex items-center gap-1.5 rounded bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold shadow-xs hover:shadow transition-all"
      >
        <Play size={14} className="fill-white" />
        <span>RUN (F5)</span>
      </button>
    </div>
  );
};
