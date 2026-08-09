import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Move,
  Plus,
  X,
  Images
} from 'lucide-react';

export default function CanvasArea({
  onAddScreen,
  onDeleteScreen,
  preset,
  screenState,
  screens = [],
  activeScreenIndex = 0,
  onSelectScreen,
  canvasRef,
  onImageDrop,
  onBulkImageUpload
}) {
  const bulkInputRef = useRef(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  
  // Infinite Canvas Pan & Zoom State
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(0.8);
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const [isSpacePressed, setIsSpacePressed] = useState(false);

  const containerRef = useRef(null);
  const gridRef = useRef(null);
  const screenRefs = useRef([]);

  // Auto-center canvas on the active screen when selection changes
  useEffect(() => {
    const activeNode = screenRefs.current[activeScreenIndex];
    if (activeNode && gridRef.current) {
      const childCenterX = activeNode.offsetLeft + (activeNode.offsetWidth / 2);
      const childCenterY = activeNode.offsetTop + (activeNode.offsetHeight / 2);

      const gridCenterX = gridRef.current.offsetWidth / 2;
      const gridCenterY = gridRef.current.offsetHeight / 2;

      setPan({
        x: gridCenterX - childCenterX,
        y: gridCenterY - childCenterY
      });
      setScale(1.15); // Auto zoom level for focused screen
    }
  }, [activeScreenIndex]);
  // Keyboard Navigation & Spacebar Panning Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isEditingText = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName) || document.activeElement?.isContentEditable;

      if (e.code === 'Space' && !isEditingText) {
        e.preventDefault();
        if (document.activeElement && typeof document.activeElement.blur === 'function') {
          document.activeElement.blur();
        }
        setIsSpacePressed(true);
      }

      if (!isEditingText) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          onSelectScreen(prev => Math.max(0, prev - 1));
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          onSelectScreen(prev => Math.min(screens.length - 1, prev + 1));
        }
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
  }, [screens.length, onSelectScreen]);

  // Mouse Wheel Zoom
  const handleWheel = (e) => {
    if (e.target.closest('.custom-scrollbar-content')) return;
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
    setScale(prevScale => Math.min(2.5, Math.max(0.15, prevScale * zoomFactor)));
  };

  // Pan Start (Via Space + Drag, Middle Click, or Dragging direct background stage)
  const handleMouseDown = (e) => {
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
    e.dataTransfer.dropEffect = 'copy';
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e) => {
    // Only hide the overlay when truly leaving the canvas container
    if (!containerRef.current?.contains(e.relatedTarget)) {
      setIsDraggingOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    if (files.length > 1) {
      // Multiple files → create a new screen for each one
      onBulkImageUpload(files);
    } else {
      // Single file → update the active screen's image
      onImageDrop(files[0]);
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
      className={`flex-1 bg-zinc-900 flex items-center justify-center relative overflow-hidden select-none infinite-stage ${
        isPanning ? 'cursor-grabbing' : isSpacePressed ? 'cursor-grab' : 'cursor-default'
      }`}
      style={{
        backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.10) 1.2px, transparent 1.2px)`,
        backgroundSize: `24px 24px`,
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

      {/* Floating Footer Bar — bottom center of canvas */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-zinc-900/80 backdrop-blur-md border border-zinc-700/60 rounded-2xl px-3 py-2 shadow-2xl">

        {/* Add single screen */}
        <button
          onClick={onAddScreen}
          className="flex items-center gap-2 h-9 px-4 bg-emerald-500 text-white rounded-xl font-semibold text-xs hover:bg-emerald-400 hover:scale-105 active:scale-95 transition-all duration-150 shadow-md"
          title="Nova Tela"
        >
          <Plus className="w-4 h-4" />
          Nova Tela
        </button>

        <div className="w-px h-5 bg-zinc-700" />

        {/* Bulk upload — create screens from multiple images */}
        <input
          ref={bulkInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length > 0) {
              onBulkImageUpload(e.target.files);
              e.target.value = '';
            }
          }}
        />
        <button
          onClick={() => bulkInputRef.current?.click()}
          className="flex items-center gap-2 h-9 px-4 bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-xl text-xs font-semibold hover:bg-zinc-700 hover:border-zinc-500 hover:text-white hover:scale-105 active:scale-95 transition-all duration-150"
          title="Criar telas com vários prints"
        >
          <Images className="w-4 h-4 text-blue-400" />
          Importar prints
        </button>
      </div>

      {/* Top Right Floating Resolution Badge */}
      <div className="absolute top-4 right-6 bg-zinc-900/90 backdrop-blur-md border border-zinc-800 px-3.5 py-1.5 rounded-full text-[11px] font-mono text-zinc-300 font-semibold shadow-md z-20 flex items-center gap-2 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>{preset.width} × {preset.height} px</span>
      </div>

      <div style={{display:'none'}}>
      
        <button
          onClick={() => setScale(s => Math.max(0.15, s * 0.85))}
          className="p-1 rounded-xl hover:bg-zinc-800 hover:text-white transition"
          title="Diminuir Zoom (-)"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <span className="font-mono text-xs font-semibold px-2 py-0.5 text-zinc-300 min-w-[48px] text-center">
          {Math.round(scale * 100)}%
        </span>

        <button
          onClick={() => setScale(s => Math.min(2.5, s * 1.15))}
          className="p-1 rounded-xl hover:bg-zinc-800 hover:text-white transition"
          title="Aumentar Zoom (+)"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-4 bg-zinc-800 mx-0.5" />

        <button
          onClick={handleResetView}
          className="p-1 rounded-xl hover:bg-zinc-800 hover:text-white transition"
          title="Resetar Posição e Zoom"
        >
          <RotateCcw className="w-4 h-4 text-zinc-400" />
        </button>

        <div className="w-[1px] h-4 bg-zinc-800 mx-0.5" />

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
        <div className={`flex items-center justify-center ${isPanning || isSpacePressed ? 'pointer-events-none' : 'pointer-events-auto'}`}>
          {/* VIEW MODE: OVERVIEW GRID (TODAS AS TELAS NO CANVAS INFINITO) */}
          <div ref={gridRef} className="flex flex-nowrap items-center justify-start gap-x-10 overflow-x-auto p-4">
            {screens.map((sc, idx) => {
              const isCurrentActive = activeScreenIndex === idx;
              const scCornerRadius = sc.cornerRadius !== undefined ? sc.cornerRadius : 36;
              const scZoomScale = (sc.imageZoom !== undefined ? sc.imageZoom : 100) / 100;

              return (
                <div
                  key={sc.id || idx}
                  ref={(el) => (screenRefs.current[idx] = el)}
                  onClick={() => { onSelectScreen(idx); }}
                  className={`group relative flex flex-col items-center gap-6 cursor-pointer transition-all duration-200 transform hover:scale-[1.02]`}
                >
                  {/* Title Badge + Delete Button Row */}
                  <div className="flex items-center gap-2">
                    <div className={`bg-zinc-900/95 backdrop-blur-md border px-3.5 py-1 rounded-full text-xs font-bold text-zinc-200 shadow-md flex items-center gap-2 transition ${
                      isCurrentActive ? 'border-white text-white ring-2 ring-white/20' : 'border-zinc-800 group-hover:border-zinc-500'
                    }`}>
                      <span className="font-mono text-zinc-400">#{idx + 1}</span>
                      <span>{sc.title || `Tela ${idx + 1}`}</span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); onDeleteScreen(idx); }}
                      className="z-10 flex items-center justify-center w-5 h-5 rounded-full bg-zinc-800 hover:bg-red-600 text-zinc-400 hover:text-white transition-all"
                      title="Remover tela"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>

                    {/* Rendered Mockup Card */}
                    <div
                      className={`relative overflow-hidden flex flex-col pt-5 px-3 pb-0 transition-all ${
                        isCurrentActive ? 'outline outline-2 outline-white outline-offset-[6px] scale-[1.01]' : 'opacity-90 group-hover:opacity-100'
                      }`}
                      style={{
                        width: `${preset.width / 4.2}px`,
                        height: `${preset.height / 4.2}px`,
                        ...getBackgroundPatternStyle(sc),
                        fontFamily: sc.fontFamily || "'Inter', sans-serif"
                      }}
                    >
                      {/* Headline */}
                      <div className={`z-10 flex flex-col ${getAlignmentClass(sc.textAlign)} gap-1 w-full mb-3`}>
                        {sc.headline && (
                          <h1
                            className="font-black tracking-tight leading-tight transition-all"
                            style={{
                              color: sc.headlineColor || '#000000',
                              fontSize: `${Math.max(20, (sc.headlineSize || 48) * 0.55)}px`,
                              fontWeight: sc.headlineWeight || '900'
                            }}
                          >
                            {sc.headline}
                          </h1>
                        )}
                      </div>

                      {/* Screenshot */}
                      <div className="w-full flex-1 flex items-end justify-center relative z-10 overflow-hidden">
                        <div
                          className="w-full h-full overflow-hidden transition-all bg-black"
                          style={{
                            border: '5px solid #000',
                            borderBottom: 'none',
                            borderTopLeftRadius: `${scCornerRadius * 0.7}px`,
                            borderTopRightRadius: `${scCornerRadius * 0.7}px`,
                            borderBottomLeftRadius: '0px',
                            borderBottomRightRadius: '0px',
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
                            <div className="w-full h-full bg-zinc-900 text-white flex flex-col items-center justify-center text-center select-none border border-white/5">
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

          {/* HIDDEN EXPORT NODE: HIGH RESOLUTION CANVAS FOR EXPORTING ONLY */}
          <div className="pointer-events-none flex items-center justify-center" style={{ position: 'fixed', top: '-9999px', left: '-9999px', zIndex: -1 }}>
            <div
              ref={canvasRef}
              className="relative overflow-hidden flex flex-col"
              style={{
                width: `${preset.width / 2.8}px`,
                height: `${preset.height / 2.8}px`,
                paddingTop: '30px',
                paddingLeft: '18px',
                paddingRight: '18px',
                paddingBottom: '0',
                ...getBackgroundPatternStyle(screenState),
                fontFamily: screenState.fontFamily || "'Inter', sans-serif"
              }}
            >
              {/* TOP HEADLINE TEXT — mirrors canvas card */}
              <div className={`z-10 flex flex-col ${getAlignmentClass(screenState.textAlign)} w-full`} style={{ gap: '6px', marginBottom: '18px' }}>
                {screenState.headline && (
                  <h1
                    className="font-black tracking-tight leading-tight"
                    style={{
                      color: screenState.headlineColor || '#000000',
                      fontSize: `${Math.max(30, (screenState.headlineSize || 48) * 0.825)}px`,
                      fontWeight: screenState.headlineWeight || '900'
                    }}
                  >
                    {screenState.headline}
                  </h1>
                )}
              </div>

              {/* SCREENSHOT — mirrors canvas card (w-full, same border/radius style) */}
              <div className="w-full flex-1 flex items-end justify-center relative z-10 overflow-hidden">
                <div
                  className="w-full h-full overflow-hidden bg-black"
                  style={{
                    border: '7px solid #000',
                    borderBottom: 'none',
                    borderTopLeftRadius: `${imageCornerRadius * 1.05}px`,
                    borderTopRightRadius: `${imageCornerRadius * 1.05}px`,
                    borderBottomLeftRadius: '0px',
                    borderBottomRightRadius: '0px',
                  }}
                >
                  {screenState.imageSrc ? (
                    <img
                      src={screenState.imageSrc}
                      alt="App Screenshot"
                      className="w-full h-full object-cover object-top"
                      style={{ transform: `scale(${imageZoomScale})`, transformOrigin: 'top center' }}
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-900 text-white flex flex-col items-center justify-center text-center select-none border border-white/5">
                      <Upload className="w-6 h-6 text-white/50" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
