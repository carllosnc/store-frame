import React, { useState, useRef } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import CanvasArea from './components/CanvasArea';

import { STORE_PRESETS } from './constants/dimensions';
import { downloadSingleScreen, downloadZipBundle, captureCanvasToPng } from './utils/exporter';

export default function App() {
  const [activePreset, setActivePreset] = useState(STORE_PRESETS[0]);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState('');


  const createInitialScreenState = (title = 'Tela 1', headlineText = 'Conecte-se com amigos', bgHex = '#44C0FE') => ({
    id: `screen-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
    title: title,
    headline: headlineText,
    headlineSize: 48,
    headlineColor: '#000000',
    headlineWeight: '900',
    subtitle: '',
    subtitleColor: '#18181B',
    bgColor: bgHex,
    cornerRadius: 36,
    textPosition: 'top',
    textAlign: 'center',
    fontFamily: "'Inter', sans-serif",
    imageSrc: null,
    imageFit: 'cover'
  });

  const [screens, setScreens] = useState([
    createInitialScreenState('Tela 1 — Início', 'Conecte-se com amigos', '#44C0FE'),
    createInitialScreenState('Tela 2 — Destaques', 'Compartilhe momentos', '#10B981'),
    createInitialScreenState('Tela 3 — Perfil', 'Crie sua comunidade', '#FF6B6B')
  ]);

  const [activeScreenIndex, setActiveScreenIndex] = useState(0);
  const canvasRef = useRef(null);

  const defaultFallbackScreen = createInitialScreenState('Tela 1', 'Conecte-se com amigos', '#44C0FE');
  const activeScreen = (screens && screens.length > 0)
    ? (screens[activeScreenIndex] || screens[0] || defaultFallbackScreen)
    : defaultFallbackScreen;

  const handleUpdateScreenState = (field, value) => {
    setScreens(prev => {
      if (!prev || prev.length === 0) return prev;
      const targetIndex = Math.min(Math.max(0, activeScreenIndex), prev.length - 1);
      const updated = [...prev];
      if (updated[targetIndex]) {
        updated[targetIndex] = {
          ...updated[targetIndex],
          [field]: value
        };
      }
      return updated;
    });
  };

  const handleImageDrop = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        handleUpdateScreenState('imageSrc', event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBulkImageUpload = (files) => {
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files);
    const currentStyle = screens[activeScreenIndex] || screens[0];

    fileArray.forEach((file, i) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const newScreen = createInitialScreenState(
          `Tela ${screens.length + i + 1}`,
          `Título da Tela ${screens.length + i + 1}`,
          currentStyle.bgColor || '#44C0FE'
        );
        newScreen.imageSrc = ev.target.result;
        setScreens(prev => [...prev, newScreen]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddScreen = () => {
    const newIndex = screens.length + 1;
    const newScreen = createInitialScreenState(`Tela ${newIndex}`, `Título da Tela ${newIndex}`, '#2563EB');
    setScreens(prev => [...prev, newScreen]);
    setActiveScreenIndex(screens.length);
  };

  // Clean duplication function that prevents stacking (Cópia) (Cópia)
  const handleDuplicateScreen = () => {
    const rawTitle = activeScreen.title || 'Tela';
    const baseTitle = rawTitle.replace(/\s*\(Cópia(?:\s+\d+)?\)$/gi, '').trim();

    // Count how many copies already exist for this base title
    const existingCopies = screens.filter(sc => {
      const scBase = (sc.title || '').replace(/\s*\(Cópia(?:\s+\d+)?\)$/gi, '').trim();
      return scBase === baseTitle && sc.title.toLowerCase().includes('cópia');
    });

    const nextCopyNumber = existingCopies.length + 1;
    const newTitle = nextCopyNumber === 1 
      ? `${baseTitle} (Cópia)`
      : `${baseTitle} (Cópia ${nextCopyNumber})`;

    const newScreen = {
      ...activeScreen,
      id: `screen-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      title: newTitle
    };

    setScreens(prev => [...prev, newScreen]);
    setActiveScreenIndex(screens.length);
  };

  const handleDeleteScreen = (indexToDelete) => {
    if (screens.length <= 1) return;
    setScreens(prev => prev.filter((_, idx) => idx !== indexToDelete));
    if (activeScreenIndex >= screens.length - 1) {
      setActiveScreenIndex(Math.max(0, screens.length - 2));
    }
  };

  const handleSyncStyles = () => {
    const styleSource = activeScreen;
    setScreens(prev =>
      prev.map(sc => ({
        ...sc,
        bgColor: styleSource.bgColor,
        cornerRadius: styleSource.cornerRadius,
        fontFamily: styleSource.fontFamily,
        headlineColor: styleSource.headlineColor,
        headlineSize: styleSource.headlineSize
      }))
    );
  };

  const handleExportSingle = async () => {
    try {
      setIsExporting(true);
      
      setExportProgress('Gerando imagem da loja em alta definição...');
      await downloadSingleScreen(canvasRef.current, activePreset, activeScreen.title);
    } catch (err) {
      console.error('Erro ao exportar tela:', err);
      alert('Erro ao gerar imagem.');
    } finally {
      setIsExporting(false);
      setExportProgress('');
    }
  };

  const handleExportZip = async () => {
    try {
      setIsExporting(true);
      const originalIndex = activeScreenIndex;

      const renderScreenFn = async (index) => {
        setExportProgress(`Renderizando tela ${index + 1} de ${screens.length}...`);
        setActiveScreenIndex(index);
        await new Promise(r => setTimeout(r, 400));
        return await captureCanvasToPng(canvasRef.current, activePreset);
      };

      await downloadZipBundle(screens, activePreset, renderScreenFn);
      
      setActiveScreenIndex(originalIndex);
    } catch (err) {
      console.error('Erro ao exportar ZIP:', err);
      alert('Erro ao gerar arquivo ZIP.');
    } finally {
      setIsExporting(false);
      setExportProgress('');
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-zinc-950 text-zinc-50 font-sans">
      <Header
        activePreset={activePreset}
        onSelectPreset={setActivePreset}
        onExportSingle={handleExportSingle}
        onExportZip={handleExportZip}
        isExporting={isExporting}
        screensCount={screens.length}
        onDuplicateScreen={handleDuplicateScreen}
        onSyncStyles={handleSyncStyles}
      />

      {isExporting && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-2xl flex flex-col items-center gap-3 max-w-xs text-center">
            <div className="w-10 h-10 rounded-full border-4 border-white border-t-transparent animate-spin"></div>
            <div className="text-sm font-bold text-white">Exportando para Lojas</div>
            <p className="text-xs text-zinc-400">{exportProgress || 'Processando renderização...'}</p>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        <Sidebar
          activePreset={activePreset}
          onSelectPreset={setActivePreset}
          screenState={activeScreen}
          onUpdateScreenState={handleUpdateScreenState}
          onBulkImageUpload={handleBulkImageUpload}
        />

        <CanvasArea
          preset={activePreset}
          screenState={activeScreen}
          screens={screens}
          activeScreenIndex={activeScreenIndex}
          onSelectScreen={setActiveScreenIndex}
          onAddScreen={handleAddScreen}
          onDeleteScreen={handleDeleteScreen}
          canvasRef={canvasRef}
          onImageDrop={handleImageDrop}
          onBulkImageUpload={handleBulkImageUpload}
        />
      </div>

      
    </div>
  );
}
