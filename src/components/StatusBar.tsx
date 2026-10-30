import React from 'react';
import { GitBranch as GitIcon, Check, Clock } from 'lucide-react';

interface StatusBarProps {
  line: number;
  col: number;
  selLength: number;
  totalLines: number;
  totalLength: number;
  encoding?: string;
  gitBranch: string;
  isAutoSaved?: boolean;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  line,
  col,
  selLength,
  totalLines,
  totalLength,
  encoding = 'UTF-8',
  gitBranch,
  isAutoSaved = true,
}) => {
  return (
    <div className="bg-[#f0f0f0] border-t border-[#d4d4d4] text-[11px] text-gray-700 select-none flex items-center divide-x divide-[#d4d4d4] h-5.5 shrink-0 px-1 font-sans shadow-inner">
      {/* Git Branch */}
      <div className="px-2.5 flex items-center gap-1 font-medium text-gray-800">
        <GitIcon size={11} className="text-blue-600" />
        <span>{gitBranch}</span>
      </div>

      {/* Auto-save status */}
      <div className="px-2.5 flex items-center gap-1 text-emerald-700">
        <Check size={11} />
        <span className="hidden sm:inline">Saved locally</span>
      </div>

      {/* Length & Lines */}
      <div className="px-2.5 text-gray-600">
        Length : {totalLength.toLocaleString()}
      </div>
      <div className="px-2.5 text-gray-600">
        Lines : {totalLines.toLocaleString()}
      </div>

      {/* Cursor position */}
      <div className="px-2.5 font-semibold text-gray-800">
        Ln : {line} &nbsp; Col : {col}
      </div>

      {/* Selection length */}
      <div className="px-2.5 text-gray-600">
        Sel : {selLength}
      </div>

      <div className="flex-1" />

      {/* Line Feed format */}
      <div className="px-2.5 text-gray-600 hidden md:block">
        Windows (CR LF)
      </div>

      {/* Encoding */}
      <div className="px-2.5 text-gray-800 font-medium">
        {encoding}
      </div>

      {/* Insert / Overwrite mode */}
      <div className="px-2.5 text-gray-700 font-bold">
        INS
      </div>
    </div>
  );
};
