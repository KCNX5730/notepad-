import React from 'react';
import { ProjectFile } from '../types';
import { X, Plus, Save, FileCode, Split, Maximize2, Minimize2 } from 'lucide-react';

interface TabBarProps {
  files: ProjectFile[];
  openTabIds: string[];
  activeFileId: string | null;
  onSelectTab: (fileId: string) => void;
  onCloseTab: (fileId: string, e: React.MouseEvent) => void;
  onNewFile: () => void;
  onToggleSplit: () => void;
  isSplitActive: boolean;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const TabBar: React.FC<TabBarProps> = ({
  files,
  openTabIds,
  activeFileId,
  onSelectTab,
  onCloseTab,
  onNewFile,
  onToggleSplit,
  isSplitActive,
  isFullscreen,
  onToggleFullscreen,
}) => {
  const fileMap = new Map(files.map(f => [f.id, f]));

  return (
    <div className="bg-[#e4e4e4] border-b border-[#c4c4c4] flex items-center overflow-x-auto select-none text-xs">
      {/* Tabs */}
      <div className="flex items-center min-w-0 flex-1">
        {openTabIds.map(id => {
          const file = fileMap.get(id);
          if (!file) return null;
          const isActive = activeFileId === id;
          const isDirty = file.gitStatus === 'modified' || file.gitStatus === 'added';

          return (
            <div
              key={id}
              onClick={() => onSelectTab(id)}
              className={`group flex items-center gap-1.5 px-3 py-1.5 border-r border-[#c4c4c4] cursor-pointer max-w-[200px] min-w-[110px] transition-colors relative ${
                isActive
                  ? 'bg-white text-gray-900 font-medium border-t-2 border-t-blue-600 shadow-xs'
                  : 'bg-[#e4e4e4] hover:bg-[#eaeaea] text-gray-700'
              }`}
            >
              {/* Notepad++ style floppy indicator: Red disk if dirty, Blue disk if saved */}
              <div 
                title={isDirty ? 'Unsaved changes' : 'Saved'}
                className={`w-3.5 h-3.5 rounded-xs flex items-center justify-center shrink-0 text-[9px] ${
                  isDirty 
                    ? 'bg-rose-500 text-white font-bold' 
                    : 'bg-blue-600 text-white'
                }`}
              >
                💾
              </div>

              <span className="truncate flex-1 text-xs">
                {file.name}
              </span>

              {/* Close Button */}
              <button
                onClick={(e) => onCloseTab(id, e)}
                title="Close (Ctrl+W)"
                className="w-4 h-4 rounded-xs hover:bg-gray-200 text-gray-500 hover:text-red-600 flex items-center justify-center shrink-0 transition-colors"
              >
                <X size={12} />
              </button>
            </div>
          );
        })}

        {/* New Tab Button */}
        <button
          onClick={onNewFile}
          title="New Document"
          className="p-1.5 px-2 hover:bg-[#d0d0d0] text-gray-600 hover:text-gray-900 border-r border-[#c4c4c4] flex items-center transition-colors shrink-0"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Right control buttons */}
      <div className="flex items-center gap-1 px-2 shrink-0">
        <button
          onClick={onToggleSplit}
          title={isSplitActive ? 'Hide Live Preview' : 'Show Live Preview'}
          className={`p-1 rounded text-gray-600 hover:bg-white/80 transition-colors ${
            isSplitActive ? 'text-blue-700 bg-white/60' : ''
          }`}
        >
          <Split size={14} />
        </button>
        <button
          onClick={onToggleFullscreen}
          title={isFullscreen ? 'Exit Full Screen' : 'Full Screen'}
          className="p-1 rounded text-gray-600 hover:bg-white/80 transition-colors"
        >
          {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
        </button>
      </div>
    </div>
  );
};
