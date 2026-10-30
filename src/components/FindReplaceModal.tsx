import React, { useState } from 'react';
import { Search, Replace, X } from 'lucide-react';

interface FindReplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeContent: string;
  onApplyContent: (newContent: string) => void;
  initialMode?: 'find' | 'replace';
}

export const FindReplaceModal: React.FC<FindReplaceModalProps> = ({
  isOpen,
  onClose,
  activeContent,
  onApplyContent,
  initialMode = 'find',
}) => {
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [matchCase, setMatchCase] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [useRegex, setUseRegex] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  if (!isOpen) return null;

  const buildRegex = (global = true) => {
    let pattern = findText;
    if (!useRegex) {
      pattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    if (wholeWord) {
      pattern = `\\b${pattern}\\b`;
    }
    const flags = (global ? 'g' : '') + (matchCase ? '' : 'i');
    return new RegExp(pattern, flags);
  };

  const handleFindNext = () => {
    if (!findText) return;
    try {
      const regex = buildRegex();
      const matches = activeContent.match(regex);
      const count = matches ? matches.length : 0;
      setStatusMessage(count > 0 ? `Found ${count} occurrences` : 'No matches found');
    } catch (e: any) {
      setStatusMessage(`Regex Error: ${e.message}`);
    }
  };

  const handleReplaceOne = () => {
    if (!findText) return;
    try {
      const regex = buildRegex(false);
      const newContent = activeContent.replace(regex, replaceText);
      if (newContent !== activeContent) {
        onApplyContent(newContent);
        setStatusMessage('Replaced 1 occurrence');
      } else {
        setStatusMessage('No matches to replace');
      }
    } catch (e: any) {
      setStatusMessage(`Regex Error: ${e.message}`);
    }
  };

  const handleReplaceAll = () => {
    if (!findText) return;
    try {
      const regex = buildRegex(true);
      const matches = activeContent.match(regex);
      const count = matches ? matches.length : 0;
      if (count > 0) {
        const newContent = activeContent.replace(regex, replaceText);
        onApplyContent(newContent);
        setStatusMessage(`Replaced all ${count} occurrences`);
      } else {
        setStatusMessage('No matches found to replace');
      }
    } catch (e: any) {
      setStatusMessage(`Regex Error: ${e.message}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-[#f0f0f0] border border-[#a0a0a0] rounded-xs shadow-2xl w-full max-w-md p-4 select-none text-xs text-gray-800">
        {/* Title Bar */}
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-gray-300">
          <div className="flex items-center gap-1.5 font-bold text-gray-800">
            <Search size={14} className="text-blue-600" />
            <span>Notepad++ Find and Replace</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded text-gray-600">
            <X size={14} />
          </button>
        </div>

        {/* Inputs */}
        <div className="space-y-3 mb-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Find what:</label>
            <input
              type="text"
              autoFocus
              value={findText}
              onChange={e => setFindText(e.target.value)}
              className="w-full px-2 py-1.5 bg-white border border-gray-400 rounded-xs text-xs outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Replace with:</label>
            <input
              type="text"
              value={replaceText}
              onChange={e => setReplaceText(e.target.value)}
              className="w-full px-2 py-1.5 bg-white border border-gray-400 rounded-xs text-xs outline-none focus:border-blue-500 font-mono"
            />
          </div>

          {/* Options */}
          <div className="flex flex-wrap gap-4 pt-1">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={matchCase}
                onChange={e => setMatchCase(e.target.checked)}
                className="rounded"
              />
              <span>Match case</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={wholeWord}
                onChange={e => setWholeWord(e.target.checked)}
                className="rounded"
              />
              <span>Match whole word only</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={useRegex}
                onChange={e => setUseRegex(e.target.checked)}
                className="rounded"
              />
              <span>Regular expression</span>
            </label>
          </div>
        </div>

        {/* Status message */}
        {statusMessage && (
          <div className="mb-3 px-2 py-1 bg-blue-50 border border-blue-200 text-blue-800 rounded text-[11px]">
            {statusMessage}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-300">
          <button
            onClick={handleFindNext}
            className="px-3 py-1 bg-white hover:bg-gray-100 border border-gray-400 rounded-xs font-medium"
          >
            Find Next
          </button>
          <button
            onClick={handleReplaceOne}
            className="px-3 py-1 bg-white hover:bg-gray-100 border border-gray-400 rounded-xs font-medium"
          >
            Replace
          </button>
          <button
            onClick={handleReplaceAll}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xs font-bold"
          >
            Replace All
          </button>
        </div>
      </div>
    </div>
  );
};
