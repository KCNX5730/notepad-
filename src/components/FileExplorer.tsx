import React, { useState } from 'react';
import { ProjectFile } from '../types';
import { 
  FileCode, FileText, Folder, FolderPlus, FilePlus, 
  Trash2, Edit2, Copy, Download, Upload, ChevronRight, 
  ChevronDown, RefreshCw, Sparkles, MoreVertical 
} from 'lucide-react';

interface FileExplorerProps {
  files: ProjectFile[];
  activeFileId: string | null;
  onSelectFile: (fileId: string) => void;
  onCreateFile: (name: string, type: 'html' | 'css' | 'js') => void;
  onRenameFile: (fileId: string, newName: string) => void;
  onDeleteFile: (fileId: string) => void;
  onDuplicateFile: (fileId: string) => void;
  onExportZip: () => void;
  onImportFile: () => void;
  onSelectSample: (id: string) => void;
}

export const FileExplorer: React.FC<FileExplorerProps> = ({
  files,
  activeFileId,
  onSelectFile,
  onCreateFile,
  onRenameFile,
  onDeleteFile,
  onDuplicateFile,
  onExportZip,
  onImportFile,
  onSelectSample,
}) => {
  const [filterText, setFilterText] = useState('');
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; fileId: string } | null>(null);

  const getFileIcon = (file: ProjectFile) => {
    switch (file.type) {
      case 'html':
        return <span className="text-orange-500 font-bold text-[11px] shrink-0">{'<>'}</span>;
      case 'css':
        return <span className="text-blue-500 font-bold text-[11px] shrink-0">#</span>;
      case 'js':
        return <span className="text-amber-500 font-bold text-[11px] shrink-0">JS</span>;
      default:
        return <FileText size={13} className="text-gray-400 shrink-0" />;
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) {
      setIsCreatingFile(false);
      return;
    }
    const name = newFileName.trim();
    let type: 'html' | 'css' | 'js' = 'html';
    if (name.endsWith('.css')) type = 'css';
    else if (name.endsWith('.js')) type = 'js';

    onCreateFile(name, type);
    setNewFileName('');
    setIsCreatingFile(false);
  };

  const handleRenameSubmit = (fileId: string) => {
    if (renameValue.trim()) {
      onRenameFile(fileId, renameValue.trim());
    }
    setRenamingId(null);
  };

  const filteredFiles = files.filter(f => 
    f.name.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-[#f0f0f0] border-r border-[#d4d4d4] select-none text-xs w-56 shrink-0">
      {/* Explorer Header */}
      <div className="px-3 py-2 border-b border-[#d4d4d4] flex items-center justify-between bg-[#e8e8e8]">
        <span className="font-bold text-gray-700 tracking-wider text-[11px] uppercase">Workspace</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsCreatingFile(true)}
            title="New File"
            className="p-1 hover:bg-[#d8d8d8] rounded text-gray-600 hover:text-gray-900 transition-colors"
          >
            <FilePlus size={14} />
          </button>
          <button
            onClick={onExportZip}
            title="Export ZIP"
            className="p-1 hover:bg-[#d8d8d8] rounded text-emerald-700 transition-colors"
          >
            <Download size={14} />
          </button>
          <button
            onClick={onImportFile}
            title="Import File"
            className="p-1 hover:bg-[#d8d8d8] rounded text-blue-700 transition-colors"
          >
            <Upload size={14} />
          </button>
        </div>
      </div>

      {/* Filter / Search input */}
      <div className="p-1.5 border-b border-[#d8d8d8] bg-[#f9f9f9]">
        <input
          type="text"
          placeholder="Filter files..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="w-full px-2 py-1 bg-white border border-gray-300 rounded text-xs outline-none focus:border-blue-500"
        />
      </div>

      {/* File List */}
      <div className="flex-1 overflow-y-auto py-1">
        {/* Inline new file input */}
        {isCreatingFile && (
          <form onSubmit={handleCreateSubmit} className="px-2 py-1">
            <input
              type="text"
              autoFocus
              placeholder="filename.html"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onBlur={() => setIsCreatingFile(false)}
              className="w-full px-2 py-1 bg-white border border-blue-500 rounded text-xs outline-none"
            />
          </form>
        )}

        {filteredFiles.map(file => {
          const isActive = file.id === activeFileId;
          const isRenaming = renamingId === file.id;

          return (
            <div
              key={file.id}
              onClick={() => onSelectFile(file.id)}
              onContextMenu={(e) => {
                e.preventDefault();
                setContextMenu({ x: e.clientX, y: e.clientY, fileId: file.id });
              }}
              className={`group flex items-center justify-between px-3 py-1.5 cursor-pointer transition-colors text-xs ${
                isActive
                  ? 'bg-[#cce8ff] text-blue-900 font-medium'
                  : 'hover:bg-[#e4e4e4] text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                {getFileIcon(file)}

                {isRenaming ? (
                  <input
                    type="text"
                    autoFocus
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onBlur={() => handleRenameSubmit(file.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRenameSubmit(file.id);
                      if (e.key === 'Escape') setRenamingId(null);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full px-1 py-0.5 bg-white border border-blue-500 rounded text-xs outline-none"
                  />
                ) : (
                  <span className="truncate">{file.name}</span>
                )}
              </div>

              {/* Status and Action badges */}
              <div className="flex items-center gap-1.5 shrink-0">
                {file.gitStatus === 'modified' && (
                  <span className="text-[10px] font-bold text-amber-600" title="Modified">
                    M
                  </span>
                )}
                {file.gitStatus === 'added' && (
                  <span className="text-[10px] font-bold text-emerald-600" title="Added">
                    U
                  </span>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setRenamingId(file.id);
                    setRenameValue(file.name);
                  }}
                  title="Rename"
                  className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-blue-600"
                >
                  <Edit2 size={11} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Delete file "${file.name}"?`)) {
                      onDeleteFile(file.id);
                    }
                  }}
                  title="Delete"
                  className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-red-600"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Preset selector at bottom of explorer */}
      <div className="p-2 border-t border-[#d4d4d4] bg-[#e8e8e8]">
        <label className="text-[10px] uppercase font-semibold text-gray-500 block mb-1">
          Sample Templates
        </label>
        <select
          onChange={(e) => {
            if (e.target.value) {
              onSelectSample(e.target.value);
              e.target.value = '';
            }
          }}
          className="w-full bg-white border border-gray-300 rounded px-1.5 py-1 text-xs text-gray-700 outline-none focus:border-blue-500"
          defaultValue=""
        >
          <option value="" disabled>Load a project...</option>
          <option value="starter-showcase">Modern Web Showcase</option>
          <option value="retro-game">Retro Arcade Game</option>
          <option value="blank-canvas">Blank HTML5 Starter</option>
        </select>
      </div>
    </div>
  );
};
