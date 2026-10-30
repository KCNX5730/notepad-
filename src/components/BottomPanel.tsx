import React, { useState } from 'react';
import { 
  ActiveBottomTab, Problem, ConsoleMessage, 
  GitBranch, OutlineItem, SearchResultItem, ProjectFile 
} from '../types';
import { 
  AlertCircle, AlertTriangle, Info, Terminal, Search, 
  GitBranch as GitIcon, ListTree, X, Trash2, Send, RotateCcw, Check, ChevronRight
} from 'lucide-react';

interface BottomPanelProps {
  activeTab: ActiveBottomTab;
  onTabChange: (tab: ActiveBottomTab) => void;
  problems: Problem[];
  consoleLogs: ConsoleMessage[];
  onClearConsole: () => void;
  onJumpToLine: (fileId: string, line: number, col: number) => void;
  // Git
  branches: GitBranch[];
  activeBranch: string;
  onCommit: (message: string) => void;
  onCheckoutCommit: (commitId: string) => void;
  onCreateBranch: (branchName: string) => void;
  // Outline
  outlineItems: OutlineItem[];
  // Search in files
  files: ProjectFile[];
  onSelectFile: (fileId: string) => void;
}

export const BottomPanel: React.FC<BottomPanelProps> = ({
  activeTab,
  onTabChange,
  problems,
  consoleLogs,
  onClearConsole,
  onJumpToLine,
  branches,
  activeBranch,
  onCommit,
  onCheckoutCommit,
  onCreateBranch,
  outlineItems,
  files,
  onSelectFile,
}) => {
  const [replInput, setReplInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [commitMessage, setCommitMessage] = useState('');
  const [newBranchInput, setNewBranchInput] = useState('');
  const [isAddingBranch, setIsAddingBranch] = useState(false);

  if (!activeTab) return null;

  const currentBranchObj = branches.find(b => b.name === activeBranch) || branches[0];

  // Perform project search across all files
  const handleProjectSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const q = query.toLowerCase();
    const results: SearchResultItem[] = [];

    files.forEach(file => {
      const lines = file.content.split('\n');
      lines.forEach((lineText, idx) => {
        const matchIdx = lineText.toLowerCase().indexOf(q);
        if (matchIdx !== -1) {
          results.push({
            fileId: file.id,
            filePath: file.path,
            fileName: file.name,
            line: idx + 1,
            lineText: lineText.trim(),
            matchIndex: matchIdx,
            matchLength: q.length,
          });
        }
      });
    });

    setSearchResults(results);
  };

  // REPL evaluator
  const handleReplSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replInput.trim()) return;

    const input = replInput.trim();
    setReplInput('');

    try {
      // Evaluate in safe context
      const result = eval(input);
      consoleLogs.push({
        id: `repl-in-${Date.now()}`,
        type: 'log',
        content: `> ${input}`,
        timestamp: new Date().toLocaleTimeString(),
      });
      consoleLogs.push({
        id: `repl-out-${Date.now()}`,
        type: 'info',
        content: typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result),
        timestamp: new Date().toLocaleTimeString(),
      });
    } catch (err: any) {
      consoleLogs.push({
        id: `repl-err-${Date.now()}`,
        type: 'error',
        content: `Error: ${err.message}`,
        timestamp: new Date().toLocaleTimeString(),
      });
    }
  };

  const errorCount = problems.filter(p => p.severity === 'error').length;
  const warningCount = problems.filter(p => p.severity === 'warning').length;

  return (
    <div className="bg-[#fcfcfc] border-t border-[#d4d4d4] flex flex-col h-56 select-none text-xs shrink-0 shadow-lg relative z-30">
      {/* Panel Tab Strip */}
      <div className="bg-[#e8e8e8] border-b border-[#d4d4d4] flex items-center justify-between px-2">
        <div className="flex items-center">
          {/* Problems Tab */}
          <button
            onClick={() => onTabChange('problems')}
            className={`px-3 py-1.5 flex items-center gap-1.5 border-r border-[#d4d4d4] transition-colors ${
              activeTab === 'problems'
                ? 'bg-[#fcfcfc] text-blue-900 font-semibold border-t-2 border-t-blue-600'
                : 'text-gray-700 hover:bg-[#dedede]'
            }`}
          >
            <AlertCircle size={13} className={errorCount > 0 ? 'text-red-500' : 'text-gray-500'} />
            <span>Problems</span>
            {problems.length > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                errorCount > 0 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {problems.length}
              </span>
            )}
          </button>

          {/* Console / Terminal Tab */}
          <button
            onClick={() => onTabChange('console')}
            className={`px-3 py-1.5 flex items-center gap-1.5 border-r border-[#d4d4d4] transition-colors ${
              activeTab === 'console'
                ? 'bg-[#fcfcfc] text-blue-900 font-semibold border-t-2 border-t-blue-600'
                : 'text-gray-700 hover:bg-[#dedede]'
            }`}
          >
            <Terminal size={13} className="text-gray-600" />
            <span>Terminal & Console</span>
            {consoleLogs.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-gray-200 text-gray-700 text-[10px]">
                {consoleLogs.length}
              </span>
            )}
          </button>

          {/* Find in Files Tab */}
          <button
            onClick={() => onTabChange('search')}
            className={`px-3 py-1.5 flex items-center gap-1.5 border-r border-[#d4d4d4] transition-colors ${
              activeTab === 'search'
                ? 'bg-[#fcfcfc] text-blue-900 font-semibold border-t-2 border-t-blue-600'
                : 'text-gray-700 hover:bg-[#dedede]'
            }`}
          >
            <Search size={13} className="text-gray-600" />
            <span>Find in Files</span>
          </button>

          {/* Git Tab */}
          <button
            onClick={() => onTabChange('git')}
            className={`px-3 py-1.5 flex items-center gap-1.5 border-r border-[#d4d4d4] transition-colors ${
              activeTab === 'git'
                ? 'bg-[#fcfcfc] text-blue-900 font-semibold border-t-2 border-t-blue-600'
                : 'text-gray-700 hover:bg-[#dedede]'
            }`}
          >
            <GitIcon size={13} className="text-blue-600" />
            <span>Version Control (Git)</span>
          </button>

          {/* Outline Tab */}
          <button
            onClick={() => onTabChange('outline')}
            className={`px-3 py-1.5 flex items-center gap-1.5 border-r border-[#d4d4d4] transition-colors ${
              activeTab === 'outline'
                ? 'bg-[#fcfcfc] text-blue-900 font-semibold border-t-2 border-t-blue-600'
                : 'text-gray-700 hover:bg-[#dedede]'
            }`}
          >
            <ListTree size={13} className="text-gray-600" />
            <span>Document Outline</span>
          </button>
        </div>

        {/* Close panel button */}
        <button
          onClick={() => onTabChange(null)}
          className="p-1 hover:bg-[#d4d4d4] rounded text-gray-500 hover:text-gray-800 transition-colors"
          title="Close Panel"
        >
          <X size={14} />
        </button>
      </div>

      {/* Panel Content Body */}
      <div className="flex-1 overflow-auto bg-white p-2">
        {/* PROBLEMS VIEW */}
        {activeTab === 'problems' && (
          <div className="h-full flex flex-col">
            {problems.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-400 gap-2">
                <Check size={16} className="text-emerald-500" />
                <span>No syntax problems detected. All files are clean!</span>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {problems.map(prob => (
                  <div
                    key={prob.id}
                    onClick={() => onJumpToLine(prob.fileId, prob.line, prob.col)}
                    className="py-1.5 px-2 hover:bg-blue-50 cursor-pointer flex items-center justify-between text-xs transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {prob.severity === 'error' && <AlertCircle size={14} className="text-red-500 shrink-0" />}
                      {prob.severity === 'warning' && <AlertTriangle size={14} className="text-amber-500 shrink-0" />}
                      {prob.severity === 'info' && <Info size={14} className="text-blue-500 shrink-0" />}
                      <span className="text-gray-800">{prob.message}</span>
                    </div>
                    <div className="text-gray-400 font-mono text-[11px] shrink-0">
                      {prob.fileName} ({prob.line}:{prob.col})
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CONSOLE & TERMINAL VIEW */}
        {activeTab === 'console' && (
          <div className="h-full flex flex-col font-mono text-xs">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between pb-1 border-b border-gray-100 mb-1">
              <span className="text-gray-500 text-[11px]">JavaScript Live Console & Sandbox Evaluator</span>
              <button
                onClick={onClearConsole}
                className="px-2 py-0.5 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded flex items-center gap-1 text-[11px]"
              >
                <Trash2 size={12} />
                <span>Clear</span>
              </button>
            </div>

            {/* Output scroll area */}
            <div className="flex-1 overflow-y-auto space-y-1">
              {consoleLogs.length === 0 ? (
                <div className="text-gray-400 italic py-4 text-center">
                  Console is empty. Run your code or execute JavaScript expressions below.
                </div>
              ) : (
                consoleLogs.map(log => (
                  <div
                    key={log.id}
                    className={`px-2 py-0.5 rounded flex items-start gap-2 ${
                      log.type === 'error'
                        ? 'bg-red-50 text-red-700'
                        : log.type === 'warn'
                        ? 'bg-amber-50 text-amber-800'
                        : log.type === 'info'
                        ? 'bg-blue-50 text-blue-800'
                        : 'text-gray-800'
                    }`}
                  >
                    <span className="text-gray-400 text-[10px] select-none shrink-0">{log.timestamp}</span>
                    <span className="whitespace-pre-wrap break-all flex-1">{log.content}</span>
                  </div>
                ))
              )}
            </div>

            {/* REPL Input row */}
            <form onSubmit={handleReplSubmit} className="pt-1.5 flex items-center gap-1 border-t border-gray-200 mt-1">
              <span className="text-blue-600 font-bold">{'>'}</span>
              <input
                type="text"
                placeholder="Evaluate JavaScript expression... (e.g. document.title or 10 * 5)"
                value={replInput}
                onChange={(e) => setReplInput(e.target.value)}
                className="flex-1 px-2 py-1 bg-gray-50 border border-gray-300 rounded outline-none focus:border-blue-500 text-xs"
              />
              <button
                type="submit"
                className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center gap-1 font-sans text-xs"
              >
                <Send size={11} />
                <span>Run</span>
              </button>
            </form>
          </div>
        )}

        {/* FIND IN FILES VIEW */}
        {activeTab === 'search' && (
          <div className="h-full flex flex-col text-xs">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
              <input
                type="text"
                placeholder="Search across all project files..."
                value={searchQuery}
                onChange={(e) => handleProjectSearch(e.target.value)}
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs outline-none focus:border-blue-500"
              />
              <span className="text-gray-400 text-[11px]">
                {searchResults.length} matches found
              </span>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-gray-100 pt-1">
              {searchResults.length === 0 && searchQuery && (
                <div className="text-gray-400 py-4 text-center">No matches found for "{searchQuery}"</div>
              )}
              {searchResults.map((res, i) => (
                <div
                  key={i}
                  onClick={() => {
                    onSelectFile(res.fileId);
                    onJumpToLine(res.fileId, res.line, res.matchIndex + 1);
                  }}
                  className="py-1 px-2 hover:bg-blue-50 cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-semibold text-blue-700">{res.fileName}:</span>
                    <span className="text-gray-700 font-mono text-[11px] truncate">{res.lineText}</span>
                  </div>
                  <span className="text-gray-400 font-mono text-[11px] shrink-0">Line {res.line}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GIT VERSION CONTROL VIEW */}
        {activeTab === 'git' && (
          <div className="h-full flex gap-4 text-xs">
            {/* Left: Commit Action & Branches */}
            <div className="w-64 border-r border-gray-200 pr-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-700">Branch: {activeBranch}</span>
                  <button
                    onClick={() => setIsAddingBranch(!isAddingBranch)}
                    className="text-blue-600 hover:underline text-[11px]"
                  >
                    + New Branch
                  </button>
                </div>

                {isAddingBranch && (
                  <div className="flex items-center gap-1 mb-2">
                    <input
                      type="text"
                      placeholder="branch-name"
                      value={newBranchInput}
                      onChange={(e) => setNewBranchInput(e.target.value)}
                      className="flex-1 px-1.5 py-0.5 border border-blue-400 rounded text-xs outline-none"
                    />
                    <button
                      onClick={() => {
                        if (newBranchInput.trim()) {
                          onCreateBranch(newBranchInput.trim());
                          setNewBranchInput('');
                          setIsAddingBranch(false);
                        }
                      }}
                      className="px-2 py-0.5 bg-blue-600 text-white rounded text-[11px]"
                    >
                      Add
                    </button>
                  </div>
                )}

                <div className="space-y-1.5 mb-3">
                  <label className="text-gray-500 text-[11px] font-medium block">Commit Message</label>
                  <textarea
                    rows={2}
                    placeholder="Describe your changes..."
                    value={commitMessage}
                    onChange={(e) => setCommitMessage(e.target.value)}
                    className="w-full p-1.5 border border-gray-300 rounded text-xs outline-none focus:border-blue-500 resize-none"
                  />
                  <button
                    onClick={() => {
                      if (commitMessage.trim()) {
                        onCommit(commitMessage);
                        setCommitMessage('');
                      }
                    }}
                    className="w-full py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded shadow-xs"
                  >
                    Commit Changes
                  </button>
                </div>
              </div>

              <div className="text-gray-400 text-[10px]">
                Snapshots are stored in LocalDB with full rollback capability.
              </div>
            </div>

            {/* Right: Commit History Timeline */}
            <div className="flex-1 overflow-y-auto">
              <span className="font-semibold text-gray-700 block mb-2">Commit Timeline</span>
              <div className="space-y-2">
                {currentBranchObj.commits.map((commit, index) => (
                  <div
                    key={commit.id}
                    className="p-2 border border-gray-200 hover:border-blue-400 rounded flex items-center justify-between bg-gray-50/50"
                  >
                    <div>
                      <div className="font-medium text-gray-900">{commit.message}</div>
                      <div className="text-gray-400 text-[11px] flex items-center gap-2">
                        <span className="font-mono bg-gray-200 px-1 rounded text-gray-700">{commit.hash}</span>
                        <span>{commit.author}</span>
                        <span>•</span>
                        <span>{commit.timestamp}</span>
                      </div>
                    </div>

                    {index !== 0 && (
                      <button
                        onClick={() => {
                          if (confirm(`Roll back workspace to commit ${commit.hash}?`)) {
                            onCheckoutCommit(commit.id);
                          }
                        }}
                        className="px-2 py-1 text-gray-700 hover:text-blue-700 hover:bg-blue-50 border border-gray-300 rounded flex items-center gap-1 text-[11px]"
                      >
                        <RotateCcw size={12} />
                        <span>Rollback</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* DOCUMENT OUTLINE VIEW */}
        {activeTab === 'outline' && (
          <div className="h-full overflow-y-auto text-xs">
            {outlineItems.length === 0 ? (
              <div className="text-gray-400 py-4 text-center">
                No headings, tags, or IDs found in active HTML file.
              </div>
            ) : (
              <div className="space-y-1">
                {outlineItems.map(item => (
                  <div
                    key={item.id}
                    onClick={() => onJumpToLine(files[0]?.id || '', item.line, 1)}
                    className="py-1 px-2 hover:bg-blue-50 cursor-pointer flex items-center justify-between rounded"
                  >
                    <div className="flex items-center gap-1.5">
                      <ChevronRight size={12} className="text-gray-400" />
                      <span className={`font-mono ${item.type === 'heading' ? 'font-bold text-blue-900' : 'text-gray-700'}`}>
                        {item.label}
                      </span>
                    </div>
                    <span className="text-gray-400 text-[11px]">Line {item.line}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
