import React from 'react';
import { DEVICE_TYPES } from '../../constants/dimensions';
import { Upload, Smartphone, Sun, Box, Crop } from 'lucide-react';
import { Slider } from '../ui/slider';
import { Switch } from '../ui/switch';

export default function DeviceTab({
  deviceType,
  onChangeDeviceType,
  deviceColor,
  onChangeDeviceColor,
  scale,
  onChangeScale,
  offsetY,
  onChangeOffsetY,
  rotation,
  onChangeRotation,
  perspectiveTilt = 'flat',
  onChangePerspectiveTilt,
  cropMode = 'full',
  onChangeCropMode,
  shadowStrength,
  onChangeShadowStrength,
  showReflection,
  onToggleReflection,
  onImageUpload,
  imageSrc
}) {
  const currentDeviceConfig = DEVICE_TYPES.find(d => d.id === deviceType) || DEVICE_TYPES[0];

  return (
    <div className="space-y-6">
      {/* Screenshot Upload Box */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
          <span>Captura de Tela do App</span>
          {imageSrc && (
            <span className="text-[10px] text-emerald-400 font-normal">✔ Carregado</span>
          )}
        </label>
        <div className="relative group">
          <input
            type="file"
            accept="image/*"
            onChange={onImageUpload}
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
          />
          <div className="p-4 rounded-xl border-2 border-dashed border-zinc-700 group-hover:border-indigo-500 bg-zinc-900 group-hover:bg-indigo-950/20 text-center transition flex flex-col items-center justify-center gap-2">
            <Upload className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition" />
            <div className="text-xs font-semibold text-white">
              {imageSrc ? 'Trocar Imagem do App' : 'Clique ou arraste a captura de tela'}
            </div>
            <div className="text-[10px] text-slate-400">Suporta PNG, JPG, WebP</div>
          </div>
        </div>
      </div>

      {/* Device Model Selector */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-200">Modelo do Dispositivo</label>
        <div className="grid grid-cols-2 gap-2">
          {DEVICE_TYPES.map((dev) => (
            <button
              key={dev.id}
              onClick={() => {
                onChangeDeviceType(dev.id);
                onChangeDeviceColor(dev.colors[0].id);
              }}
              className={`p-2.5 rounded-xl border text-left text-xs transition font-semibold flex items-center gap-2 ${
                deviceType === dev.id
                  ? 'bg-indigo-600/20 border-indigo-500 text-white'
                  : 'bg-zinc-900 border-zinc-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-4 h-4 text-indigo-400 shrink-0" />
              <span className="truncate">{dev.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3D Perspective Tilt Selector */}
      <div className="space-y-2 pt-2 border-t border-zinc-800">
        <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
          <Box className="w-3.5 h-3.5 text-indigo-400" />
          <span>Ângulo e Perspectiva 3D</span>
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { id: 'flat', label: 'Frontal Reto' },
            { id: 'iso-left', label: 'Isométrico Esquerda' },
            { id: 'iso-right', label: 'Isométrico Direita' },
            { id: 'floating', label: '3D Flutuante' }
          ].map((tilt) => (
            <button
              key={tilt.id}
              onClick={() => onChangePerspectiveTilt(tilt.id)}
              className={`p-2 rounded-xl text-xs font-semibold text-center border transition ${
                perspectiveTilt === tilt.id
                  ? 'bg-indigo-600 border-indigo-500 text-white'
                  : 'bg-zinc-900 border-zinc-800 text-slate-400 hover:text-white'
              }`}
            >
              {tilt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Crop / Layout Cut Mode */}
      <div className="space-y-2 pt-2 border-t border-zinc-800">
        <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
          <Crop className="w-3.5 h-3.5 text-indigo-400" />
          <span>Layout do Aparelho na Tela</span>
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { id: 'full', label: 'Celular Completo' },
            { id: 'cropped-bottom', label: 'Cortado Embaixo' }
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => onChangeCropMode(mode.id)}
              className={`p-2 rounded-xl text-xs font-semibold text-center border transition ${
                cropMode === mode.id
                  ? 'bg-indigo-600 border-indigo-500 text-white'
                  : 'bg-zinc-900 border-zinc-800 text-slate-400 hover:text-white'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Device Bezel Color Selector */}
      <div className="space-y-2 pt-2 border-t border-zinc-800">
        <label className="text-xs font-bold text-slate-200">Acabamento do Titânio / Cor</label>
        <div className="flex items-center gap-2.5 flex-wrap">
          {currentDeviceConfig.colors.map((c) => {
            const isSelected = deviceColor === c.id;
            return (
              <button
                key={c.id}
                onClick={() => onChangeDeviceColor(c.id)}
                title={c.name}
                className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${
                  isSelected ? 'border-indigo-400 scale-110 ring-2 ring-indigo-500/40' : 'border-slate-700 hover:scale-105'
                }`}
                style={{ backgroundColor: c.body }}
              >
                {isSelected && <span className="w-2 h-2 rounded-full bg-white"></span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Radix Sliders */}
      <div className="space-y-4 pt-2 border-t border-zinc-800">
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-300 font-medium">
            <span>Tamanho / Escala</span>
            <span className="font-mono text-indigo-400">{scale}%</span>
          </div>
          <Slider
            min={60}
            max={140}
            step={1}
            value={[scale]}
            onValueChange={([val]) => onChangeScale(val)}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-300 font-medium">
            <span>Posição Vertical (Offset Y)</span>
            <span className="font-mono text-indigo-400">{offsetY}px</span>
          </div>
          <Slider
            min={-180}
            max={180}
            step={1}
            value={[offsetY]}
            onValueChange={([val]) => onChangeOffsetY(val)}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-300 font-medium">
            <span>Rotação 2D</span>
            <span className="font-mono text-indigo-400">{rotation}°</span>
          </div>
          <Slider
            min={-30}
            max={30}
            step={1}
            value={[rotation]}
            onValueChange={([val]) => onChangeRotation(val)}
          />
        </div>
      </div>

      {/* Shadow Strength & Reflection Switch */}
      <div className="space-y-3 pt-2 border-t border-zinc-800">
        <label className="text-xs font-bold text-slate-200">Intensidade de Sombra</label>
        <div className="grid grid-cols-3 gap-1.5">
          {['none', 'soft', 'deep', 'heavy', 'glow'].map((s) => (
            <button
              key={s}
              onClick={() => onChangeShadowStrength(s)}
              className={`py-1.5 text-[11px] font-semibold rounded-lg capitalize border transition ${
                shadowStrength === s
                  ? 'bg-indigo-600 border-indigo-500 text-white'
                  : 'bg-zinc-900 border-zinc-800 text-slate-400 hover:text-white'
              }`}
            >
              {s === 'none' ? 'Sem sombra' : s === 'glow' ? 'Glow Neon' : s}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800 mt-2">
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold text-slate-200">Reflexo de Vidro na Tela</span>
          </div>
          <Switch
            checked={showReflection}
            onCheckedChange={onToggleReflection}
          />
        </div>
      </div>
    </div>
  );
}
