import React from 'react';
import { Wifi, Battery, Signal, ImagePlus } from 'lucide-react';

export default function DeviceFrame({
  deviceType = 'iphone-16-pro',
  deviceColor = 'titanium-natural',
  imageSrc,
  scale = 100,
  offsetY = 0,
  rotation = 0,
  shadowStrength = 'soft',
  showReflection = false,
  fitMode = 'cover',
  activeColorConfig
}) {
  const renderFallbackScreen = () => (
    <div className="w-full h-full bg-[#0F1015] text-white p-8 flex flex-col items-center justify-center text-center font-sans select-none group border border-white/5">
      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-3 text-slate-400 group-hover:text-white group-hover:scale-105 transition-all">
        <ImagePlus className="w-6 h-6" />
      </div>
      <h3 className="text-xs font-semibold text-white tracking-tight">Carregar Imagem</h3>
      <p className="text-[11px] text-slate-400 max-w-[180px] mt-1">
        Clique ou solte a imagem aqui
      </p>
    </div>
  );

  const getShadowStyle = () => {
    switch (shadowStrength) {
      case 'soft':
        return 'drop-shadow(0 20px 30px rgba(0, 0, 0, 0.25))';
      case 'deep':
        return 'drop-shadow(0 35px 50px rgba(0, 0, 0, 0.50))';
      case 'heavy':
        return 'drop-shadow(0 50px 75px rgba(0, 0, 0, 0.75))';
      case 'none':
      default:
        return 'none';
    }
  };

  const bodyColor = activeColorConfig?.body || '#2A2928';
  const bezelColor = activeColorConfig?.bezel || '#000000';

  if (deviceType === 'frameless') {
    return (
      <div
        className="relative transition-all duration-300 ease-out flex items-center justify-center select-none"
        style={{
          transform: `scale(${scale / 100}) translateY(${offsetY}px) rotate(${rotation}deg)`,
          filter: getShadowStyle()
        }}
      >
        <div className="relative w-[300px] h-[630px] sm:w-[340px] sm:h-[710px] rounded-[32px] overflow-hidden bg-black ring-1 ring-white/10 flex items-center justify-center">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt="App Screenshot"
              className={`w-full h-full transition-all ${
                fitMode === 'contain' ? 'object-contain' : fitMode === 'fill' ? 'object-fill' : 'object-cover'
              }`}
            />
          ) : (
            renderFallbackScreen()
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative transition-all duration-300 ease-out flex items-center justify-center select-none"
      style={{
        transform: `scale(${scale / 100}) translateY(${offsetY}px) rotate(${rotation}deg)`,
        filter: getShadowStyle()
      }}
    >
      <div
        className="relative overflow-hidden rounded-[50px] p-[10px] sm:p-[12px] flex items-center justify-center transition-all ring-1 ring-white/15"
        style={{ backgroundColor: bodyColor }}
      >
        <div
          className="relative overflow-hidden rounded-[40px] flex flex-col justify-between"
          style={{ backgroundColor: bezelColor }}
        >
          {deviceType.includes('iphone') && (
            <>
              <div className="absolute top-3 left-1/2 -translate-x-1/2 z-40 w-28 h-5.5 bg-black rounded-full flex items-center justify-between px-3 border border-slate-900">
                <div className="w-2.5 h-2.5 rounded-full bg-[#111] border border-slate-800"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#091526]"></div>
              </div>

              <div className="absolute top-3 inset-x-0 z-30 flex justify-between items-center px-7 text-[10px] font-semibold text-white/90 pointer-events-none tracking-tight">
                <span>9:41</span>
                <div className="flex items-center gap-1.5 text-white/90">
                  <Signal className="w-3 h-3" />
                  <Wifi className="w-3 h-3" />
                  <Battery className="w-3.5 h-3.5" />
                </div>
              </div>
            </>
          )}

          <div className="relative w-[300px] h-[630px] sm:w-[340px] sm:h-[710px] rounded-[36px] overflow-hidden bg-black flex items-center justify-center">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt="App Screenshot"
                className={`w-full h-full transition-all ${
                  fitMode === 'contain' ? 'object-contain' : fitMode === 'fill' ? 'object-fill' : 'object-cover'
                }`}
              />
            ) : (
              renderFallbackScreen()
            )}

            {showReflection && (
              <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-tr from-transparent via-white/8 to-white/4 opacity-40"></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
