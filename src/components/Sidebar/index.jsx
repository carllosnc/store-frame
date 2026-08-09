import React from 'react';
import {
  Upload,
  Palette,
  Type,
  Layout,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react';
import { STORE_PRESETS } from '../../constants/dimensions';
import { Slider } from '../ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

function SectionHeader({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-2 pb-2.5 border-b border-zinc-800">
      <Icon className="w-3.5 h-3.5 text-sky-400 shrink-0" />
      <h2 className="text-xs font-bold uppercase tracking-widest text-sky-300/80">{label}</h2>
    </div>
  );
}

function SliderRow({ label, value, unit, min, max, step, onValueChange }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-xs text-zinc-400">{label}</span>
        <span className="font-mono text-[11px] text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">
          {value}{unit}
        </span>
      </div>
      <Slider min={min} max={max} step={step} value={[value]} onValueChange={([v]) => onValueChange(v)} />
    </div>
  );
}

function ColorPicker({ value, onChange }) {
  return (
    <div className="relative h-8 bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded-lg px-2.5 flex items-center justify-between transition cursor-pointer group focus-within:ring-1 focus-within:ring-white/10">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
      />
      <div
        className="w-4 h-4 rounded border border-white/20 shrink-0"
        style={{ backgroundColor: value }}
      />
      <span className="text-[10px] font-mono text-zinc-500 uppercase">{value}</span>
    </div>
  );
}

export default function Sidebar({ activePreset, onSelectPreset, screenState, onUpdateScreenState }) {
  const currentScreen = screenState || {};
  return (
    <aside className="w-72 bg-zinc-950 border-r border-zinc-800 flex flex-col h-full z-20 shrink-0 select-none overflow-hidden">
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-9 sidebar-scrollbar-transparent">

        {/* 1. FORMATO DA LOJA */}
        <div className="space-y-3">
          <SectionHeader icon={Layout} label="Formato da loja" />
          <Select
            value={activePreset.id}
            onValueChange={(val) => {
              const found = STORE_PRESETS.find(p => p.id === val);
              if (found) onSelectPreset(found);
            }}
          >
            <SelectTrigger className="w-full h-8 text-xs border-zinc-800 bg-zinc-900 text-zinc-300 focus:border-zinc-600 focus:ring-1 focus:ring-white/10">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {STORE_PRESETS.map((p) => (
                <SelectItem key={p.id} value={p.id} className="text-xs">
                  {p.store} — {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 2. IMAGEM DO APLICATIVO */}
        <div className="space-y-3">
          <SectionHeader icon={ImageIcon} label="Imagem do aplicativo" />

          {/* Upload simples — tela ativa */}
          <div className="relative group">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (ev) => onUpdateScreenState('imageSrc', ev.target.result);
                  reader.readAsDataURL(file);
                }
              }}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
            />
            <div className="h-8 rounded-lg border border-dashed border-zinc-700 bg-zinc-900 group-hover:border-zinc-500 transition flex items-center justify-center gap-2">
              <Upload className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition" />
              <span className="text-[11px] text-zinc-400 group-hover:text-white transition">
                {currentScreen.imageSrc ? 'Trocar imagem' : 'Upload Captura de Tela'}
              </span>
            </div>
          </div>

          <SliderRow
            label="Zoom da Imagem Central"
            value={currentScreen.imageZoom !== undefined ? currentScreen.imageZoom : 100}
            unit="%"
            min={80} max={160} step={2}
            onValueChange={(v) => onUpdateScreenState('imageZoom', v)}
          />

          <SliderRow
            label="Arredondamento dos cantos"
            value={currentScreen.cornerRadius !== undefined ? currentScreen.cornerRadius : 36}
            unit="px"
            min={12} max={60} step={2}
            onValueChange={(v) => onUpdateScreenState('cornerRadius', v)}
          />
        </div>

        {/* 3. PLANO DE FUNDO */}
        <div className="space-y-3">
          <SectionHeader icon={Palette} label="Plano de fundo & listras" />

          <ColorPicker
            value={currentScreen.bgColor || '#44C0FE'}
            onChange={(v) => onUpdateScreenState('bgColor', v)}
          />


        </div>

        {/* 4. TEXTO DO TÍTULO */}
        <div className="space-y-3">
          <SectionHeader icon={Type} label="Texto do título" />

          <div className="space-y-1">
            <label className="text-xs text-zinc-500">Nome da Tela</label>
            <input
              type="text"
              value={currentScreen.title || ''}
              onChange={(e) => onUpdateScreenState('title', e.target.value)}
              placeholder="Ex: Tela 1 — Início"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-white/10 transition"
            />
          </div>

          {/* Posição do Texto */}
          <div className="space-y-1">
            <label className="text-xs text-zinc-500">Posição do Texto</label>
            <div className="grid grid-cols-3 gap-1 p-1 bg-zinc-900 rounded-lg border border-zinc-800">
              {[
                { id: 'top', label: 'Em cima' },
                { id: 'bottom', label: 'Em baixo' },
                { id: 'none', label: 'Sem texto' }
              ].map((pos) => {
                const isSelected = (currentScreen.textPosition || 'top') === pos.id;
                return (
                  <button
                    key={pos.id}
                    onClick={() => onUpdateScreenState('textPosition', pos.id)}
                    className={`py-1 text-[11px] font-medium rounded transition ${
                      isSelected
                        ? 'bg-zinc-200 text-zinc-950 font-semibold shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {pos.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-zinc-500">Texto Principal da Arte</label>
            <textarea
              rows={2}
              value={currentScreen.headline || ''}
              onChange={(e) => onUpdateScreenState('headline', e.target.value)}
              placeholder="Ex: Conecte-se com amigos"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-white/10 transition resize-none"
            />
          </div>

          <SliderRow
            label="Tamanho do texto"
            value={currentScreen.headlineSize || 48}
            unit="px"
            min={28} max={68} step={2}
            onValueChange={(v) => onUpdateScreenState('headlineSize', v)}
          />

          {/* Cor do texto + Alinhamento */}
          <div className="grid grid-cols-2 gap-2">
            <ColorPicker
              value={currentScreen.headlineColor || '#000000'}
              onChange={(v) => onUpdateScreenState('headlineColor', v)}
            />

            <div className="h-8 flex items-center justify-between bg-zinc-900 px-1 rounded-lg border border-zinc-800">
              {[
                { id: 'left', icon: AlignLeft },
                { id: 'center', icon: AlignCenter },
                { id: 'right', icon: AlignRight }
              ].map(({ id, icon: Icon }) => {
                const isSelected = (currentScreen.textAlign || 'center') === id;
                return (
                  <button
                    key={id}
                    onClick={() => onUpdateScreenState('textAlign', id)}
                    className={`p-1.5 rounded transition ${
                      isSelected
                        ? 'bg-zinc-200 text-zinc-950 shadow-sm'
                        : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/40'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </aside>
  );
}
