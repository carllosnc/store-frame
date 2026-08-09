import React, { useState } from 'react';
import { Upload } from 'lucide-react';

export default function CanvasArea({
  preset,
  screenState,
  screens = [],
  activeScreenIndex = 0,
  onSelectScreen,
  viewMode = 'single',
  onToggleViewMode,
  zoom = 65,
  canvasRef,
  onImageDrop
}) {
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageDrop(e.dataTransfer.files[0]);
    }
  };

  const getAlignmentClass = (align) => {
    switch (align) {
      case 'left':
        return 'text-left items-start';
      case 'right':
        return 'text-right items-end';
      case 'center':
      default:
        return 'text-center items-center';
    }
  };

  const getBackgroundPatternStyle = (scState) => {
    const bgPattern = scState.bgPattern || 'none';
    const bgColor = scState.bgColor || '#44C0FE';

    if (bgPattern === 'diagonal') {
      return {
        backgroundColor: bgColor,
        backgroundImage: `repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.08) 0, rgba(255, 255, 255, 0.08) 16px, transparent 16px, transparent 32px)`
      };
    }
    if (bgPattern === 'vertical') {
      return {
        backgroundColor: bgColor,
        backgroundImage: `repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.08) 0, rgba(255, 255, 255, 0.08) 16px, transparent 16px, transparent 32px)`
      };
    }
    if (bgPattern === 'dots') {
      return {
        backgroundColor: bgColor,
        backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.18) 1.5px, transparent 1.5px)`,
        backgroundSize: '20px 20px'
      };
    }
    return {
      backgroundColor: bgColor
    };
  };

  // Active Screen Properties
  const imageCornerRadius = screenState.cornerRadius !== undefined ? screenState.cornerRadius : 36;
  const imageZoomScale = (screenState.imageZoom !== undefined ? screenState.imageZoom : 100) / 100;

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="flex-1 bg-[#09090B] flex flex-col items-center justify-center p-6 overflow-auto relative custom-scrollbar select-none"
      style={{
        backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.12) 1.2px, transparent 1.2px)`,
        backgroundSize: '24px 24px'
      }}
    >
      {/* Drag Over Drop Prompt */}
      {isDraggingOver && (
        <div className="absolute inset-6 rounded-3xl border-2 border-dashed border-white/50 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center gap-3 text-white pointer-events-none animate-fade-in">
          <Upload className="w-8 h-8 text-white animate-bounce" />
          <span className="font-semibold text-sm">Solte a imagem aqui para carregar</span>
        </div>
      )}

      {/* Floating Resolution Badge */}
      <div className="absolute top-4 right-6 bg-[#14151C]/90 backdrop-blur-md border border-[#222430] px-3.5 py-1.5 rounded-full text-[11px] font-mono text-zinc-300 font-semibold shadow-md z-20 flex items-center gap-2 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>{preset.width} × {preset.height} px</span>
      </div>

      {/* VIEW MODE: OVERVIEW GRID (VISUALIZAR TODAS AS TELAS AO MESMO TEMPO) */}
      {viewMode === 'all' ? (
        <div className="w-full flex-1 overflow-auto p-10 pt-16 custom-scrollbar my-auto">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-14 max-w-7xl mx-auto py-6">
            {screens.map((sc, idx) => {
              const isCurrentActive = activeScreenIndex === idx;
              const scCornerRadius = sc.cornerRadius !== undefined ? sc.cornerRadius : 36;
              const scZoomScale = (sc.imageZoom !== undefined ? sc.imageZoom : 100) / 100;

              return (
                <div
                  key={sc.id || idx}
                  onClick={() => {
                    onSelectScreen(idx);
                    onToggleViewMode('single');
                  }}
                  className="group flex flex-col items-center gap-3 cursor-pointer transition-all duration-200 transform hover:scale-[1.02]"
                >
                  {/* Clean Title Badge above card (No negative offset collision) */}
                  <div className={`bg-[#14151C]/95 backdrop-blur-md border px-3.5 py-1 rounded-full text-xs font-bold text-zinc-200 shadow-md flex items-center gap-2 transition ${
                    isCurrentActive ? 'border-sky-400/80 text-sky-300 ring-2 ring-sky-500/20' : 'border-[#222430] group-hover:border-zinc-500'
                  }`}>
                    <span className="font-mono text-zinc-400">#{idx + 1}</span>
                    <span>{sc.title || `Tela ${idx + 1}`}</span>
                  </div>

                  {/* Rendered Mockup Card */}
                  <div
                    className={`relative shadow-2xl overflow-hidden flex flex-col justify-between pt-12 px-8 pb-0 transition-all rounded-3xl ${
                      isCurrentActive ? 'ring-4 ring-sky-400/70 shadow-sky-950/50 scale-[1.01]' : 'opacity-90 group-hover:opacity-100'
                    }`}
                    style={{
                      width: `${preset.width / 4.2}px`,
                      height: `${preset.height / 4.2}px`,
                      ...getBackgroundPatternStyle(sc),
                      fontFamily: sc.fontFamily || "'Inter', sans-serif"
                    }}
                  >
                    {/* Headline */}
                    <div className={`z-10 flex flex-col ${getAlignmentClass(sc.textAlign)} gap-2 px-2 max-w-xs mx-auto w-full mb-4`}>
                      {sc.headline && (
                        <h1
                          className="font-black tracking-tight leading-tight transition-all"
                          style={{
                            color: sc.headlineColor || '#000000',
                            fontSize: `${Math.max(22, (sc.headlineSize || 48) * 0.65)}px`,
                            fontWeight: sc.headlineWeight || '900'
                          }}
                        >
                          {sc.headline}
                        </h1>
                      )}
                    </div>

                    {/* Screenshot */}
                    <div className="w-full flex-1 flex items-end justify-center relative z-10 overflow-hidden pt-2">
                      <div
                        className="w-full h-full max-w-[240px] overflow-hidden transition-all flex items-center justify-center bg-black"
                        style={{
                          borderTopLeftRadius: `${scCornerRadius * 0.7}px`,
                          borderTopRightRadius: `${scCornerRadius * 0.7}px`,
                          borderBottomLeftRadius: '0px',
                          borderBottomRightRadius: '0px',
                          boxShadow: 'none'
                        }}
                      >
                        {sc.imageSrc ? (
                          <img
                            src={sc.imageSrc}
                            alt="App Screenshot"
                            className="w-full h-full object-cover object-top transition-transform duration-150 origin-top"
                            style={{ transform: `scale(${scZoomScale})` }}
                          />
                        ) : (
                          <div className="w-full h-full bg-[#111] text-white flex flex-col items-center justify-center text-center select-none border border-white/5">
                            <Upload className="w-5 h-5 text-white/50" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* VIEW MODE: SINGLE ACTIVE SCREEN (CANVAS NODE FOR EXPORT) */
        <div
          className="transition-transform duration-200 ease-out origin-center flex items-center justify-center relative my-auto"
          style={{ transform: `scale(${zoom / 100})` }}
        >
          <div
            ref={canvasRef}
            className="relative shadow-2xl overflow-hidden flex flex-col justify-between pt-16 px-10 pb-0 transition-all rounded-3xl"
            style={{
              width: `${preset.width / 2.8}px`,
              height: `${preset.height / 2.8}px`,
              ...getBackgroundPatternStyle(screenState),
              fontFamily: screenState.fontFamily || "'Inter', sans-serif"
            }}
          >
            {/* TOP HEADLINE TEXT */}
            <div className={`z-10 flex flex-col ${getAlignmentClass(screenState.textAlign)} gap-3 px-4 max-w-xl mx-auto w-full mb-8`}>
              {screenState.headline && (
                <h1
                  className="font-black tracking-tight leading-tight transition-all"
                  style={{
                    color: screenState.headlineColor || '#000000',
                    fontSize: `${screenState.headlineSize || 48}px`,
                    fontWeight: screenState.headlineWeight || '900'
                  }}
                >
                  {screenState.headline}
                </h1>
              )}
              {screenState.subtitle && (
                <p
                  className="font-semibold opacity-90 max-w-md leading-relaxed transition-all"
                  style={{
                    color: screenState.subtitleColor || '#18181B',
                    fontSize: `${Math.max(14, (screenState.headlineSize || 48) * 0.40)}px`
                  }}
                >
                  {screenState.subtitle}
                </p>
              )}
            </div>

            {/* FRAMELESS SCREENSHOT */}
            <div className="w-full flex-1 flex items-end justify-center relative z-10 overflow-hidden pt-4">
              <div
                className="w-full h-full max-w-[340px] overflow-hidden transition-all flex items-center justify-center bg-black"
                style={{
                  borderTopLeftRadius: `${imageCornerRadius}px`,
                  borderTopRightRadius: `${imageCornerRadius}px`,
                  borderBottomLeftRadius: '0px',
                  borderBottomRightRadius: '0px',
                  boxShadow: 'none'
                }}
              >
                {screenState.imageSrc ? (
                  <img
                    src={screenState.imageSrc}
                    alt="App Screenshot"
                    className="w-full h-full object-cover object-top transition-transform duration-150 origin-top"
                    style={{ transform: `scale(${imageZoomScale})` }}
                  />
                ) : (
                  <div className="w-full h-full bg-[#111] text-white flex flex-col items-center justify-center text-center select-none group border border-white/5">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-white group-hover:scale-110 transition-all shadow-sm">
                      <Upload className="w-6 h-6 text-white" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
