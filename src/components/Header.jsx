import React from 'react';
import { Download, Archive, Copy, Wand2 } from 'lucide-react';
import { Button } from './ui/button';

export default function Header({
  onExportSingle,
  onExportZip,
  isExporting,
  screensCount = 1,
  onDuplicateScreen,
  onSyncStyles
}) {
  return (
    <header className="h-14 bg-zinc-950 border-b border-zinc-800 px-4 sm:px-6 flex items-center justify-between z-30 select-none">
      {/* Logo */}
      <div className="flex items-center shrink-0">
        <svg height="20" viewBox="0 0 2492 229" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2491.94 0V228.415H2263.52V0H2491.94ZM2423.7 44.2555H2352.6V69.3812H2327.19V161.033H2352.6V186.159H2423.7V161.033H2352.6V118.205H2423.7V93.0793H2352.6V69.3812H2423.7V44.2555Z" fill="white"/>
          <path d="M2240.43 0V228.415H2012.02V0H2240.43ZM2090.54 62.8142H2065.41V179.877H2090.54V62.8142ZM2161.63 37.6885H2138.79V62.8142H2113.38V37.6885H2090.54V62.8142H2113.38V179.877H2138.79V62.8142H2161.63V37.6885ZM2187.33 62.8142H2161.92V179.877H2187.33V62.8142Z" fill="white"/>
          <path d="M1988.93 0V228.415H1760.52V0H1988.93ZM1839.03 69.0957H1910.13V43.97H1839.03V69.0957ZM1935.83 69.0957H1910.41V92.7938H1839.03V69.0957H1813.62V186.159H1839.03V118.205H1910.41V186.159H1935.83V69.0957Z" fill="white"/>
          <path d="M1587.53 70.2378H1658.63V93.9359H1587.53V70.2378ZM1737.43 0V228.415H1509.01V0H1737.43ZM1683.75 70.2378H1658.63V45.1121H1587.53H1585.82H1562.41V187.301H1587.53V119.062H1658.63V187.872H1683.75V119.062H1658.63V93.9359H1683.75V70.2378Z" fill="white"/>
          <path d="M1485.93 0V228.415H1257.51V0H1485.93ZM1417.97 93.0793H1346.88V69.3812H1321.47V186.159H1346.88V118.205H1417.97V93.0793ZM1417.97 44.2555H1346.88V69.3812H1417.97V44.2555Z" fill="white"/>
          <path d="M1234.43 0V228.415H1006.01V0H1234.43ZM1166.19 44.2555H1095.09V69.3812H1069.68V161.033H1095.09V186.159H1166.19V161.033H1095.09V118.205H1166.19V93.0793H1095.09V69.3812H1166.19V44.2555Z" fill="#60A5FA"/>
          <path d="M833.025 70.2378H904.119V93.9359H833.025V70.2378ZM982.923 0V228.415H754.507V0H982.923ZM929.245 70.2378H904.119V45.1121H833.025H831.312H807.899V187.301H833.025V119.062H904.119V187.872H929.245V119.062H904.119V93.9359H929.245V70.2378Z" fill="#60A5FA"/>
          <path d="M647.763 70.2378V161.889H576.098V70.2378H647.763ZM731.42 0V228.415H503.005V0H731.42ZM672.889 70.2378H647.763V45.1121H576.098V70.2378H550.972V161.889H576.098V187.301H647.763V161.889H672.889V70.2378Z" fill="#60A5FA"/>
          <path d="M479.918 0V228.415H251.502V0H479.918ZM415.391 45.1121H315.744V70.2378H352.862V187.872H378.273V70.2378H415.391V45.1121Z" fill="#60A5FA"/>
          <path d="M228.415 0V228.415H0V0H228.415ZM174.167 119.062H149.041V93.9359H77.9468V70.2378H52.5356V93.9359H76.2337V119.062H149.041V161.889H52.5356V187.301H149.041V161.889H174.167V119.062ZM174.167 45.1121H77.9468V70.2378H174.167V45.1121Z" fill="#60A5FA"/>
        </svg>
      </div>

      {/* Studio Action Controls in Top Header */}
      <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.currentTarget.blur();
            onDuplicateScreen?.();
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
            onSyncStyles?.();
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
