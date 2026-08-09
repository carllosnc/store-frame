import React from 'react';
import { 
  Upload, 
  Palette, 
  Type, 
  Layout, 
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ZoomIn,
  Grid,
  Rows,
  Columns,
  Ban
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

export default function Sidebar({
  activePreset,
  onSelectPreset,
  screenState,
  onUpdateScreenState
}) {
  return (
    <aside className="w-full lg:w-96 bg-[#0E0F14] border-r border-[#1E202B] flex flex-col h-full z-20 shrink-0 select-none overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 pb-12 space-y-8 sidebar-scrollbar-transparent">

        {/* 1. FORMATO DA LOJA */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 pb-2.5 border-b border-[#222430]">
            <Layout className="w-4 h-4 text-sky-400 shrink-0" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-sky-300/90">Formato da loja</h2>
          </div>

          <div className="pt-1">
            <Select
              value={activePreset.id}
              onValueChange={(val) => {
                const found = STORE_PRESETS.find(p => p.id === val);
                if (found) onSelectPreset(found);
              }}
            >
              <SelectTrigger className="w-full h-11 text-xs sm:text-sm border-[#222430] bg-[#14151C] text-zinc-300 font-normal focus:border-zinc-600 focus:ring-1 focus:ring-white/10">
                <SelectValue placeholder="Selecione o formato..." />
              </SelectTrigger>
              <SelectContent>
                {STORE_PRESETS.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.store} — {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 2. UPLOAD DA IMAGEM, ZOOM CENTRAL & CANTOS ARREDONDADOS */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 pb-2.5 border-b border-[#222430]">
            <ImageIcon className="w-4 h-4 text-sky-400 shrink-0" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-sky-300/90">Imagem do aplicativo</h2>
          </div>

          {/* Screenshot Upload Button */}
          <div className="relative group pt-1">
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
            <div className="p-3.5 rounded-xl border border-dashed border-[#2E3140] bg-[#14151C] group-hover:border-zinc-500 text-center transition flex items-center justify-center gap-2.5">
              <Upload className="w-4 h-4 text-zinc-400 group-hover:text-white transition" />
              <span className="text-xs sm:text-sm font-normal text-zinc-300 group-hover:text-white transition">
                {screenState.imageSrc ? 'Trocar Imagem do App' : 'Upload Captura de Tela'}
              </span>
            </div>
          </div>

          {/* Image Zoom Slider */}
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-normal text-zinc-300">
                <ZoomIn className="w-4 h-4 text-zinc-400" />
                <span>Zoom da Imagem Central</span>
              </div>
              <span className="font-mono text-xs font-medium text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                {screenState.imageZoom !== undefined ? screenState.imageZoom : 100}%
              </span>
            </div>
            <Slider
              min={80}
              max={160}
              step={2}
              value={[screenState.imageZoom !== undefined ? screenState.imageZoom : 100]}
              onValueChange={([val]) => onUpdateScreenState('imageZoom', val)}
            />
          </div>

          {/* Corner Radius Slider */}
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm font-normal text-zinc-300">Arredondamento dos cantos</span>
              <span className="font-mono text-xs font-medium text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                {screenState.cornerRadius !== undefined ? screenState.cornerRadius : 36}px
              </span>
            </div>
            <Slider
              min={12}
              max={60}
              step={2}
              value={[screenState.cornerRadius !== undefined ? screenState.cornerRadius : 36]}
              onValueChange={([val]) => onUpdateScreenState('cornerRadius', val)}
            />
          </div>
        </div>

        {/* 3. PLANO DE FUNDO SÓLIDO & EFEITO DE LISTRAS */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 pb-2.5 border-b border-[#222430]">
            <Palette className="w-4 h-4 text-sky-400 shrink-0" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-sky-300/90">Plano de fundo & listras</h2>
          </div>

          {/* Botão de Cor do Fundo Minimalista */}
          <div className="pt-1">
            <div className="relative h-11 w-full bg-[#14151C] border border-[#222430] hover:border-zinc-700 rounded-xl px-4 flex items-center justify-between transition cursor-pointer group focus-within:ring-1 focus-within:ring-white/10 focus-within:border-zinc-600">
              <input
                type="color"
                value={screenState.bgColor || '#44C0FE'}
                onChange={(e) => onUpdateScreenState('bgColor', e.target.value)}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
              />
              
              {/* Amostra de cor limpa */}
              <div 
                className="w-6 h-6 rounded-lg border border-white/20 shadow-sm shrink-0 group-hover:scale-105 transition-transform"
                style={{ backgroundColor: screenState.bgColor || '#44C0FE' }}
              />

              {/* Hex Code */}
              <span className="text-xs font-mono text-zinc-400 uppercase font-medium bg-[#09090B] px-2.5 py-1 rounded-lg border border-[#222430]">
                {screenState.bgColor || '#44C0FE'}
              </span>
            </div>
          </div>

          {/* Efeito de Listras no Fundo */}
          <div className="space-y-3 pt-2">
            <label className="text-xs sm:text-sm font-normal text-zinc-300 block">Efeito de listras no fundo</label>
            <div className="grid grid-cols-4 gap-3">
              {[
                { id: 'none', label: 'Sem Listras', icon: Ban },
                { id: 'diagonal', label: 'Listras Diagonais', icon: Rows },
                { id: 'vertical', label: 'Listras Verticais', icon: Columns },
                { id: 'dots', label: 'Grid de Pontos', icon: Grid }
              ].map((pattern) => {
                const IconComponent = pattern.icon;
                const isSelected = (screenState.bgPattern || 'none') === pattern.id;
                return (
                  <button
                    key={pattern.id}
                    onClick={() => onUpdateScreenState('bgPattern', pattern.id)}
                    title={pattern.label}
                    className={`h-11 rounded-xl border transition flex items-center justify-center ${
                      isSelected
                        ? 'bg-zinc-100 text-zinc-950 border-zinc-100 shadow-md scale-105'
                        : 'bg-[#14151C] border-[#222430] text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 hover:bg-[#1A1C26]'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 4. TEXTO E TÍTULO & NOME DA TELA */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 pb-2.5 border-b border-[#222430]">
            <Type className="w-4 h-4 text-sky-400 shrink-0" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-sky-300/90">Texto do título</h2>
          </div>

          {/* Nome da Tela (Renomear Tela) */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-normal text-zinc-300">Nome da Tela</label>
            <input
              type="text"
              value={screenState.title || ''}
              onChange={(e) => onUpdateScreenState('title', e.target.value)}
              placeholder="Ex: Tela 1 — Início"
              className="w-full bg-[#14151C] border border-[#222430] rounded-xl p-3 text-xs sm:text-sm font-normal text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-white/10 transition"
            />
          </div>

          {/* Texto Principal da Arte */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-normal text-zinc-300">Texto Principal da Arte</label>
            <textarea
              rows={2}
              value={screenState.headline}
              onChange={(e) => onUpdateScreenState('headline', e.target.value)}
              placeholder="Ex: Conecte-se com amigos"
              className="w-full bg-[#14151C] border border-[#222430] rounded-xl p-3.5 text-xs sm:text-sm font-normal text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-white/10 transition resize-none"
            />
          </div>

          {/* Text Size Slider */}
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm font-normal text-zinc-300">Tamanho do texto</span>
              <span className="font-mono text-xs font-medium text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                {screenState.headlineSize || 48}px
              </span>
            </div>
            <Slider
              min={28}
              max={68}
              step={2}
              value={[screenState.headlineSize || 48]}
              onValueChange={([val]) => onUpdateScreenState('headlineSize', val)}
            />
          </div>

          {/* Text Color Picker & Alignment */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="relative h-11 bg-[#14151C] border border-[#222430] hover:border-zinc-700 rounded-xl px-3 flex items-center justify-between transition cursor-pointer group focus-within:ring-1 focus-within:ring-white/10 focus-within:border-zinc-600">
              <input
                type="color"
                value={screenState.headlineColor || '#000000'}
                onChange={(e) => onUpdateScreenState('headlineColor', e.target.value)}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
              />
              
              <div 
                className="w-6 h-6 rounded-lg border border-white/20 shadow-sm shrink-0 group-hover:scale-105 transition-transform" 
                style={{ backgroundColor: screenState.headlineColor || '#000000' }}
              />

              <span className="text-xs font-mono text-zinc-400 uppercase font-medium bg-[#09090B] px-2 py-0.5 rounded-md border border-[#222430]">
                {screenState.headlineColor || '#000000'}
              </span>
            </div>

            {/* Alignment Controls */}
            <div className="h-11 flex items-center justify-between bg-[#14151C] px-1.5 rounded-xl border border-[#222430]">
              {[
                { id: 'left', icon: AlignLeft },
                { id: 'center', icon: AlignCenter },
                { id: 'right', icon: AlignRight }
              ].map((item) => {
                const IconComp = item.icon;
                const isSelected = (screenState.textAlign || 'center') === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onUpdateScreenState('textAlign', item.id)}
                    className={`p-2 rounded-lg transition ${
                      isSelected
                        ? 'bg-zinc-200 text-zinc-950 font-bold shadow-sm'
                        : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/40'
                    }`}
                  >
                    <IconComp className="w-4 h-4" />
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
