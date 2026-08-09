import React from 'react';
import { GOOGLE_FONTS } from '../../constants/dimensions';
import { AlignLeft, AlignCenter, AlignRight, Award } from 'lucide-react';
import { Slider } from '../ui/slider';

export default function TextTab({
  headline,
  onChangeHeadline,
  subtitle,
  onChangeSubtitle,
  textPosition,
  onChangeTextPosition,
  fontFamily,
  onChangeFontFamily,
  headlineColor,
  onChangeHeadlineColor,
  subtitleColor,
  onChangeSubtitleColor,
  textAlign,
  onChangeTextAlign,
  headlineSize,
  onChangeHeadlineSize,
  badgeType = 'none',
  onChangeBadgeType,
  badgeText = '',
  onChangeBadgeText
}) {
  return (
    <div className="space-y-6">
      {/* Social Proof / Benefit Badge Selector */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>Selo de Benefício ou Avaliação</span>
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { id: 'none', label: 'Sem Selo' },
            { id: 'rating', label: '★★★★★ 4.9 Nota' },
            { id: 'pill-tag', label: '✦ Destaque AI' },
            { id: 'award', label: '🏆 App do Dia' },
            { id: 'security', label: '🔒 100% Seguro' }
          ].map((badge) => (
            <button
              key={badge.id}
              onClick={() => onChangeBadgeType(badge.id)}
              className={`p-2 rounded-xl text-xs font-semibold text-left transition border ${
                badgeType === badge.id
                  ? 'bg-indigo-600/20 border-indigo-500 text-white'
                  : 'bg-zinc-900 border-zinc-800 text-slate-400 hover:text-white'
              }`}
            >
              {badge.label}
            </button>
          ))}
        </div>

        {badgeType !== 'none' && (
          <div className="pt-1.5">
            <input
              type="text"
              value={badgeText}
              onChange={(e) => onChangeBadgeText(e.target.value)}
              placeholder="Texto customizado do selo..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        )}
      </div>

      {/* Headline Input */}
      <div className="space-y-1.5 pt-2 border-t border-zinc-800">
        <label className="text-xs font-bold text-slate-200">Título Chamativo (Headline)</label>
        <textarea
          rows={2}
          value={headline}
          onChange={(e) => onChangeHeadline(e.target.value)}
          placeholder="Ex: Gerencie suas finanças em segundos"
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition resize-none font-medium"
        />
      </div>

      {/* Subtitle Input */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-200">Subtítulo / Benefício</label>
        <textarea
          rows={2}
          value={subtitle}
          onChange={(e) => onChangeSubtitle(e.target.value)}
          placeholder="Ex: Relatórios automáticos e cartões ilimitados"
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition resize-none font-medium"
        />
      </div>

      {/* Text Position */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-200">Posição dos Textos</label>
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { id: 'top', label: 'No Topo' },
            { id: 'bottom', label: 'Abaixo' },
            { id: 'none', label: 'Ocultar' }
          ].map((pos) => (
            <button
              key={pos.id}
              onClick={() => onChangeTextPosition(pos.id)}
              className={`py-2 text-xs font-semibold rounded-xl border transition ${
                textPosition === pos.id
                  ? 'bg-indigo-600 border-indigo-500 text-white'
                  : 'bg-zinc-900 border-zinc-800 text-slate-400 hover:text-white'
              }`}
            >
              {pos.label}
            </button>
          ))}
        </div>
      </div>

      {/* Font Family Selection */}
      <div className="space-y-2 pt-2 border-t border-zinc-800">
        <label className="text-xs font-bold text-slate-200">Fonte Tipográfica</label>
        <select
          value={fontFamily}
          onChange={(e) => onChangeFontFamily(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-white font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer"
        >
          {GOOGLE_FONTS.map((font) => (
            <option key={font.name} value={font.family} style={{ fontFamily: font.family }}>
              {font.name}
            </option>
          ))}
        </select>
      </div>

      {/* Alignment & Sizes */}
      <div className="space-y-4 pt-2 border-t border-zinc-800">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-200">Alinhamento</span>
          <div className="flex bg-zinc-900 rounded-xl p-1 border border-zinc-800">
            {[
              { id: 'left', icon: AlignLeft },
              { id: 'center', icon: AlignCenter },
              { id: 'right', icon: AlignRight }
            ].map((align) => {
              const Icon = align.icon;
              return (
                <button
                  key={align.id}
                  onClick={() => onChangeTextAlign(align.id)}
                  className={`p-1.5 rounded-lg text-xs transition ${
                    textAlign === align.id ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Radix Headline Size Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-300 font-medium">
            <span>Tamanho do Título</span>
            <span className="font-mono text-indigo-400">{headlineSize}px</span>
          </div>
          <Slider
            min={24}
            max={64}
            step={1}
            value={[headlineSize]}
            onValueChange={([val]) => onChangeHeadlineSize(val)}
          />
        </div>

        {/* Font Colors */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-300">Cor do Título</label>
            <div className="flex items-center gap-2 bg-zinc-900 p-1.5 rounded-xl border border-zinc-800">
              <input
                type="color"
                value={headlineColor}
                onChange={(e) => onChangeHeadlineColor(e.target.value)}
                className="w-7 h-7 rounded-lg bg-transparent border-0 cursor-pointer"
              />
              <span className="text-[11px] font-mono text-slate-300 uppercase">{headlineColor}</span>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-300">Cor do Subtítulo</label>
            <div className="flex items-center gap-2 bg-zinc-900 p-1.5 rounded-xl border border-zinc-800">
              <input
                type="color"
                value={subtitleColor}
                onChange={(e) => onChangeSubtitleColor(e.target.value)}
                className="w-7 h-7 rounded-lg bg-transparent border-0 cursor-pointer"
              />
              <span className="text-[11px] font-mono text-slate-300 uppercase">{subtitleColor}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
