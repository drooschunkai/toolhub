import React, { useState, useRef, useEffect } from 'react';
import { Upload, Crop, ShieldCheck, RefreshCw, Layers } from 'lucide-react';

export default function ImageCropper() {
  const [file, setFile] = useState<File | null>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<string>('1:1');
  
  // Crop offsets as percentages to remain responsive
  const [cropX, setCropX] = useState<number>(10);
  const [cropY, setCropY] = useState<number>(10);
  const [cropW, setCropW] = useState<number>(80);
  const [cropH, setCropH] = useState<number>(80);

  const [croppedSrc, setCroppedSrc] = useState<string | null>(null);
  const [cropping, setCropping] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Adjust crop aspect ratio limits when aspect ratio changes
  useEffect(() => {
    if (aspectRatio === '1:1') {
      const minDim = Math.min(cropW, cropH);
      setCropW(minDim);
      setCropH(minDim);
    } else if (aspectRatio === '16:9') {
      const newH = Math.round(cropW * 9 / 16);
      setCropH(newH > 100 - cropY ? 100 - cropY : newH);
    } else if (aspectRatio === '4:3') {
      const newH = Math.round(cropW * 3 / 4);
      setCropH(newH > 100 - cropY ? 100 - cropY : newH);
    }
  }, [aspectRatio]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setImgSrc(URL.createObjectURL(selected));
      setCroppedSrc(null);
    }
  };

  const handleCrop = () => {
    if (!imgRef.current) return;
    setCropping(true);

    const img = imgRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // Calculate pixel coordinates of original image
      const naturalWidth = img.naturalWidth;
      const naturalHeight = img.naturalHeight;

      const pxX = (cropX / 100) * naturalWidth;
      const pxY = (cropY / 100) * naturalHeight;
      const pxW = (cropW / 100) * naturalWidth;
      const pxH = (cropH / 100) * naturalHeight;

      canvas.width = pxW;
      canvas.height = pxH;

      ctx.drawImage(img, pxX, pxY, pxW, pxH, 0, 0, pxW, pxH);
      const cropped = canvas.toDataURL(file?.type || 'image/png');
      setCroppedSrc(cropped);
    }
    setCropping(false);
  };

  const downloadCropped = () => {
    if (!croppedSrc || !file) return;
    const link = document.createElement('a');
    const ext = file.type.split('/')[1] || 'png';
    link.download = `${file.name.substring(0, file.name.lastIndexOf('.')) || file.name}_cropped.${ext}`;
    link.href = croppedSrc;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-accent-cyan text-glow">Image Cropper</h3>
        <span className="text-xs text-text-desc font-mono">CLIENT-SIDE CROPPER</span>
      </div>

      {!imgSrc ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-accent-cyan/20 hover:border-accent-cyan/80 bg-nav-bg/40 rounded-xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-4 min-h-[180px]"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <Crop className="w-10 h-10 text-accent-cyan/60 pulse-glower" />
          <div>
            <p className="text-white text-sm font-medium">Click to upload image to crop</p>
            <p className="text-xs text-text-desc mt-0.5">Crop with precise dimensions immediately</p>
          </div>
        </div>
      ) : (
        <div className="bg-nav-bg/60 p-4 rounded-lg border border-accent-cyan/10 space-y-4">
          <div className="relative border border-white/10 rounded-lg overflow-hidden bg-black/40 flex items-center justify-center min-h-[250px] max-h-[400px]">
            {/* The Source image with overlay crop box */}
            <img
              ref={imgRef}
              src={imgSrc}
              alt="Source canvas"
              className="max-h-[380px] object-contain relative"
              crossOrigin="anonymous"
            />
            {/* Visual crop box overlays the image */}
            <div
              className="absolute border-2 border-accent-cyan bg-accent-cyan/10 glow-cyan pointer-events-none"
              style={{
                left: `${cropX}%`,
                top: `${cropY}%`,
                width: `${cropW}%`,
                height: `${cropH}%`
              }}
            >
              <div className="absolute top-0 left-0 bg-accent-cyan text-[10px] text-black font-bold p-0.5 px-1 rounded-br">
                CROP AREA
              </div>
            </div>
          </div>

          {/* Configuration and controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="text-xs font-mono text-text-desc block">Select Preset Aspect Ratio:</label>
              <div className="flex flex-wrap gap-2">
                {['1:1', '16:9', '4:3', 'Free Form'].map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    className={`px-3 py-1.5 text-xs font-bold rounded cursor-pointer transition-all ${
                      aspectRatio === ratio
                        ? 'bg-accent-cyan text-black shadow'
                        : 'bg-main-bg border border-accent-cyan/20 text-white hover:border-accent-cyan/60'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>

              {/* Sliders for offsets */}
              <div className="space-y-2 pt-2 text-xs">
                <div className="flex justify-between font-mono">
                  <span className="text-text-desc">X Shift</span>
                  <span className="text-accent-cyan">{cropX}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={100 - cropW}
                  value={cropX}
                  onChange={(e) => setCropX(Number(e.target.value))}
                  className="w-full accent-accent-cyan cursor-pointer"
                />

                <div className="flex justify-between font-mono">
                  <span className="text-text-desc">Y Shift</span>
                  <span className="text-accent-cyan">{cropY}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={100 - cropH}
                  value={cropY}
                  onChange={(e) => setCropY(Number(e.target.value))}
                  className="w-full accent-accent-cyan cursor-pointer"
                />
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between font-mono">
                <span className="text-text-desc">Crop Width</span>
                <span className="text-accent-cyan">{cropW}%</span>
              </div>
              <input
                type="range"
                min="10"
                max={100 - cropX}
                value={cropW}
                className="w-full accent-accent-cyan cursor-pointer"
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setCropW(val);
                  if (aspectRatio === '1:1') setCropH(val);
                  else if (aspectRatio === '16:9') {
                    const newH = Math.round(val * 9 / 16);
                    setCropH(newH > 100 - cropY ? 100 - cropY : newH);
                  } else if (aspectRatio === '4:3') {
                    const newH = Math.round(val * 3 / 4);
                    setCropH(newH > 100 - cropY ? 100 - cropY : newH);
                  }
                }}
              />

              <div className="flex justify-between font-mono">
                <span className="text-text-desc">Crop Height</span>
                <span className="text-accent-cyan">{cropH}%</span>
              </div>
              <input
                type="range"
                min="10"
                max={100 - cropY}
                value={cropH}
                disabled={aspectRatio !== 'Free Form'}
                className="w-full accent-accent-cyan cursor-pointer disabled:opacity-40"
                onChange={(e) => setCropH(Number(e.target.value))}
              />

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-3">
                <button
                  onClick={handleCrop}
                  disabled={cropping}
                  className="flex-1 bg-accent-cyan hover:bg-accent-alt text-black font-bold py-2 rounded transition-all flex items-center justify-center space-x-1 uppercase text-xs"
                >
                  <Crop className="w-3.5 h-3.5" />
                  <span>Preview Crop</span>
                </button>
                <button
                  onClick={() => {
                    setImgSrc(null);
                    setCroppedSrc(null);
                    setCropX(10);
                    setCropY(10);
                    setCropW(80);
                    setCropH(80);
                  }}
                  className="px-3 bg-red-500/10 hover:bg-red-500/30 text-red-400 font-bold border border-red-500/30 rounded text-xs"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Result preview */}
          {croppedSrc && (
            <div className="border-t border-accent-cyan/15 pt-4 space-y-3">
              <h4 className="text-xs font-mono text-glow text-accent-cyan">Result Preview</h4>
              <div className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-3 sm:space-y-0 bg-main-bg/40 p-3 rounded border border-white/5">
                <img src={croppedSrc} alt="Cropped output" className="max-h-36 rounded border border-accent-cyan/30 shadow-md object-contain" />
                <div className="space-y-2 flex-1">
                  <p className="text-xs text-text-desc font-mono">Image sliced successfully relative to element resolution. Perfect for avatars, banners or specific dimensions.</p>
                  <button
                    onClick={downloadCropped}
                    className="w-full sm:w-auto px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-bold rounded text-xs uppercase"
                  >
                    Download Crop
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
