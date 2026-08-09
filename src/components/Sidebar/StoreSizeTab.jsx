import React from 'react';
import { STORE_PRESETS } from '../../constants/dimensions';
import { Smartphone, Tablet, Image as ImageIcon, CheckCircle2 } from 'lucide-react';

export default function StoreSizeTab({ activePreset, onSelectPreset }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-bold text-white mb-1">Dimensões da Loja</h3>
        <p className="text-xs text-slate-400">Selecione o tamanho exato de tela exigido pela Apple ou Google.</p>
      </div>

      {/* App Store Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
          Apple App Store (iOS)
        </div>
        <div className="grid grid-cols-1 gap-2.5">
          {STORE_PRESETS.filter(p => p.store.includes('Apple')).map((preset) => {
            const isSelected = activePreset.id === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => onSelectPreset(preset)}
                className={`p-3 rounded-xl border text-left transition flex items-center justify-between group ${
                  isSelected
                    ? 'bg-indigo-600/15 border-indigo-500 text-white shadow-md'
                    : 'bg-slate-800/60 border-slate-700/70 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-700/50 text-slate-400'}`}>
                    {preset.icon === 'Tablet' ? <Tablet className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold">{preset.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{preset.width} × {preset.height} px</div>
                  </div>
                </div>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Google Play Store Section */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          Google Play Store (Android)
        </div>
        <div className="grid grid-cols-1 gap-2.5">
          {STORE_PRESETS.filter(p => p.store.includes('Google')).map((preset) => {
            const isSelected = activePreset.id === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => onSelectPreset(preset)}
                className={`p-3 rounded-xl border text-left transition flex items-center justify-between group ${
                  isSelected
                    ? 'bg-emerald-600/15 border-emerald-500 text-white shadow-md'
                    : 'bg-slate-800/60 border-slate-700/70 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-700/50 text-slate-400'}`}>
                    {preset.icon === 'Image' ? <ImageIcon className="w-4 h-4" /> : preset.icon === 'Tablet' ? <Tablet className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold">{preset.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{preset.width} × {preset.height} px</div>
                  </div>
                </div>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
