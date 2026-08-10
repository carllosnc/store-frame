import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

/**
 * Render a DOM canvas element to a PNG Blob/DataURL at high precision
 */
export async function captureCanvasToPng(canvasElement, preset) {
  if (!canvasElement) throw new Error('Canvas element not found');

  // Calculate required pixel ratio scale to reach target store width exactly
  const currentRenderWidth = canvasElement.offsetWidth;
  const targetWidth = preset.width;
  const pixelRatio = targetWidth / currentRenderWidth;

  const dataUrl = await toPng(canvasElement, {
    pixelRatio: Math.max(1.5, pixelRatio),
    cacheBust: true,
    style: {
      transform: 'none',
      transformOrigin: 'top left'
    }
  });

  return dataUrl;
}

/**
 * Export a single screen PNG file directly to user download
 */
export async function downloadSingleScreen(canvasElement, preset, screenTitle = 'mockup') {
  const dataUrl = await captureCanvasToPng(canvasElement, preset);
  const sanitizedTitle = screenTitle.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const filename = `${preset.id}-${sanitizedTitle}-${preset.width}x${preset.height}.png`;
  
  saveAs(dataUrl, filename);
}

/**
 * Export all screens in project as a ZIP bundle
 */
export async function downloadZipBundle(screens, preset, renderScreenFn) {
  const zip = new JSZip();
  const folder = zip.folder(`${preset.id}-mockups`);

  for (let i = 0; i < screens.length; i++) {
    const screen = screens[i];
    const dataUrl = await renderScreenFn(i);
    if (dataUrl) {
      // Remove base64 header
      const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
      const num = String(i + 1).padStart(2, '0');
      const sanitizedTitle = (screen.title || `screen-${i+1}`).toLowerCase().replace(/[^a-z0-9]/g, '-');
      folder.file(`${num}_${sanitizedTitle}_${preset.width}x${preset.height}.png`, base64Data, { base64: true });
    }
  }

  // Yield to browser UI before CPU-intensive zip blob generation
  await new Promise(r => setTimeout(r, 50));

  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, `store-frame-${preset.id}-bundle.zip`);
}
