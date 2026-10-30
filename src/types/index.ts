export type FileType = 'html' | 'css' | 'js' | 'json' | 'md' | 'txt';

export interface ProjectFile {
  id: string;
  name: string;
  path: string; // e.g. "/index.html", "/css/style.css"
  content: string;
  type: FileType;
  isFolder?: boolean;
  parentId?: string | null;
  gitStatus?: 'unmodified' | 'modified' | 'added' | 'deleted';
  originalContent?: string; // For git diff
}

export interface TabItem {
  fileId: string;
  isDirty?: boolean;
}

export interface Problem {
  id: string;
  fileId: string;
  fileName: string;
  line: number;
  col: number;
  message: string;
  severity: 'error' | 'warning' | 'info';
  source: 'html-parser' | 'css-lint' | 'js-syntax';
}

export interface ConsoleMessage {
  id: string;
  type: 'log' | 'info' | 'warn' | 'error';
  content: string;
  timestamp: string;
  count?: number;
}

export interface GitCommit {
  id: string;
  hash: string;
  message: string;
  timestamp: string;
  author: string;
  files: { [path: string]: string }; // Snapshot of files
}

export interface GitBranch {
  name: string;
  isCurrent: boolean;
  commits: GitCommit[];
}

export interface OutlineItem {
  id: string;
  label: string;
  type: 'tag' | 'id' | 'class' | 'heading';
  line: number;
  level?: number;
}

export type EditorTheme = 'notepad-classic' | 'modern-light' | 'dark-mode' | 'monokai' | 'solarized-light';

export interface EditorSettings {
  theme: EditorTheme;
  fontSize: number;
  fontFamily: string;
  tabSize: number;
  wordWrap: boolean;
  autoSave: boolean;
  autoSaveDelay: number;
  liveReload: boolean;
  liveReloadDelay: number;
  autoCloseTags: boolean;
  showLineNumbers: boolean;
  showMinimap: boolean;
  formatOnSave: boolean;
  emmetEnabled: boolean;
}

export type PreviewDevice = 'desktop' | 'tablet' | 'mobile' | 'responsive';

export type ActiveBottomTab = 'problems' | 'console' | 'terminal' | 'search' | 'git' | 'outline' | null;

export interface SearchResultItem {
  fileId: string;
  filePath: string;
  fileName: string;
  line: number;
  lineText: string;
  matchIndex: number;
  matchLength: number;
}
