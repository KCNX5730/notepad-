import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import confetti from 'canvas-confetti';

import { 
  ProjectFile, EditorSettings, ActiveBottomTab, 
  Problem, ConsoleMessage, GitBranch, OutlineItem 
} from './types';
import { 
  DEFAULT_SETTINGS, SAMPLE_PROJECTS, 
  loadStoredFiles, saveStoredFiles, 
  loadStoredSettings, saveStoredSettings, 
  loadStoredTabs, saveStoredTabs, 
  loadStoredGit, saveStoredGit 
} from './utils/storage';
import { expandEmmet } from './utils/emmet';
import { formatCode } from './utils/formatter';
import { lintFile, parseOutline } from './utils/linter';
import { commitChanges } from './utils/git';
import { exportProjectAsZip, importFilesFromZipOrFile } from './utils/zipExport';

import { MenuBar } from './components/MenuBar';
import { ToolBar } from './components/ToolBar';
import { TabBar } from './components/TabBar';
import { EditorArea } from './components/EditorArea';
import { FileExplorer } from './components/FileExplorer';
import { LivePreview } from './components/LivePreview';
import { StatusBar } from './components/StatusBar';
import { BottomPanel } from './components/BottomPanel';
import { CommandPalette } from './components/CommandPalette';
import { FindReplaceModal } from './components/FindReplaceModal';
import { SettingsModal } from './components/SettingsModal';
import { HelpModal } from './components/HelpModal';
import { MobileQuickBar } from './components/MobileQuickBar';

export default function App() {
  // State: Files & Tabs
  const [files, setFiles] = useState<ProjectFile[]>(() => loadStoredFiles());
  const [openTabIds, setOpenTabIds] = useState<string[]>(() => {
    const loaded = loadStoredTabs();
    return loaded.tabs.filter(id => files.some(f => f.id === id)).length > 0
      ? loaded.tabs
      : [files[0]?.id || ''];
  });
  const [activeFileId, setActiveFileId] = useState<string | null>(() => {
    const loaded = loadStoredTabs();
    return loaded.activeId || files[0]?.id || null;
  });

  // State: Settings
  const [settings, setSettings] = useState<EditorSettings>(() => loadStoredSettings());

  // State: Git
  const [branches, setBranches] = useState<GitBranch[]>(() => loadStoredGit());
  const [activeBranch, setActiveBranch] = useState<string>('main');

  // State: Cursor & Document Info
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1, selLength: 0, totalLines: 1, length: 0 });

  // State: UI Toggles & Panels
  const [isSplitActive, setIsSplitActive] = useState(true);
  const [activeBottomTab, setActiveBottomTab] = useState<ActiveBottomTab>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor');
  const [showExplorer, setShowExplorer] = useState(true);

  // State: Modals
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isFindReplaceOpen, setIsFindReplaceOpen] = useState(false);
  const [findMode, setFindMode] = useState<'find' | 'replace'>('find');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // State: Console & Run Trigger
  const [consoleLogs, setConsoleLogs] = useState<ConsoleMessage[]>([
    {
      id: 'init-1',
      type: 'info',
      content: '⚡ Notepad++ HTML Studio ready. Type code or press F5 / Run to preview.',
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [runTrigger, setRunTrigger] = useState(0);

  // Hidden file input for importing
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<ReactCodeMirrorRef | null>(null);

  // Active file object
  const activeFile = useMemo(() => {
    return files.find(f => f.id === activeFileId) || null;
  }, [files, activeFileId]);

  // Real-time linting problems
  const problems = useMemo(() => {
    const allProblems: Problem[] = [];
    files.forEach(f => {
      allProblems.push(...lintFile(f));
    });
    return allProblems;
  }, [files]);

  // Real-time document outline
  const outlineItems = useMemo(() => {
    if (!activeFile || activeFile.type !== 'html') return [];
    return parseOutline(activeFile.content);
  }, [activeFile]);

  // Persist files in LocalDB
  useEffect(() => {
    saveStoredFiles(files);
  }, [files]);

  // Persist tabs
  useEffect(() => {
    saveStoredTabs(openTabIds, activeFileId);
  }, [openTabIds, activeFileId]);

  // Persist settings
  useEffect(() => {
    saveStoredSettings(settings);
  }, [settings]);

  // Persist Git
  useEffect(() => {
    saveStoredGit(branches);
  }, [branches]);

  // Touch Swipe to switch Editor / Preview on mobile devices
  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartX.current;
    if (Math.abs(diff) > 75) {
      if (diff > 0 && mobileView === 'editor') {
        // Swiped right: switch to preview
        setMobileView('preview');
        handleRunPreview();
      } else if (diff < 0 && mobileView === 'preview') {
        // Swiped left: switch back to editor
        setMobileView('editor');
      }
    }
    touchStartX.current = null;
  };

  // Content change handler
  const handleContentChange = useCallback((newContent: string) => {
    if (!activeFileId) return;
    setFiles(prev =>
      prev.map(f => {
        if (f.id === activeFileId) {
          const isModified = f.originalContent !== undefined && f.originalContent !== newContent;
          return {
            ...f,
            content: newContent,
            gitStatus: isModified ? 'modified' : f.gitStatus,
          };
        }
        return f;
      })
    );

    // If live reload enabled, bump trigger after slight delay
    if (settings.liveReload) {
      setRunTrigger(t => t + 1);
    }
  }, [activeFileId, settings.liveReload]);

  // Cursor change handler
  const handleCursorChange = useCallback(
    (line: number, col: number, selLength: number, totalLines: number, length: number) => {
      setCursorPos({ line, col, selLength, totalLines, length });
    },
    []
  );

  // File management
  const handleSelectFile = (fileId: string) => {
    if (!openTabIds.includes(fileId)) {
      setOpenTabIds(prev => [...prev, fileId]);
    }
    setActiveFileId(fileId);
  };

  const handleCloseTab = (fileId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const newTabs = openTabIds.filter(id => id !== fileId);
    setOpenTabIds(newTabs);

    if (activeFileId === fileId) {
      if (newTabs.length > 0) {
        setActiveFileId(newTabs[newTabs.length - 1]);
      } else {
        setActiveFileId(null);
      }
    }
  };

  const handleCreateFile = (name: string, type: 'html' | 'css' | 'js') => {
    const newFile: ProjectFile = {
      id: `file-${Date.now()}`,
      name,
      path: `/${name}`,
      type,
      content: type === 'html' 
        ? '<!DOCTYPE html>\n<html>\n<head>\n  <title>New Document</title>\n</head>\n<body>\n  \n</body>\n</html>'
        : type === 'css' 
        ? '/* Stylesheet */\n' 
        : '// JavaScript code\n',
      gitStatus: 'added',
      originalContent: '',
    };
    setFiles(prev => [...prev, newFile]);
    setOpenTabIds(prev => [...prev, newFile.id]);
    setActiveFileId(newFile.id);
  };

  const handleRenameFile = (fileId: string, newName: string) => {
    setFiles(prev =>
      prev.map(f => {
        if (f.id === fileId) {
          let type = f.type;
          if (newName.endsWith('.css')) type = 'css';
          else if (newName.endsWith('.js')) type = 'js';
          else if (newName.endsWith('.html')) type = 'html';
          return { ...f, name: newName, path: `/${newName}`, type };
        }
        return f;
      })
    );
  };

  const handleDeleteFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    handleCloseTab(fileId);
  };

  const handleDuplicateFile = (fileId: string) => {
    const target = files.find(f => f.id === fileId);
    if (!target) return;
    const copyName = `copy_${target.name}`;
    let type: 'html' | 'css' | 'js' = 'html';
    if (target.type === 'css' || target.type === 'js') type = target.type;
    handleCreateFile(copyName, type);
  };

  const handleSaveFile = () => {
    if (!activeFile) return;
    setFiles(prev =>
      prev.map(f => {
        if (f.id === activeFile.id) {
          return { ...f, originalContent: f.content, gitStatus: 'unmodified' };
        }
        return f;
      })
    );
    // Trigger run preview
    setRunTrigger(t => t + 1);
  };

  const handleSaveAll = () => {
    setFiles(prev =>
      prev.map(f => ({ ...f, originalContent: f.content, gitStatus: 'unmodified' }))
    );
    setRunTrigger(t => t + 1);
  };

  // Run preview
  const handleRunPreview = () => {
    setRunTrigger(t => t + 1);
    setMobileView('preview');
    // Celebration confetti pop on manual run
    try {
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.1 } });
    } catch(e) {}
  };

  const handleRunExternal = () => {
    let htmlFile = files.find(f => f.id === activeFileId && f.type === 'html') || files.find(f => f.name === 'index.html');
    if (!htmlFile) return;
    const win = window.open('', '_blank');
    if (win) {
      win.document.open();
      win.document.write(htmlFile.content);
      win.document.close();
    }
  };

  // Code actions: Format, Emmet, Paired Tag Rename
  const handleFormatCode = () => {
    if (!activeFile) return;
    const formatted = formatCode(activeFile.content, activeFile.type, settings.tabSize);
    handleContentChange(formatted);
  };

  const handleExpandEmmet = () => {
    if (!activeFile || !editorRef.current?.view) return;
    const view = editorRef.current.view;
    const doc = view.state.doc;
    const selection = view.state.selection.main;
    const currentLine = doc.lineAt(selection.head);
    const lineText = currentLine.text;
    const col = selection.head - currentLine.from;

    // Look back from cursor to find abbreviation word
    const textBeforeCursor = lineText.slice(0, col);
    const match = textBeforeCursor.match(/([a-zA-Z0-9_\-#.[\]+*>{}$="':!]+)$/);

    if (match) {
      const abbr = match[1];
      const expanded = expandEmmet(abbr, settings.tabSize);
      if (expanded) {
        const fromPos = currentLine.from + match.index!;
        const toPos = currentLine.from + col;
        view.dispatch({
          changes: { from: fromPos, to: toPos, insert: expanded },
          selection: { anchor: fromPos + expanded.length },
        });
        return;
      }
    }

    // Default: If no inline abbreviation, expand full boilerplate or prompt
    const expandedBoilerplate = expandEmmet('!', settings.tabSize);
    if (expandedBoilerplate && (!activeFile.content || activeFile.content.trim() === '')) {
      handleContentChange(expandedBoilerplate);
    } else {
      alert("Type an Emmet abbreviation (e.g. 'div.container>h1+p*2' or '!') and press Tab / Emmet.");
    }
  };

  // Paired Tag Rename
  const handleRenamePairedTag = () => {
    if (!activeFile || activeFile.type !== 'html') return;
    const newTagName = prompt("Enter new HTML tag name (e.g. 'section' or 'article'):");
    if (!newTagName || !newTagName.trim()) return;

    const trimmed = newTagName.trim().toLowerCase();
    // Prompt old tag or detect at cursor
    const oldTagName = prompt("Enter existing HTML tag to replace (e.g. 'div'):");
    if (!oldTagName || !oldTagName.trim()) return;

    const oldTag = oldTagName.trim().toLowerCase();
    const openRegex = new RegExp(`<${oldTag}\\b`, 'g');
    const closeRegex = new RegExp(`</${oldTag}>`, 'g');

    const updated = activeFile.content
      .replace(openRegex, `<${trimmed}`)
      .replace(closeRegex, `</${trimmed}>`);

    handleContentChange(updated);
  };

  // Mobile quick character insertion
  const handleInsertChar = (char: string) => {
    if (!editorRef.current?.view) return;
    const view = editorRef.current.view;
    const sel = view.state.selection.main;
    view.dispatch({
      changes: { from: sel.from, to: sel.to, insert: char },
      selection: { anchor: sel.from + char.length },
    });
    view.focus();
  };

  // Export / Import
  const handleExportZip = () => {
    exportProjectAsZip(files, 'notepad-html-project');
  };

  const handleImportFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imported = await importFilesFromZipOrFile(file);
      setFiles(prev => [...prev, ...imported]);
      if (imported.length > 0) {
        setOpenTabIds(prev => [...prev, imported[0].id]);
        setActiveFileId(imported[0].id);
      }
      alert(`Imported ${imported.length} file(s) successfully!`);
    } catch (err: any) {
      alert(`Failed to import: ${err.message}`);
    }
    e.target.value = '';
  };

  // Sample project selector
  const handleSelectSample = (sampleId: string) => {
    const sample = SAMPLE_PROJECTS.find(s => s.id === sampleId);
    if (!sample) return;
    if (confirm(`Load "${sample.name}"? Current workspace files will be replaced with this template.`)) {
      setFiles(sample.files);
      setOpenTabIds(sample.files.map(f => f.id));
      setActiveFileId(sample.files[0]?.id || null);
      setRunTrigger(t => t + 1);
    }
  };

  // Jump to line from Problems or Search
  const handleJumpToLine = (fileId: string, line: number, col: number) => {
    handleSelectFile(fileId);
    setTimeout(() => {
      if (editorRef.current?.view) {
        const view = editorRef.current.view;
        const lineObj = view.state.doc.line(Math.min(line, view.state.doc.lines));
        const pos = Math.min(lineObj.from + col - 1, lineObj.to);
        view.dispatch({
          selection: { anchor: pos },
          scrollIntoView: true,
        });
        view.focus();
      }
    }, 50);
  };

  // Git Actions
  const handleCommit = (message: string) => {
    const { updatedBranches, newCommit } = commitChanges(branches, activeBranch, message, files);
    setBranches(updatedBranches);
    // Mark files as unmodified
    setFiles(prev =>
      prev.map(f => ({ ...f, originalContent: f.content, gitStatus: 'unmodified' }))
    );
    try {
      confetti({ particleCount: 25, spread: 50 });
    } catch(e) {}
    alert(`Committed successfully: [${newCommit.hash}] ${newCommit.message}`);
  };

  const handleCheckoutCommit = (commitId: string) => {
    const branch = branches.find(b => b.name === activeBranch);
    if (!branch) return;
    const commit = branch.commits.find(c => c.id === commitId);
    if (!commit) return;

    setFiles(prev =>
      prev.map(f => {
        if (commit.files[f.path] !== undefined) {
          return {
            ...f,
            content: commit.files[f.path],
            originalContent: commit.files[f.path],
            gitStatus: 'unmodified',
          };
        }
        return f;
      })
    );
    setRunTrigger(t => t + 1);
  };

  const handleCreateBranch = (branchName: string) => {
    const newBranch: GitBranch = {
      name: branchName,
      isCurrent: true,
      commits: [...(branches[0]?.commits || [])],
    };
    setBranches(prev => [...prev, newBranch]);
    setActiveBranch(branchName);
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // F5: Run
      if (e.key === 'F5') {
        e.preventDefault();
        handleRunPreview();
      }
      // F1: Help
      else if (e.key === 'F1') {
        e.preventDefault();
        setIsHelpOpen(true);
      }
      // F2: Rename Paired Tag
      else if (e.key === 'F2') {
        e.preventDefault();
        handleRenamePairedTag();
      }
      // F11: Full Screen
      else if (e.key === 'F11') {
        e.preventDefault();
        setIsFullscreen(f => !f);
      }
      // Ctrl / Cmd Shortcuts
      else if (e.ctrlKey || e.metaKey) {
        if (e.key === 's' || e.key === 'S') {
          e.preventDefault();
          if (e.shiftKey) handleSaveAll();
          else handleSaveFile();
        } else if (e.key === 'p' || e.key === 'P') {
          e.preventDefault();
          setIsCommandPaletteOpen(true);
        } else if (e.key === 'f' || e.key === 'F') {
          if (e.shiftKey) {
            e.preventDefault();
            setActiveBottomTab('search');
          } else {
            e.preventDefault();
            setFindMode('find');
            setIsFindReplaceOpen(true);
          }
        } else if (e.key === 'h' || e.key === 'H') {
          e.preventDefault();
          setFindMode('replace');
          setIsFindReplaceOpen(true);
        } else if (e.key === 'n' || e.key === 'N') {
          e.preventDefault();
          handleCreateFile(`untitled_${files.length + 1}.html`, 'html');
        } else if (e.key === 'o' || e.key === 'O') {
          e.preventDefault();
          handleImportFileClick();
        } else if (e.key === 'w' || e.key === 'W') {
          e.preventDefault();
          if (activeFileId) handleCloseTab(activeFileId);
        } else if (e.key === 'e' || e.key === 'E') {
          e.preventDefault();
          handleExpandEmmet();
        } else if (e.key === '+' || e.key === '=') {
          e.preventDefault();
          setSettings(s => ({ ...s, fontSize: Math.min(26, s.fontSize + 1) }));
        } else if (e.key === '-') {
          e.preventDefault();
          setSettings(s => ({ ...s, fontSize: Math.max(10, s.fontSize - 1) }));
        } else if (e.key === '0') {
          e.preventDefault();
          setSettings(s => ({ ...s, fontSize: 14 }));
        }
      } else if (e.altKey) {
        if (e.key === 'z' || e.key === 'Z') {
          e.preventDefault();
          setSettings(s => ({ ...s, wordWrap: !s.wordWrap }));
        } else if (e.key === 'p' || e.key === 'P') {
          e.preventDefault();
          setIsSplitActive(prev => !prev);
        } else if (e.key === 'c' || e.key === 'C') {
          e.preventDefault();
          setActiveBottomTab(prev => (prev === 'console' ? null : 'console'));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeFile, files, activeFileId, settings]);

  return (
    <div 
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={`h-screen w-screen flex flex-col overflow-hidden bg-white select-none ${
        isFullscreen ? 'fixed inset-0 z-50' : ''
      }`}
    >
      {/* Hidden file importer input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".html,.htm,.css,.js,.zip"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* TOP MENU BAR - Classic Notepad++ */}
      <MenuBar
        onNewFile={() => handleCreateFile(`untitled_${files.length + 1}.html`, 'html')}
        onOpenFile={handleImportFileClick}
        onSaveFile={handleSaveFile}
        onSaveAll={handleSaveAll}
        onExportZip={handleExportZip}
        onImportFile={handleImportFileClick}
        onUndo={() => {}}
        onRedo={() => {}}
        onCut={() => {}}
        onCopy={() => {}}
        onPaste={() => {}}
        onSelectAll={() => {}}
        onFormat={handleFormatCode}
        onExpandEmmet={handleExpandEmmet}
        onToggleComment={() => {}}
        onRenamePairedTag={handleRenamePairedTag}
        onFind={() => { setFindMode('find'); setIsFindReplaceOpen(true); }}
        onReplace={() => { setFindMode('replace'); setIsFindReplaceOpen(true); }}
        onFindInFiles={() => setActiveBottomTab('search')}
        onToggleSplit={() => setIsSplitActive(!isSplitActive)}
        onToggleWordWrap={() => setSettings(s => ({ ...s, wordWrap: !s.wordWrap }))}
        onZoomIn={() => setSettings(s => ({ ...s, fontSize: Math.min(26, s.fontSize + 1) }))}
        onZoomOut={() => setSettings(s => ({ ...s, fontSize: Math.max(10, s.fontSize - 1) }))}
        onResetZoom={() => setSettings(s => ({ ...s, fontSize: 14 }))}
        onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
        onOpenConsole={() => setActiveBottomTab(prev => prev === 'console' ? null : 'console')}
        onOpenProblems={() => setActiveBottomTab(prev => prev === 'problems' ? null : 'problems')}
        onOpenOutline={() => setActiveBottomTab(prev => prev === 'outline' ? null : 'outline')}
        onCloseActiveTab={() => activeFileId && handleCloseTab(activeFileId)}
        onCloseAllTabs={() => { setOpenTabIds([]); setActiveFileId(null); }}
        onRunPreview={handleRunPreview}
        onRunExternal={handleRunExternal}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onSelectSample={handleSelectSample}
        wordWrap={settings.wordWrap}
        isFullscreen={isFullscreen}
      />

      {/* TOOLBAR - Notepad++ Icons */}
      <ToolBar
        onNewFile={() => handleCreateFile(`untitled_${files.length + 1}.html`, 'html')}
        onOpenFile={handleImportFileClick}
        onSaveFile={handleSaveFile}
        onSaveAll={handleSaveAll}
        onCloseActive={() => activeFileId && handleCloseTab(activeFileId)}
        onExportZip={handleExportZip}
        onCut={() => {}}
        onCopy={() => {}}
        onPaste={() => {}}
        onUndo={() => {}}
        onRedo={() => {}}
        onFind={() => { setFindMode('find'); setIsFindReplaceOpen(true); }}
        onReplace={() => { setFindMode('replace'); setIsFindReplaceOpen(true); }}
        onZoomIn={() => setSettings(s => ({ ...s, fontSize: Math.min(26, s.fontSize + 1) }))}
        onZoomOut={() => setSettings(s => ({ ...s, fontSize: Math.max(10, s.fontSize - 1) }))}
        onToggleWordWrap={() => setSettings(s => ({ ...s, wordWrap: !s.wordWrap }))}
        onFormat={handleFormatCode}
        onExpandEmmet={handleExpandEmmet}
        onRun={handleRunPreview}
        onToggleSplit={() => setIsSplitActive(!isSplitActive)}
        onOpenConsole={() => setActiveBottomTab(prev => prev === 'console' ? null : 'console')}
        onOpenOutline={() => setActiveBottomTab(prev => prev === 'outline' ? null : 'outline')}
        onOpenProblems={() => setActiveBottomTab(prev => prev === 'problems' ? null : 'problems')}
        wordWrap={settings.wordWrap}
        isSplitActive={isSplitActive}
        problemCount={problems.length}
      />

      {/* MAIN WORKSPACE BODY */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* File Explorer (Desktop or collapsible) */}
        {showExplorer && (
          <div className="hidden md:block h-full">
            <FileExplorer
              files={files}
              activeFileId={activeFileId}
              onSelectFile={handleSelectFile}
              onCreateFile={handleCreateFile}
              onRenameFile={handleRenameFile}
              onDeleteFile={handleDeleteFile}
              onDuplicateFile={handleDuplicateFile}
              onExportZip={handleExportZip}
              onImportFile={handleImportFileClick}
              onSelectSample={handleSelectSample}
            />
          </div>
        )}

        {/* Center: Tabs + Code Editor */}
        <div className={`flex-1 flex flex-col overflow-hidden min-w-0 ${
          mobileView === 'preview' ? 'hidden sm:flex' : 'flex'
        }`}>
          {/* Tab Strip */}
          <TabBar
            files={files}
            openTabIds={openTabIds}
            activeFileId={activeFileId}
            onSelectTab={setActiveFileId}
            onCloseTab={handleCloseTab}
            onNewFile={() => handleCreateFile(`untitled_${files.length + 1}.html`, 'html')}
            onToggleSplit={() => setIsSplitActive(!isSplitActive)}
            isSplitActive={isSplitActive}
            isFullscreen={isFullscreen}
            onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
          />

          {/* CodeMirror Editor Area */}
          <EditorArea
            activeFile={activeFile}
            settings={settings}
            onChangeContent={handleContentChange}
            onCursorChange={handleCursorChange}
            editorRef={editorRef}
          />
        </div>

        {/* Right: Live Preview Panel */}
        {(isSplitActive || mobileView === 'preview') && (
          <div className={`flex-1 flex flex-col overflow-hidden min-w-[320px] ${
            mobileView === 'editor' ? 'hidden md:flex' : 'flex'
          }`}>
            <LivePreview
              files={files}
              activeFileId={activeFileId}
              onConsoleMessage={(msg) => setConsoleLogs(prev => [...prev.slice(-150), msg])}
              runTrigger={runTrigger}
            />
          </div>
        )}
      </div>

      {/* BOTTOM PANEL (Problems, Console, Find in files, Git, Outline) */}
      <BottomPanel
        activeTab={activeBottomTab}
        onTabChange={setActiveBottomTab}
        problems={problems}
        consoleLogs={consoleLogs}
        onClearConsole={() => setConsoleLogs([])}
        onJumpToLine={handleJumpToLine}
        branches={branches}
        activeBranch={activeBranch}
        onCommit={handleCommit}
        onCheckoutCommit={handleCheckoutCommit}
        onCreateBranch={handleCreateBranch}
        outlineItems={outlineItems}
        files={files}
        onSelectFile={handleSelectFile}
      />

      {/* MOBILE QUICK BAR */}
      <MobileQuickBar
        onInsertChar={handleInsertChar}
        onExpandEmmet={handleExpandEmmet}
        onRunPreview={handleRunPreview}
        activeView={mobileView}
        onToggleView={() => setMobileView(v => v === 'editor' ? 'preview' : 'editor')}
        isFullscreen={isFullscreen}
        onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
      />

      {/* STATUS BAR - Classic Notepad++ signature bar */}
      <StatusBar
        line={cursorPos.line}
        col={cursorPos.col}
        selLength={cursorPos.selLength}
        totalLines={cursorPos.totalLines}
        totalLength={cursorPos.length}
        encoding="UTF-8"
        gitBranch={activeBranch}
        isAutoSaved={true}
      />

      {/* MODALS */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        files={files}
        onSelectFile={handleSelectFile}
        onExecuteAction={(act) => {
          if (act === 'run') handleRunPreview();
          else if (act === 'save') handleSaveFile();
          else if (act === 'format') handleFormatCode();
          else if (act === 'emmet') handleExpandEmmet();
          else if (act === 'split') setIsSplitActive(s => !s);
          else if (act === 'settings') setIsSettingsOpen(true);
          else if (act === 'help') setIsHelpOpen(true);
        }}
      />

      <FindReplaceModal
        isOpen={isFindReplaceOpen}
        onClose={() => setIsFindReplaceOpen(false)}
        activeContent={activeFile?.content || ''}
        onApplyContent={handleContentChange}
        initialMode={findMode}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={(newS) => setSettings(prev => ({ ...prev, ...newS }))}
        onResetDefaults={() => setSettings(DEFAULT_SETTINGS)}
      />

      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
}
