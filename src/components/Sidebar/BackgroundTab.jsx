import React from 'react';
import { GRADIENT_PRESETS } from '../../constants/dimensions';
import { Sparkles, Grid, CircleDot, EyeOff, Layers } from 'lucide-react';
import { Switch } from '../ui/switch';
import { Slider } from '../ui/slider';

export default function BackgroundTab({
  bgType,
  onChangeBgType,
  bgColor,
  onChangeBgColor,
  gradientColors,
  onChangeGradientColors,
  gradientAngle,
  onChangeGradientAngle,
  patternOverlay,
  onChangePatternOverlay,
  isPanoramic,
  onTogglePanoramic
}) {
  const handleApplyPreset = (preset) => {
    onChangeBgType(preset.type);
    onChangeGradientColors(preset.colors);
    if (preset.angle !== undefined) onChangeGradientAngle(preset.angle);
  };

  return (
    <div className="space-y-6">
      {/* Continuous Panoramic Mode Switch */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-purple-950/40 border border-indigo-500/30 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Fundo Panorâmico Contínuo</div>
            <div className="text-[10px] text-slate-400">Conecte o fundo de todas as telas em um único fluxo</div>
          </div>
        </div>
        <Switch
          checked={isPanoramic}
          onCheckedChange={onTogglePanoramic}
        />
      </div>

      {/* Background Mode Switcher */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-200">Tipo de Plano de Fundo</label>
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#0E0F14] rounded-xl border border-[#22242A]">
          {[
            { id: 'solid', label: 'Sólido' },
            { id: 'linear', label: 'Gradiente' },
            { id: 'radial', label: 'Radial' }
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => onChangeBgType(mode.id)}
              className={`py-1.5 text-xs font-semibold rounded-lg transition ${
                bgType === mode.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Preset Gradients Grid */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
          <span>Gradientes Pré-configurados</span>
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
        </label>
        <div className="grid grid-cols-4 gap-2">
          {GRADIENT_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleApplyPreset(preset)}
              title={preset.name}
              className="h-12 rounded-xl border border-slate-700/80 hover:scale-105 transition-transform shadow-md overflow-hidden group relative"
              style={{
                background: preset.type === 'radial'
                  ? `radial-gradient(circle, ${preset.colors.join(', ')})`
                  : `linear-gradient(${preset.angle}deg, ${preset.colors.join(', ')})`
              }}
            >
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-[10px] font-bold text-white">
                Usar
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Color Pickers */}
      <div className="space-y-3 pt-2 border-t border-[#22242A]">
        <label className="text-xs font-bold text-slate-200">Cores Customizadas</label>
        {bgType === 'solid' ? (
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={bgColor}
              onChange={(e) => onChangeBgColor(e.target.value)}
              className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
            />
            <input
              type="text"
              value={bgColor}
              onChange={(e) => onChangeBgColor(e.target.value)}
              className="bg-[#14161F] border border-[#22242A] rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none uppercase w-28"
            />
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {gradientColors.map((color, index) => (
                <div key={index} className="flex items-center gap-1 bg-[#14161F] p-1.5 rounded-xl border border-[#22242A]">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => {
                      const updated = [...gradientColors];
                      updated[index] = e.target.value;
                      onChangeGradientColors(updated);
                    }}
                    className="w-7 h-7 rounded-lg bg-transparent border-0 cursor-pointer"
                  />
                  <span className="text-[11px] font-mono text-slate-300 uppercase px-1">{color}</span>
                </div>
              ))}
            </div>

            {bgType === 'linear' && (
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Ângulo do Gradiente</span>
                  <span className="font-mono text-indigo-400">{gradientAngle}°</span>
                </div>
                <Slider
                  min={0}
                  max={360}
                  step={1}
                  value={[gradientAngle]}
                  onValueChange={([val]) => onChangeGradientAngle(val)}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pattern Overlay Option */}
      <div className="space-y-2 pt-2 border-t border-[#22242A]">
        <label className="text-xs font-bold text-slate-200">Textura de Fundo</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'none', label: 'Nenhuma', icon: EyeOff },
            { id: 'grid', label: 'Grade', icon: Grid },
            { id: 'dots', label: 'Pontilhado', icon: CircleDot }
          ].map((pat) => {
            const IconComp = pat.icon;
            return (
              <button
                key={pat.id}
                onClick={() => onChangePatternOverlay(pat.id)}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                  patternOverlay === pat.id
                    ? 'bg-indigo-600 border-indigo-500 text-white'
                    : 'bg-[#14161F] border-[#22242A] text-slate-400 hover:text-white'
                }`}
              >
                <IconComp className="w-3.5 h-3.5" />
                <span>{pat.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
