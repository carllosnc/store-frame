import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  RotateCcw,
  Move
} from 'lucide-react';

export default function CanvasArea({
  preset,
  screenState,
  screens = [],
  activeScreenIndex = 0,
  onSelectScreen,
  viewMode = 'single',
  onToggleViewMode,
  canvasRef,
  onImageDrop
}) {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  
  // Infinite Canvas Pan & Zoom State
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(0.8);
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const [isSpacePressed, setIsSpacePressed] = useState(false);

  const containerRef = useRef(null);

  // Spacebar panning listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
        setIsSpacePressed(true);
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false);
        setIsPanning(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Mouse Wheel Zoom
  const handleWheel = (e) => {
    if (e.target.closest('.custom-scrollbar-content')) return;
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
    setScale(prevScale => Math.min(2.5, Math.max(0.15, prevScale * zoomFactor)));
  };

  // Pan Start
  const handleMouseDown = (e) => {
    // Start pan on middle mouse click (button 1), spacebar pressed, or clicking direct stage background
    if (e.button === 1 || isSpacePressed || e.target === containerRef.current || e.target.classList.contains('infinite-stage')) {
      e.preventDefault();
      setIsPanning(true);
      setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  // Pan Move
  const handleMouseMove = (e) => {
    if (isPanning) {
      setPan({
        x: e.clientX - startPan.x,
        y: e.clientY - startPan.y
      });
    }
  };

  // Pan End
  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Reset Canvas View
  const handleResetView = () => {
    setPan({ x: 0, y: 0 });
    setScale(0.8);
  };

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

  const imageCornerRadius = screenState.cornerRadius !== undefined ? screenState.cornerRadius : 36;
  const imageZoomScale = (screenState.imageZoom !== undefined ? screenState.imageZoom : 100) / 100;

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex-1 bg-[#07080B] flex items-center justify-center relative overflow-hidden select-none infinite-stage ${
        isPanning ? 'cursor-grabbing' : isSpacePressed ? 'cursor-grab' : 'cursor-default'
      }`}
      style={{
        backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.14) 1.2px, transparent 1.2px)`,
        backgroundSize: `${24 * scale}px ${24 * scale}px`,
        backgroundPosition: `${pan.x}px ${pan.y}px`
      }}
    >
      {/* Drag Over Drop Prompt */}
      {isDraggingOver && (
        <div className="absolute inset-6 rounded-3xl border-2 border-dashed border-white/50 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center gap-3 text-white pointer-events-none animate-fade-in">
          <Upload className="w-8 h-8 text-white animate-bounce" />
          <span className="font-semibold text-sm">Solte a imagem aqui para carregar</span>
        </div>
      )}

      {/* Top Right Floating Resolution Badge */}
      <div className="absolute top-4 right-6 bg-[#14151C]/90 backdrop-blur-md border border-[#222430] px-3.5 py-1.5 rounded-full text-[11px] font-mono text-zinc-300 font-semibold shadow-md z-20 flex items-center gap-2 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>{preset.width} × {preset.height} px</span>
      </div>

      {/* Floating Infinite Canvas Controls Dock */}
      <div className="absolute bottom-6 right-6 bg-[#14151C]/90 backdrop-blur-md border border-[#222430] p-1.5 rounded-2xl shadow-xl z-20 flex items-center gap-1.5 text-xs text-zinc-300">
        <button
          onClick={() => setScale(s => Math.max(0.15, s * 0.85))}
          className="p-1.5 rounded-xl hover:bg-[#1E202B] hover:text-white transition"
          title="Diminuir Zoom (-)"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <span className="font-mono text-xs font-semibold px-2 py-0.5 text-zinc-300 min-w-[48px] text-center">
          {Math.round(scale * 100)}%
        </span>

        <button
          onClick={() => setScale(s => Math.min(2.5, s * 1.15))}
          className="p-1.5 rounded-xl hover:bg-[#1E202B] hover:text-white transition"
          title="Aumentar Zoom (+)"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-4 bg-[#222430] mx-0.5" />

        <button
          onClick={handleResetView}
          className="p-1.5 rounded-xl hover:bg-[#1E202B] hover:text-white transition"
          title="Resetar Posição e Zoom"
        >
          <RotateCcw className="w-4 h-4 text-zinc-400" />
        </button>

        <div className="w-[1px] h-4 bg-[#222430] mx-0.5" />

        <div className="flex items-center gap-1 px-2 py-0.5 text-[11px] text-zinc-400 font-medium">
          <Move className="w-3 h-3 text-zinc-500" />
          <span>Espaço + Arrastar</span>
        </div>
      </div>

      {/* INFINITE CANVAS TRANSFORM CONTAINER */}
      <div
        className="transition-transform duration-75 ease-out origin-center flex items-center justify-center pointer-events-none"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`
        }}
      >
        <div className="pointer-events-auto flex items-center justify-center">
          {/* VIEW MODE: OVERVIEW GRID (TODAS AS TELAS NO CANVAS INFINITO) */}
          {viewMode === 'all' ? (
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-16 max-w-[1600px] p-8">
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
                    {/* Title Badge Header */}
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
          ) : (
            /* VIEW MODE: SINGLE ACTIVE SCREEN (CANVAS NODE FOR EXPORT) */
            <div className="flex items-center justify-center relative">
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
      </div>
    </div>
  );
}
