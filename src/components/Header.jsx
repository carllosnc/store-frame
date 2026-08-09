import React from 'react';
import { 
  Sparkles, 
  Download, 
  Archive, 
  LayoutGrid, 
  Maximize2, 
  Copy, 
  Wand2 
} from 'lucide-react';
import { Button } from './ui/button';

export default function Header({
  onExportSingle,
  onExportZip,
  isExporting,
  screensCount = 1,
  viewMode = 'single',
  onToggleViewMode,
  onDuplicateScreen,
  onSyncStyles
}) {
  return (
    <header className="h-14 bg-[#0E0F14] border-b border-[#1E2028] px-4 sm:px-6 flex items-center justify-between z-30 select-none">
      {/* Logo */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-white text-zinc-950 flex items-center justify-center font-black text-sm shadow-md">
          <Sparkles className="w-4 h-4 text-zinc-950" />
        </div>
        <span className="font-extrabold text-white text-base tracking-tight hidden sm:inline">StoreFrame</span>
      </div>

      {/* Studio Action Controls in Top Header */}
      <div className="flex items-center gap-1 bg-[#14151C] p-1 rounded-xl border border-[#22242A]">
        <Button
          variant={viewMode === 'all' ? "default" : "ghost"}
          size="sm"
          onClick={(e) => {
            e.currentTarget.blur();
            onToggleViewMode(viewMode === 'single' ? 'all' : 'single');
          }}
          className="h-8 px-3 text-xs font-semibold gap-1.5 focus:outline-none focus:ring-0"
          title={viewMode === 'single' ? "Clique para alternar para a Visão Geral (Grid de Telas)" : "Clique para alternar para o Modo Foco (Tela Única)"}
        >
          {viewMode === 'single' ? (
            <>
              <Maximize2 className="w-3.5 h-3.5 text-zinc-300" />
              <span className="hidden md:inline">Modo Foco</span>
            </>
          ) : (
            <>
              <LayoutGrid className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden md:inline">Visão Geral ({screensCount})</span>
            </>
          )}
        </Button>

        <div className="w-[1px] h-4 bg-[#22242A]" />

        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.currentTarget.blur();
            onDuplicateScreen();
          }}
          className="h-8 px-3 text-xs font-semibold gap-1.5 text-zinc-300 hover:text-white focus:outline-none focus:ring-0"
          title="Duplicar tela atual"
        >
          <Copy className="w-3.5 h-3.5 text-zinc-400" />
          <span className="hidden md:inline">Duplicar</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.currentTarget.blur();
            onSyncStyles();
          }}
          className="h-8 px-3 text-xs font-semibold gap-1.5 text-zinc-300 hover:text-white focus:outline-none focus:ring-0"
          title="Aplicar estilo de fundo e texto em todas as telas"
        >
          <Wand2 className="w-3.5 h-3.5 text-zinc-400" />
          <span className="hidden md:inline">Aplicar Estilo em Todas</span>
        </Button>
      </div>

      {/* Export Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="secondary"
          size="sm"
          onClick={(e) => {
            e.currentTarget.blur();
            onExportSingle();
          }}
          disabled={isExporting}
          className="gap-1.5 text-xs font-semibold focus:outline-none focus:ring-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Exportar PNG</span>
        </Button>

        <Button
          variant="default"
          size="sm"
          onClick={(e) => {
            e.currentTarget.blur();
            onExportZip();
          }}
          disabled={isExporting}
          className="gap-1.5 text-xs font-semibold focus:outline-none focus:ring-0"
        >
          <Archive className="w-3.5 h-3.5" />
          <span>ZIP ({screensCount})</span>
        </Button>
      </div>
    </header>
  );
}
