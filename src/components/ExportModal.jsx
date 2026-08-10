import React from 'react';
import { Loader2 } from 'lucide-react';

export default function ExportModal({ isExporting, exportProgress, activePreset }) {
  if (!isExporting) return null;

  // Extract numeric progress (e.g., "Rendering screen 3 of 11...")
  const match = exportProgress?.match(/(\d+)\s+of\s+(\d+)/i);
  const current = match ? match[1] : null;
  const total = match ? match[2] : null;

  const progressPercent = current && total ? (parseInt(current, 10) / parseInt(total, 10)) * 100 : null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none animate-fade-in">
      <div className="w-full max-w-xs bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl flex flex-col items-center text-center">
        {/* Loading Indicator */}
        <div className="mb-4 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>

        {/* Title */}
        <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
          Exporting Store Assets
        </h3>

        {/* Large Counter in Center */}
        {current && total ? (
          <div className="text-4xl font-bold text-white tracking-tight mb-2 flex items-baseline justify-center gap-1">
            <span>{current}</span>
            <span className="text-zinc-500 text-xl font-normal">/ {total}</span>
          </div>
        ) : (
          <div className="text-sm font-medium text-zinc-200 mb-2">
            {exportProgress || 'Processing...'}
          </div>
        )}

        {/* Progress Bar (Base Colors Only) */}
        {progressPercent !== null && (
          <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}

        {/* Footer Preset Subtext */}
        {activePreset?.name && (
          <p className="text-xs text-zinc-500 mt-4 font-mono">
            {activePreset.name}
          </p>
        )}
      </div>
    </div>
  );
}

