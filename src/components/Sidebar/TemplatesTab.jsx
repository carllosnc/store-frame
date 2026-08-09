import React from 'react';
import { STYLE_TEMPLATES } from '../../constants/templates';
import { Check } from 'lucide-react';

export default function TemplatesTab({ onApplyTemplate, activeTemplateId }) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xs font-semibold text-white mb-0.5 tracking-tight">Estilos de Estúdio</h3>
        <p className="text-[11px] text-slate-400">Selecione uma paleta minimalista para aplicar em todo o projeto.</p>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {STYLE_TEMPLATES.map((tmpl) => {
          const isSelected = activeTemplateId === tmpl.id;
          return (
            <button
              key={tmpl.id}
              onClick={() => onApplyTemplate(tmpl)}
              className={`p-3 rounded-xl border text-left transition-all duration-200 relative overflow-hidden group ${
                isSelected
                  ? 'bg-white/10 border-white/30 ring-1 ring-white/20'
                  : 'bg-[#14151B] border-[#22242D] hover:bg-[#1A1C24] hover:border-slate-700'
              }`}
            >
              {/* Preview Gradient Strip */}
              <div
                className="h-1.5 w-full rounded-full mb-2.5"
                style={{
                  background: `linear-gradient(${tmpl.gradientAngle}deg, ${tmpl.gradientColors.join(', ')})`
                }}
              ></div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white tracking-tight">
                    {tmpl.name}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{tmpl.category}</div>
                </div>
                {isSelected ? (
                  <span className="w-5 h-5 rounded-full bg-white text-slate-950 flex items-center justify-center text-xs font-bold">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                ) : (
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white/5 text-slate-400 group-hover:text-white transition">
                    Aplicar
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
