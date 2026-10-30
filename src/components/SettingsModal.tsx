import React from 'react';
import { EditorSettings, EditorTheme } from '../types';
import { Settings, X, Check } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: EditorSettings;
  onUpdateSettings: (newSettings: Partial<EditorSettings>) => void;
  onResetDefaults: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetDefaults,
}) => {
  if (!isOpen) return null;

  const themes: { id: EditorTheme; label: string; previewBg: string }[] = [
    { id: 'notepad-classic', label: 'Notepad++ Classic (Crisp White)', previewBg: '#ffffff' },
    { id: 'modern-light', label: 'Modern Clean Light', previewBg: '#f8fafc' },
    { id: 'solarized-light', label: 'Solarized Light', previewBg: '#fdf6e3' },
    { id: 'dark-mode', label: 'Notepad++ Dark Slate', previewBg: '#1e293b' },
    { id: 'monokai', label: 'Monokai Pro', previewBg: '#272822' },
  ];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-[#f0f0f0] border border-[#a0a0a0] rounded-xs shadow-2xl w-full max-w-lg p-5 select-none text-xs text-gray-800">
        {/* Title Bar */}
        <div className="flex items-center justify-between pb-2 mb-4 border-b border-gray-300">
          <div className="flex items-center gap-2 font-bold text-sm text-gray-800">
            <Settings size={16} className="text-gray-700" />
            <span>Preferences & Settings</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded text-gray-600">
            <X size={15} />
          </button>
        </div>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {/* Theme Selector */}
          <div>
            <label className="font-bold text-gray-700 block mb-1.5">Editor Theme</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {themes.map(t => (
                <button
                  key={t.id}
                  onClick={() => onUpdateSettings({ theme: t.id })}
                  className={`p-2.5 rounded border text-left flex items-center justify-between transition-colors ${
                    settings.theme === t.id
                      ? 'border-blue-600 bg-blue-50/70 font-semibold text-blue-900 ring-1 ring-blue-500'
                      : 'border-gray-300 bg-white hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      style={{ backgroundColor: t.previewBg }}
                      className="w-4 h-4 rounded-xs border border-gray-400 shrink-0 shadow-xs"
                    />
                    <span>{t.label}</span>
                  </div>
                  {settings.theme === t.id && <Check size={14} className="text-blue-600 shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Typography */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Font Size ({settings.fontSize}px)</label>
              <input
                type="range"
                min={11}
                max={24}
                value={settings.fontSize}
                onChange={e => onUpdateSettings({ fontSize: parseInt(e.target.value, 10) })}
                className="w-full accent-blue-600"
              />
            </div>
            <div>
              <label className="font-bold text-gray-700 block mb-1">Tab Size</label>
              <select
                value={settings.tabSize}
                onChange={e => onUpdateSettings({ tabSize: parseInt(e.target.value, 10) })}
                className="w-full bg-white border border-gray-300 rounded px-2 py-1.5 outline-none"
              >
                <option value={2}>2 spaces</option>
                <option value={4}>4 spaces</option>
              </select>
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-2.5 pt-2 border-t border-gray-300">
            <span className="font-bold text-gray-700 block">Editor Assistance</span>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoCloseTags}
                onChange={e => onUpdateSettings({ autoCloseTags: e.target.checked })}
                className="rounded accent-blue-600"
              />
              <div>
                <span className="font-medium text-gray-800">Auto-close HTML tags</span>
                <p className="text-[11px] text-gray-500">Automatically inserts matching &lt;/tag&gt; when typing</p>
              </div>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emmetEnabled}
                onChange={e => onUpdateSettings({ emmetEnabled: e.target.checked })}
                className="rounded accent-blue-600"
              />
              <div>
                <span className="font-medium text-gray-800">Emmet abbreviation expansion</span>
                <p className="text-[11px] text-gray-500">Expands abbreviations (e.g. div.box&gt;p*2) on Tab or Ctrl+E</p>
              </div>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.wordWrap}
                onChange={e => onUpdateSettings({ wordWrap: e.target.checked })}
                className="rounded accent-blue-600"
              />
              <div>
                <span className="font-medium text-gray-800">Word Wrap</span>
                <p className="text-[11px] text-gray-500">Wrap long lines to fit within editor width</p>
              </div>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.liveReload}
                onChange={e => onUpdateSettings({ liveReload: e.target.checked })}
                className="rounded accent-blue-600"
              />
              <div>
                <span className="font-medium text-gray-800">Live Reload while typing</span>
                <p className="text-[11px] text-gray-500">Automatically updates live preview as code is modified</p>
              </div>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoSave}
                onChange={e => onUpdateSettings({ autoSave: e.target.checked })}
                className="rounded accent-blue-600"
              />
              <div>
                <span className="font-medium text-gray-800">Auto-save in LocalDB</span>
                <p className="text-[11px] text-gray-500">Persists changes into browser IndexedDB / localStorage</p>
              </div>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-300">
          <button
            onClick={onResetDefaults}
            className="text-gray-500 hover:text-red-600 text-xs"
          >
            Reset to Defaults
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xs shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
