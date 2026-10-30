import { EditorView } from '@codemirror/view';
import { Extension } from '@codemirror/state';
import { EditorTheme } from '../types';

export function getEditorThemeExtension(themeName: EditorTheme, fontSize: number, fontFamily: string): Extension {
  const fontStyle = {
    fontFamily: fontFamily || "'Fira Code', 'Consolas', monospace",
    fontSize: `${fontSize}px`,
  };

  switch (themeName) {
    case 'dark-mode':
      return [
        EditorView.theme({
          '&': {
            ...fontStyle,
            color: '#e2e8f0',
            backgroundColor: '#1e293b',
          },
          '.cm-content': {
            caretColor: '#38bdf8',
          },
          '.cm-cursor, .cm-dropCursor': {
            borderLeftColor: '#38bdf8',
            borderLeftWidth: '2px',
          },
          '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
            backgroundColor: '#334155 !important',
          },
          '.cm-gutters': {
            backgroundColor: '#0f172a',
            color: '#64748b',
            borderRight: '1px solid #334155',
          },
          '.cm-activeLine': {
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
          },
          '.cm-activeLineGutter': {
            backgroundColor: '#1e293b',
            color: '#38bdf8',
            fontWeight: 'bold',
          },
        }, { dark: true }),
      ];

    case 'monokai':
      return [
        EditorView.theme({
          '&': {
            ...fontStyle,
            color: '#f8f8f2',
            backgroundColor: '#272822',
          },
          '.cm-content': {
            caretColor: '#f8f8f0',
          },
          '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
            backgroundColor: '#49483e !important',
          },
          '.cm-gutters': {
            backgroundColor: '#1e1f1c',
            color: '#75715e',
            borderRight: '1px solid #3e3d32',
          },
          '.cm-activeLine': {
            backgroundColor: '#3e3d32',
          },
          '.cm-activeLineGutter': {
            backgroundColor: '#2e2e28',
            color: '#a6e22e',
          },
        }, { dark: true }),
      ];

    case 'modern-light':
      return [
        EditorView.theme({
          '&': {
            ...fontStyle,
            color: '#1e293b',
            backgroundColor: '#ffffff',
          },
          '.cm-content': {
            caretColor: '#2563eb',
          },
          '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
            backgroundColor: '#dbeafe !important',
          },
          '.cm-gutters': {
            backgroundColor: '#f8fafc',
            color: '#94a3b8',
            borderRight: '1px solid #e2e8f0',
          },
          '.cm-activeLine': {
            backgroundColor: '#f1f5f9',
          },
          '.cm-activeLineGutter': {
            backgroundColor: '#e2e8f0',
            color: '#0f172a',
            fontWeight: '600',
          },
        }),
      ];

    case 'solarized-light':
      return [
        EditorView.theme({
          '&': {
            ...fontStyle,
            color: '#657b83',
            backgroundColor: '#fdf6e3',
          },
          '.cm-content': {
            caretColor: '#586e75',
          },
          '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
            backgroundColor: '#eee8d5 !important',
          },
          '.cm-gutters': {
            backgroundColor: '#f5efdc',
            color: '#93a1a1',
            borderRight: '1px solid #e0d8c0',
          },
          '.cm-activeLine': {
            backgroundColor: '#faebd7',
          },
          '.cm-activeLineGutter': {
            backgroundColor: '#e8dec2',
            color: '#268bd2',
          },
        }),
      ];

    case 'notepad-classic':
    default:
      // Iconic Notepad++ Classic White Theme
      return [
        EditorView.theme({
          '&': {
            ...fontStyle,
            color: '#000000',
            backgroundColor: '#ffffff',
          },
          '.cm-content': {
            caretColor: '#000000',
            lineHeight: '1.5',
            padding: '4px 0',
          },
          '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
            backgroundColor: '#cce8ff !important',
          },
          '.cm-gutters': {
            backgroundColor: '#e4e4e4',
            color: '#808080',
            borderRight: '1px solid #d4d4d4',
            minWidth: '40px',
          },
          '.cm-lineNumbers .cm-gutterElement': {
            padding: '0 8px 0 6px',
            fontSize: `${Math.max(11, fontSize - 2)}px`,
            fontFamily: 'Consolas, monospace',
          },
          '.cm-activeLine': {
            backgroundColor: '#e8f2fe',
          },
          '.cm-activeLineGutter': {
            backgroundColor: '#d8e4f0',
            color: '#000000',
            fontWeight: 'bold',
          },
          '.cm-matchingBracket': {
            backgroundColor: '#ffb6c1',
            outline: '1px solid #e06c75',
            color: '#b22222 !important',
            fontWeight: 'bold',
          },
        }),
      ];
  }
}
