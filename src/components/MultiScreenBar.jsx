import React from 'react';
import { Plus, X } from 'lucide-react';

export default function MultiScreenBar({
  screens,
  activeScreenIndex,
  onSelectScreen,
  onAddScreen,
  onDeleteScreen
}) {
  return (
    <div className="h-20 bg-zinc-950 border-t border-zinc-800 px-6 flex items-center justify-start z-20 overflow-x-auto custom-scrollbar shrink-0 select-none">
      {/* Screen Cards Bar */}
      <div className="flex items-center gap-3 my-auto py-1">
        {screens.map((screen, idx) => {
          const isActive = activeScreenIndex === idx;
          return (
            <div
              key={screen.id || idx}
              onClick={() => onSelectScreen(idx)}
              className={`h-12 px-4 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all duration-150 text-sm font-bold shrink-0 ${
                isActive
                  ? 'bg-zinc-100 text-zinc-950 border-zinc-100 shadow-md scale-[1.02]'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:border-zinc-700 hover:bg-zinc-800'
              }`}
            >
              {/* Screen Title */}
              <span className="max-w-[140px] truncate tracking-tight">{screen.title || `Tela ${idx + 1}`}</span>

              {/* Close Button X */}
              {screens.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteScreen(idx);
                  }}
                  className={`transition-colors p-1 rounded-md ml-0.5 ${
                    isActive
                      ? 'text-zinc-500 hover:text-zinc-950 hover:bg-zinc-200'
                      : 'text-zinc-500 hover:text-white hover:bg-zinc-800'
                  }`}
                  title="Fechar tela"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}

        {/* Add New Screen Button */}
        <button
          onClick={onAddScreen}
          className="h-12 px-4 rounded-xl border border-dashed border-zinc-700 hover:border-zinc-300 bg-zinc-900 text-zinc-300 hover:text-white text-sm font-bold flex items-center gap-2 transition-all hover:bg-zinc-800 shrink-0"
        >
          <Plus className="w-4 h-4 text-zinc-300" />
          <span>Nova Tela</span>
        </button>
      </div>
    </div>
  );
}
