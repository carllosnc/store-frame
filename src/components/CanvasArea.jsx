import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Move,
  Plus,
  X,
  Images,
  ChevronLeft,
  ChevronRight,
  GripVertical
} from 'lucide-react';

export default function CanvasArea({
  onAddScreen,
  onDeleteScreen,
  onReorderScreens,
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
  
  // Canvas Drag & Drop Screen Reordering State
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [dropTargetIdx, setDropTargetIdx] = useState(null);

  const handleScreenDragStart = (e, idx) => {
    setDraggedIdx(idx);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', idx.toString());
  };

  const handleScreenDragOver = (e, idx) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dropTargetIdx !== idx) {
      setDropTargetIdx(idx);
    }
  };

  const handleScreenDrop = (e, targetIdx) => {
    e.preventDefault();
    if (draggedIdx !== null && draggedIdx !== targetIdx && onReorderScreens) {
      onReorderScreens(draggedIdx, targetIdx);
    }
    setDraggedIdx(null);
    setDropTargetIdx(null);
  };

  const handleScreenDragEnd = () => {
    setDraggedIdx(null);
    setDropTargetIdx(null);
  };
  
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
  // Keyboard Navigation & Spacebar / Control Panning Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isEditingText = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName) || document.activeElement?.isContentEditable;

      if ((e.code === 'Space' || e.key === 'Control' || e.code === 'ControlLeft' || e.code === 'ControlRight') && !isEditingText) {
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
        } else if (e.key === 'Delete') {
          e.preventDefault();
          onDeleteScreen(activeScreenIndex);
        }
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === 'Space' || e.key === 'Control' || e.code === 'ControlLeft' || e.code === 'ControlRight') {
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
  }, [screens.length, activeScreenIndex, onSelectScreen, onDeleteScreen]);

  // Mouse Wheel Zoom
  const handleWheel = (e) => {
    if (e.target.closest('.custom-scrollbar-content')) return;
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
    setScale(prevScale => Math.min(2.5, Math.max(0.15, prevScale * zoomFactor)));
  };

  // Pan Start (Via Space/Ctrl + Drag, Middle Click, or Dragging direct background stage)
  const handleMouseDown = (e) => {
    if (e.button === 1 || isSpacePressed || e.ctrlKey || e.target === containerRef.current || e.target.classList.contains('infinite-stage')) {
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

  const getBackgroundPatternStyle = (scState = {}) => {
    if (!scState) return { backgroundColor: '#44C0FE' };
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

  const safeScreenState = screenState || {};
  const imageCornerRadius = safeScreenState.cornerRadius !== undefined ? safeScreenState.cornerRadius : 36;
  const imageZoomScale = (safeScreenState.imageZoom !== undefined ? safeScreenState.imageZoom : 100) / 100;

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
          <span className="font-semibold text-sm">Drop image here to upload</span>
        </div>
      )}

      {/* Floating Footer Bar — bottom center of canvas */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-zinc-900/80 backdrop-blur-md border border-zinc-700/60 rounded-2xl px-3 py-2 shadow-2xl">

        {/* Add single screen */}
        <button
          onClick={onAddScreen}
          className="flex items-center gap-2 h-9 px-4 bg-emerald-500 text-white rounded-xl font-semibold text-xs hover:bg-emerald-400 hover:scale-105 active:scale-95 transition-all duration-150 shadow-md"
          title="New Screen"
        >
          <Plus className="w-4 h-4" />
          New Screen
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
          title="Create screens from multiple images"
        >
          <Images className="w-4 h-4 text-blue-400" />
          Import Screenshots
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
          title="Zoom Out (-)"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <span className="font-mono text-xs font-semibold px-2 py-0.5 text-zinc-300 min-w-[48px] text-center">
          {Math.round(scale * 100)}%
        </span>

        <button
          onClick={() => setScale(s => Math.min(2.5, s * 1.15))}
          className="p-1 rounded-xl hover:bg-zinc-800 hover:text-white transition"
          title="Zoom In (+)"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-4 bg-zinc-800 mx-0.5" />

        <button
          onClick={handleResetView}
          className="p-1 rounded-xl hover:bg-zinc-800 hover:text-white transition"
          title="Reset View"
        >
          <RotateCcw className="w-4 h-4 text-zinc-400" />
        </button>

        <div className="w-[1px] h-4 bg-zinc-800 mx-0.5" />

        <div className="flex items-center gap-1 px-2 py-0.5 text-[11px] text-zinc-400 font-medium">
          <Move className="w-3 h-3 text-zinc-500" />
          <span>Space / Ctrl + Drag</span>
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
          <div ref={gridRef} className="flex flex-nowrap items-center justify-start gap-x-10 overflow-x-auto no-scrollbar p-4">
            {screens.map((sc, idx) => {
              const isCurrentActive = activeScreenIndex === idx;
              const isDragging = draggedIdx === idx;
              const isDropTarget = dropTargetIdx === idx && draggedIdx !== idx;
              const scCornerRadius = sc.cornerRadius !== undefined ? sc.cornerRadius : 36;
              const previewCornerRadius = Math.round((scCornerRadius / 4.2) * 1.5);
              const scZoomScale = (sc.imageZoom !== undefined ? sc.imageZoom : 100) / 100;
              const textPos = sc.textPosition || 'top';
              const isBottomText = textPos === 'bottom';
              const isNoText = textPos === 'none';
              const scImageFit = sc.imageFit || 'cover';

              return (
                <div
                  key={sc.id || idx}
                  ref={(el) => (screenRefs.current[idx] = el)}
                  draggable={!isPanning && !isSpacePressed}
                  onDragStart={(e) => handleScreenDragStart(e, idx)}
                  onDragOver={(e) => handleScreenDragOver(e, idx)}
                  onDrop={(e) => handleScreenDrop(e, idx)}
                  onDragEnd={handleScreenDragEnd}
                  onClick={() => { onSelectScreen(idx); }}
                  className={`group relative flex flex-col items-center gap-6 cursor-pointer transition-all duration-200 ${
                    isDragging ? 'opacity-30 scale-95' : 'hover:scale-[1.02]'
                  } ${
                    isDropTarget ? 'scale-105 ring-4 ring-sky-400/50 rounded-3xl p-3 bg-sky-500/10' : ''
                  }`}
                >
                  {/* Title Badge + Reorder + Delete Button Row */}
                  <div className="flex items-center gap-1.5 z-10">
                    {idx > 0 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onReorderScreens && onReorderScreens(idx, idx - 1);
                        }}
                        className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-500 text-zinc-400 hover:text-white transition-all shadow-md"
                        title="Move screen left"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <div className={`bg-zinc-900/95 backdrop-blur-md border px-3.5 py-1 rounded-full text-xs font-bold text-zinc-200 shadow-md flex items-center gap-2 transition cursor-grab active:cursor-grabbing ${
                      isCurrentActive ? 'border-white text-white ring-2 ring-white/20' : 'border-zinc-800 group-hover:border-zinc-500'
                    }`}>
                      <GripVertical className="w-3.5 h-3.5 text-zinc-400" />
                      <span className="font-mono text-zinc-400">#{idx + 1}</span>
                      <span>{sc.title || `Screen ${idx + 1}`}</span>
                    </div>

                    {idx < screens.length - 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onReorderScreens && onReorderScreens(idx, idx + 1);
                        }}
                        className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-500 text-zinc-400 hover:text-white transition-all shadow-md"
                        title="Move screen right"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {screens.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onDeleteScreen(idx); }}
                        className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 hover:bg-red-600 hover:border-red-600 text-zinc-400 hover:text-white transition-all shadow-md ml-0.5"
                        title="Delete screen"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Rendered Mockup Card */}
                  <div className="relative">
                    {/* Active Selection Animated Dashed Ring Overlay */}
                    {isCurrentActive && (
                      <div className="absolute -inset-[11px] pointer-events-none z-30">
                        <svg className="w-full h-full" style={{ overflow: 'visible' }}>
                          <rect
                            x="0"
                            y="0"
                            width="100%"
                            height="100%"
                            rx={previewCornerRadius + 11}
                            ry={previewCornerRadius + 11}
                            fill="none"
                            stroke="#FFFFFF"
                            strokeWidth="2"
                            strokeDasharray="8 6"
                            className="animate-marching-ants"
                          />
                        </svg>
                      </div>
                    )}

                    <div
                      className="relative overflow-hidden flex flex-col shadow-2xl transition-all duration-200"
                      style={{
                        width: `${preset.width / 4.2}px`,
                        height: `${preset.height / 4.2}px`,
                        borderRadius: `${previewCornerRadius}px`,
                        paddingTop: isNoText ? '16px' : isBottomText ? '0px' : '16px',
                        paddingLeft: '16px',
                        paddingRight: '16px',
                        paddingBottom: isNoText ? '16px' : isBottomText ? '16px' : '0px',
                        ...getBackgroundPatternStyle(sc),
                        fontFamily: sc.fontFamily || "'Inter', sans-serif"
                      }}
                    >
                    {/* Headline - TOP */}
                    {!isNoText && !isBottomText && (
                      <div className={`z-10 shrink-0 flex flex-col ${getAlignmentClass(sc.textAlign)} gap-1 w-full mb-3`}>
                        {sc.headline && (
                          <h1
                            className="tracking-tight leading-tight transition-all whitespace-pre-wrap break-words [word-break:break-word] [overflow-wrap:anywhere]"
                            style={{
                              fontFamily: sc.fontFamily || "'Inter', sans-serif",
                              color: sc.headlineColor || '#000000',
                              fontSize: `${Math.max(18, (sc.headlineSize || 48) * 0.52)}px`,
                              fontWeight: sc.headlineWeight || '700'
                            }}
                          >
                            {sc.headline}
                          </h1>
                        )}
                      </div>
                    )}

                    {/* Screenshot Device Mockup Center Container */}
                    <div className={`flex-1 w-full min-h-0 relative flex items-center justify-center overflow-hidden ${
                      isBottomText ? 'mb-2' : isNoText ? 'my-auto' : 'mt-auto'
                    }`}>
                      <div
                        className="w-full h-full relative overflow-hidden transition-all duration-300 shadow-xl flex flex-col"
                        style={{
                          borderRadius: `${previewCornerRadius}px`,
                          backgroundColor: '#000000'
                        }}
                      >
                        {sc.imageSrc ? (
                          <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
                            <img
                              src={sc.imageSrc}
                              alt={sc.title || 'Screen screenshot'}
                              className="w-full h-full transition-transform duration-200 pointer-events-none"
                              style={{
                                objectFit: scImageFit,
                                transform: `scale(${scZoomScale})`,
                                transformOrigin: 'center center'
                              }}
                            />
                          </div>
                        ) : (
                          <div className="w-full h-full bg-gradient-to-b from-zinc-800 to-zinc-900 text-white flex flex-col items-center justify-center text-center p-3 select-none border border-white/10">
                            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center mb-1.5 text-zinc-300">
                              <Upload className="w-4 h-4" />
                            </div>
                            <span className="text-[11px] font-semibold text-zinc-300">Upload Screenshot</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Headline - BOTTOM */}
                    {!isNoText && isBottomText && (
                      <div className={`z-10 shrink-0 flex flex-col ${getAlignmentClass(sc.textAlign)} gap-1 w-full mt-3 mb-0`}>
                        {sc.headline && (
                          <h1
                            className="tracking-tight leading-tight transition-all whitespace-pre-wrap break-words [word-break:break-word] [overflow-wrap:anywhere]"
                            style={{
                              fontFamily: sc.fontFamily || "'Inter', sans-serif",
                              color: sc.headlineColor || '#000000',
                              fontSize: `${Math.max(18, (sc.headlineSize || 48) * 0.52)}px`,
                              fontWeight: sc.headlineWeight || '700'
                            }}
                          >
                            {sc.headline}
                          </h1>
                        )}
                      </div>
                    )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Add Screen Button Card on Canvas Grid */}
            <button
              type="button"
              onClick={onAddScreen}
              className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 hover:border-zinc-500 rounded-3xl bg-zinc-900/40 hover:bg-zinc-900/80 text-zinc-400 hover:text-white transition-all p-8 gap-3 cursor-pointer shrink-0 self-center"
              style={{
                width: `${preset.width / 4.2}px`,
                height: `${preset.height / 4.2}px`
              }}
            >
              <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                <Plus className="w-6 h-6 text-zinc-200" />
              </div>
              <span className="text-sm font-bold text-zinc-300">New Screen</span>
            </button>
          </div>
        </div>

        {/* HIDDEN EXPORT NODE: HIGH RESOLUTION CANVAS FOR EXPORTING ONLY */}
        {(() => {
          const expTextPos = safeScreenState.textPosition || 'top';
          const isExpBottom = expTextPos === 'bottom';
          const isExpNone = expTextPos === 'none';
          const expImageFit = safeScreenState.imageFit || 'cover';
          const exportCornerRadius = Math.round((imageCornerRadius / 2.8) * 1.5);

          return (
            <div className="pointer-events-none flex items-center justify-center" style={{ position: 'fixed', top: '-9999px', left: '-9999px', zIndex: -1 }}>
              <div
                ref={canvasRef}
                className="relative overflow-hidden flex flex-col"
                style={{
                  width: `${preset.width / 2.8}px`,
                  height: `${preset.height / 2.8}px`,
                  paddingTop: isExpNone ? '24px' : isExpBottom ? '0px' : '24px',
                  paddingLeft: '20px',
                  paddingRight: '20px',
                  paddingBottom: isExpNone ? '24px' : isExpBottom ? '24px' : '0px',
                  ...getBackgroundPatternStyle(screenState),
                  fontFamily: screenState?.fontFamily || "'Inter', sans-serif"
                }}
              >
                {/* TOP HEADLINE */}
                {!isExpNone && !isExpBottom && (
                  <div
                    className={`z-10 shrink-0 flex flex-col ${getAlignmentClass(screenState?.textAlign)} w-full mb-4`}
                    style={{ gap: '6px' }}
                  >
                    {screenState?.headline && (
                      <h1
                        className="tracking-tight leading-tight whitespace-pre-wrap break-words [word-break:break-word] [overflow-wrap:anywhere]"
                        style={{
                          fontFamily: screenState?.fontFamily || "'Inter', sans-serif",
                          color: screenState?.headlineColor || '#000000',
                          fontSize: `${Math.max(28, (screenState?.headlineSize || 48) * 0.78)}px`,
                          fontWeight: screenState?.headlineWeight || '700'
                        }}
                      >
                        {screenState.headline}
                      </h1>
                    )}
                  </div>
                )}

                {/* SCREENSHOT */}
                <div className={`w-full flex-1 min-h-0 flex justify-center relative z-10 overflow-hidden ${isExpNone ? 'items-center' : 'items-end'}`}>
                  <div
                    className="w-full h-full overflow-hidden flex items-center justify-center"
                    style={{
                      ...(isExpNone ? {
                        borderRadius: `${exportCornerRadius}px`,
                      } : isExpBottom ? {
                        borderTopLeftRadius: '0px',
                        borderTopRightRadius: '0px',
                        borderBottomLeftRadius: `${exportCornerRadius}px`,
                        borderBottomRightRadius: `${exportCornerRadius}px`,
                      } : {
                        borderTopLeftRadius: `${exportCornerRadius}px`,
                        borderTopRightRadius: `${exportCornerRadius}px`,
                        borderBottomLeftRadius: '0px',
                        borderBottomRightRadius: '0px',
                      })
                    }}
                  >
                    {screenState?.imageSrc && typeof screenState.imageSrc === 'string' && screenState.imageSrc.trim() !== '' ? (
                      <img
                        src={screenState.imageSrc}
                        alt="App Screenshot"
                        className={`w-full h-full transition-transform duration-150 ${
                          expImageFit === 'contain'
                            ? (isExpBottom ? 'object-contain object-bottom origin-bottom' : 'object-contain object-top origin-top')
                            : (isExpBottom ? 'object-cover object-bottom origin-bottom' : 'object-cover object-top origin-top')
                        }`}
                        style={{ transform: `scale(${imageZoomScale})` }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-b from-zinc-800 to-zinc-900 text-white flex flex-col items-center justify-center text-center select-none border border-white/5">
                        <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-white shadow-sm">
                          <Upload className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* BOTTOM HEADLINE */}
                {!isExpNone && isExpBottom && (
                  <div
                    className={`z-10 shrink-0 flex flex-col ${getAlignmentClass(screenState?.textAlign)} w-full mt-4`}
                    style={{ gap: '6px' }}
                  >
                    {screenState?.headline && (
                      <h1
                        className="tracking-tight leading-tight whitespace-pre-wrap break-words [word-break:break-word] [overflow-wrap:anywhere]"
                        style={{
                          fontFamily: screenState?.fontFamily || "'Inter', sans-serif",
                          color: screenState?.headlineColor || '#000000',
                          fontSize: `${Math.max(28, (screenState?.headlineSize || 48) * 0.78)}px`,
                          fontWeight: screenState?.headlineWeight || '700'
                        }}
                      >
                        {screenState.headline}
                      </h1>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
