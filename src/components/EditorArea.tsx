import React, { useRef, useMemo, useCallback } from 'react';
import CodeMirror, { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { EditorView, ViewUpdate, lineNumbers, gutter, GutterMarker } from '@codemirror/view';
import { ProjectFile, EditorSettings } from '../types';
import { getEditorThemeExtension } from '../utils/editorTheme';
import { calculateChangedLines } from '../utils/git';

interface EditorAreaProps {
  activeFile: ProjectFile | null;
  settings: EditorSettings;
  onChangeContent: (content: string) => void;
  onCursorChange: (line: number, col: number, selLength: number, totalLines: number, length: number) => void;
  editorRef: React.RefObject<ReactCodeMirrorRef | null>;
}

export const EditorArea: React.FC<EditorAreaProps> = ({
  activeFile,
  settings,
  onChangeContent,
  onCursorChange,
  editorRef,
}) => {
  // Determine language extension
  const languageExtension = useMemo(() => {
    if (!activeFile) return html({ autoCloseTags: settings.autoCloseTags });
    switch (activeFile.type) {
      case 'css':
        return css();
      case 'js':
        return javascript();
      case 'html':
      default:
        return html({
          autoCloseTags: settings.autoCloseTags,
          matchClosingTags: true,
        });
    }
  }, [activeFile?.type, settings.autoCloseTags]);

  // Changed lines diff marker in gutter
  const changedLines = useMemo(() => {
    if (!activeFile) return { added: new Set<number>(), modified: new Set<number>() };
    return calculateChangedLines(activeFile.content, activeFile.originalContent);
  }, [activeFile?.content, activeFile?.originalContent]);

  // Custom gutter extension for Git diff changes
  const gitGutterExtension = useMemo(() => {
    class DiffMarker extends GutterMarker {
      constructor(private type: 'added' | 'modified') {
        super();
      }
      toDOM() {
        const el = document.createElement('div');
        el.className = `w-1 h-full ${
          this.type === 'added' ? 'bg-emerald-500' : 'bg-blue-500'
        }`;
        return el;
      }
    }

    return gutter({
      class: 'cm-git-diff-gutter w-1.5 min-w-[6px] bg-transparent',
      lineMarker: (view, line) => {
        const lineNum = view.state.doc.lineAt(line.from).number;
        if (changedLines.added.has(lineNum)) {
          return new DiffMarker('added');
        }
        if (changedLines.modified.has(lineNum)) {
          return new DiffMarker('modified');
        }
        return null;
      },
    });
  }, [changedLines]);

  // Theme extensions
  const themeExtensions = useMemo(() => {
    return getEditorThemeExtension(settings.theme, settings.fontSize, settings.fontFamily);
  }, [settings.theme, settings.fontSize, settings.fontFamily]);

  const handleUpdate = useCallback(
    (update: ViewUpdate) => {
      if (update.selectionSet || update.docChanged) {
        const state = update.state;
        const main = state.selection.main;
        const line = state.doc.lineAt(main.head);
        const col = main.head - line.from + 1;
        const selLength = Math.abs(main.head - main.anchor);
        const totalLines = state.doc.lines;
        const length = state.doc.length;

        onCursorChange(line.number, col, selLength, totalLines, length);
      }
    },
    [onCursorChange]
  );

  if (!activeFile) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-white text-gray-400 p-8 select-none">
        <div className="text-4xl mb-3">📄</div>
        <div className="text-sm font-medium text-gray-600 mb-1">No File Open</div>
        <div className="text-xs text-gray-400">Select a file from the explorer on the left or press Ctrl+N to create a new file.</div>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full overflow-hidden relative flex flex-col bg-white">
      <CodeMirror
        ref={editorRef}
        value={activeFile.content}
        height="100%"
        className="h-full flex-1 text-left font-mono"
        extensions={[
          languageExtension,
          themeExtensions,
          gitGutterExtension,
          EditorView.lineWrapping,
        ]}
        basicSetup={{
          lineNumbers: settings.showLineNumbers,
          foldGutter: true,
          dropCursor: true,
          allowMultipleSelections: true,
          indentOnInput: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          rectangularSelection: true,
          crosshairCursor: true,
          highlightActiveLine: true,
          highlightSelectionMatches: true,
          closeBracketsKeymap: true,
          defaultKeymap: true,
          searchKeymap: true,
          historyKeymap: true,
          foldKeymap: true,
          completionKeymap: true,
          lintKeymap: true,
        }}
        onChange={onChangeContent}
        onUpdate={handleUpdate}
      />
    </div>
  );
};
