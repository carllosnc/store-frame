import React from 'react';
import { Sparkles, Layers, CheckCircle2 } from 'lucide-react';

export default function ExportModal({ isExporting, exportProgress, activePreset }) {
  if (!isExporting) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-xl z-50 flex items-center justify-center p-4 select-none animate-fade-in">
      {/* Ambient background glowing orbs */}
      <div className="absolute w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none animate-pulse -top-10 -left-10" />
      <div className="absolute w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none animate-pulse -bottom-10 -right-10" />

      {/* Main Glassmorphic Modal Card */}
      <div className="relative w-full max-w-sm bg-zinc-950/90 border border-zinc-800/90 rounded-3xl p-7 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8),0_0_40px_-10px_rgba(56,189,248,0.25)] flex flex-col items-center text-center overflow-hidden">
        
        {/* Animated Scanner Phone Graphic (Signature Element) */}
        <div className="relative w-24 h-32 mb-6 rounded-2xl bg-zinc-900 border border-zinc-700/80 p-2 shadow-inner overflow-hidden flex flex-col items-center justify-between">
          {/* Active glowing scan beam */}
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-sky-400 to-transparent shadow-[0_0_15px_#38bdf8] animate-scan-beam z-20" />

          {/* Mini app frame mock */}
          <div className="w-full h-full rounded-xl bg-gradient-to-b from-sky-500/20 via-indigo-500/10 to-zinc-900 border border-white/10 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="w-10 h-1 bg-white/20 rounded-full mb-3" />
            <div className="w-12 h-14 rounded-lg bg-sky-400/20 border border-sky-400/30 flex items-center justify-center shadow-lg relative">
              <Sparkles className="w-6 h-6 text-sky-300 animate-spin-slow" />
            </div>
          </div>
        </div>

        {/* Status Eyebrow Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/25 text-[11px] font-bold text-sky-400 uppercase tracking-widest mb-2 shadow-sm">
          <Layers className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
          <span>HD Rendering Engine</span>
        </div>

        {/* Title */}
        <h3 className="text-base font-extrabold text-white tracking-tight">
          Exporting Store Assets
        </h3>

        {/* Dynamic Progress Detail Subtext */}
        <p className="text-xs text-zinc-400 mt-1 font-medium min-h-[20px]">
          {exportProgress || 'Processing high-resolution render...'}
        </p>

        {/* Animated Shimmer Progress Bar */}
        <div className="w-full bg-zinc-900 border border-zinc-800 h-2.5 rounded-full mt-5 overflow-hidden p-0.5 relative">
          <div className="h-full bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-400 rounded-full animate-progress-shimmer w-full transition-all duration-300 shadow-[0_0_12px_rgba(56,189,248,0.5)]" />
        </div>

        {/* Footer Info Metadata */}
        <div className="mt-5 pt-3.5 border-t border-zinc-800/80 w-full flex items-center justify-between text-[11px] font-mono text-zinc-500">
          <span>{activePreset?.name?.split(' ')[0] || 'App Store'}</span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 60 FPS HD
          </span>
        </div>
      </div>
    </div>
  );
}
