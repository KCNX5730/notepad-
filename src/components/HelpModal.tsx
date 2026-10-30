import React, { useState } from 'react';
import { HelpCircle, X, Keyboard, Sparkles, BookOpen, Info } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'shortcuts' | 'emmet' | 'manual' | 'about'>('shortcuts');

  if (!isOpen) return null;

  const shortcuts = [
    { key: 'F5', desc: 'Run / Reload live preview' },
    { key: 'Ctrl + S', desc: 'Save active file to LocalDB' },
    { key: 'Ctrl + Shift + S', desc: 'Save all files' },
    { key: 'Ctrl + N', desc: 'Create new file' },
    { key: 'Ctrl + O', desc: 'Open file picker' },
    { key: 'Ctrl + W', desc: 'Close active tab' },
    { key: 'Ctrl + F', desc: 'Find in active file' },
    { key: 'Ctrl + H', desc: 'Replace in active file' },
    { key: 'Ctrl + Shift + F', desc: 'Find in files (Project-wide)' },
    { key: 'Ctrl + P', desc: 'Command Palette & quick file jump' },
    { key: 'Alt + Shift + F', desc: 'Auto-format HTML, CSS, or JS' },
    { key: 'Tab / Ctrl + E', desc: 'Expand Emmet abbreviation' },
    { key: 'F2', desc: 'Rename matching paired HTML tag' },
    { key: 'Alt + Z', desc: 'Toggle Word Wrap' },
    { key: 'Alt + P', desc: 'Toggle Live Preview split' },
    { key: 'Alt + C', desc: 'Toggle JavaScript Console & Terminal' },
    { key: 'F11', desc: 'Toggle Full Screen mode' },
  ];

  const emmetExamples = [
    { abbr: '!', result: 'Full HTML5 boilerplate document' },
    { abbr: 'div.hero>h1+p+button.btn', result: '<div class="hero"><h1></h1><p></p><button class="btn"></button></div>' },
    { abbr: 'ul>li*4>a{Item $}', result: 'An unordered list with 4 numbered links Item 1 to 4' },
    { abbr: 'table>tr*3>td*3', result: 'A 3x3 table with 3 rows and 3 table cells each' },
    { abbr: 'form:post>input:text+input:submit', result: '<form method="post"><input type="text"><input type="submit"></form>' },
    { abbr: 'header#main-nav>nav>ul>li*3', result: '<header id="main-nav"><nav><ul><li>...</li></ul></nav></header>' },
    { abbr: 'link:css', result: '<link rel="stylesheet" href="style.css">' },
    { abbr: 'script:src', result: '<script src="app.js"></script>' },
  ];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-[#f0f0f0] border border-[#a0a0a0] rounded-xs shadow-2xl w-full max-w-2xl p-5 select-none text-xs text-gray-800 flex flex-col max-h-[85vh]">
        {/* Title Bar */}
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-gray-300">
          <div className="flex items-center gap-2 font-bold text-sm text-gray-800">
            <HelpCircle size={16} className="text-emerald-600" />
            <span>Notepad++ HTML Studio - Help & Reference</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded text-gray-600">
            <X size={15} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center border-b border-gray-300 mb-3 bg-[#e8e8e8] rounded-t">
          <button
            onClick={() => setActiveTab('shortcuts')}
            className={`px-3 py-1.5 flex items-center gap-1.5 font-medium border-b-2 transition-colors ${
              activeTab === 'shortcuts'
                ? 'border-blue-600 text-blue-900 bg-white'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Keyboard size={13} />
            <span>Keyboard Shortcuts</span>
          </button>
          <button
            onClick={() => setActiveTab('emmet')}
            className={`px-3 py-1.5 flex items-center gap-1.5 font-medium border-b-2 transition-colors ${
              activeTab === 'emmet'
                ? 'border-blue-600 text-blue-900 bg-white'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Sparkles size={13} />
            <span>Emmet Syntax</span>
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`px-3 py-1.5 flex items-center gap-1.5 font-medium border-b-2 transition-colors ${
              activeTab === 'manual'
                ? 'border-blue-600 text-blue-900 bg-white'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <BookOpen size={13} />
            <span>User Manual</span>
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`px-3 py-1.5 flex items-center gap-1.5 font-medium border-b-2 transition-colors ${
              activeTab === 'about'
                ? 'border-blue-600 text-blue-900 bg-white'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Info size={13} />
            <span>About</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto pr-1">
          {activeTab === 'shortcuts' && (
            <div className="space-y-1">
              <p className="text-gray-500 mb-2">Essential keyboard shortcuts to code quickly:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {shortcuts.map((sc, i) => (
                  <div key={i} className="p-2 bg-white rounded border border-gray-200 flex items-center justify-between">
                    <span className="text-gray-700">{sc.desc}</span>
                    <kbd className="bg-gray-100 border border-gray-300 px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold text-gray-800">
                      {sc.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'emmet' && (
            <div className="space-y-3">
              <p className="text-gray-600">
                Type an abbreviation and hit <kbd className="bg-gray-200 px-1.5 py-0.5 rounded font-mono">Tab</kbd> or click <strong>Emmet</strong> in the toolbar:
              </p>
              <div className="space-y-2">
                {emmetExamples.map((ex, i) => (
                  <div key={i} className="p-2.5 bg-white border border-gray-200 rounded">
                    <div className="flex items-center justify-between mb-1">
                      <code className="text-blue-700 font-bold bg-blue-50 px-1.5 py-0.5 rounded text-xs">
                        {ex.abbr}
                      </code>
                      <span className="text-gray-400 text-[10px]">Press Tab</span>
                    </div>
                    <div className="text-gray-600 text-[11px] font-mono break-all bg-gray-50 p-1.5 rounded border border-gray-100">
                      {ex.result}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'manual' && (
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <h3 className="font-bold text-sm text-gray-900">How to use Notepad++ HTML Studio:</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  <strong>Multi-Tab Editing:</strong> Open multiple files simultaneously. Switch tabs with a click or keyboard shortcuts. Files with unsaved changes display a red floppy disk icon.
                </li>
                <li>
                  <strong>Live Preview & Device Emulator:</strong> Preview your code in real time side-by-side or on mobile, tablet, and desktop views with responsive scaling.
                </li>
                <li>
                  <strong>LocalDB Persistence:</strong> Everything is automatically persisted in your local browser storage. No cloud account required.
                </li>
                <li>
                  <strong>Integrated JavaScript Console:</strong> Open the bottom drawer to inspect <code className="bg-gray-100 px-1 rounded">console.log</code> output or evaluate custom JavaScript code in real time.
                </li>
                <li>
                  <strong>Export / Import:</strong> Download your entire project as a clean <code className="bg-gray-100 px-1 rounded">.zip</code> archive or single HTML file ready to publish anywhere.
                </li>
              </ol>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 bg-emerald-600 text-white rounded-lg mx-auto flex items-center justify-center font-bold text-2xl shadow-md">
                N
              </div>
              <h2 className="text-base font-bold text-gray-900">Notepad++ HTML Studio & Web Designer</h2>
              <p className="text-gray-600 max-w-md mx-auto text-xs">
                A lightweight, blazing-fast web IDE inspired by classic Notepad++ and Notepad with white canvas, complete multi-level menus, live preview, Emmet, and LocalDB persistence.
              </p>
              <div className="text-gray-400 text-[10px] pt-4">
                Version 3.4.0 • Built for Web, Tablet, and Mobile
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 mt-3 border-t border-gray-300 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xs shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
