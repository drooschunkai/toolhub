import React, { useState, useRef } from 'react';
import { Upload, Sliders, CheckCircle, RefreshCw, FileText } from 'lucide-react';

export default function ImageCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState<number>(75);
  const [scale, setScale] = useState<number>(100);
  const [compressedSrc, setCompressedSrc] = useState<string | null>(null);
  const [originalSrc, setOriginalSrc] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [compressing, setCompressing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setOriginalSize(selected.size);
      const url = URL.createObjectURL(selected);
      setOriginalSrc(url);
      setCompressedSrc(null);
      setCompressedSize(0);
    }
  };

  const handleCompress = () => {
    if (!file) return;
    setCompressing(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const finalWidth = img.width * (scale / 100);
        const finalHeight = img.height * (scale / 100);
        canvas.width = finalWidth;
        canvas.height = finalHeight;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, finalWidth, finalHeight);
          // Compress to JPEG/WebP to apply quality reductions
          const mime = file.type === 'image/png' ? 'image/jpeg' : file.type;
          const compressed = canvas.toDataURL(mime, quality / 100);
          setCompressedSrc(compressed);

          // Estimate file size based on Base64 encoding
          const head = `data:${mime};base64,`;
          const approximateSize = Math.round((compressed.length - head.length) * 3 / 4);
          setCompressedSize(approximateSize);
        }
        setCompressing(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const downloadCompressed = () => {
    if (!compressedSrc || !file) return;
    const link = document.createElement('a');
    let ext = file.type.split('/')[1] || 'jpg';
    if (ext === 'jpeg') ext = 'jpg';
    link.download = `${file.name.substring(0, file.name.lastIndexOf('.')) || file.name}_compressed.${ext}`;
    link.href = compressedSrc;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-accent-cyan text-glow">Image Compressor</h3>
        <span className="text-xs text-text-desc font-mono">ADJUST QUALITY • SIZE</span>
      </div>

      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-accent-cyan/20 hover:border-accent-cyan/80 bg-nav-bg/40 rounded-xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-4 min-h-[160px]"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        {originalSrc ? (
          <div className="relative group max-w-xs">
            <img src={originalSrc} alt="Original preview" className="rounded-lg max-h-40 object-contain shadow-md" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg">
              <span className="text-white text-sm font-semibold">Change Image</span>
            </div>
          </div>
        ) : (
          <>
            <Upload className="w-10 h-10 text-accent-cyan/60 pulse-glower" />
            <div>
              <p className="text-white text-sm font-medium">Click to upload image to compress</p>
              <p className="text-xs text-text-desc mt-0.5">Adjust quality & dimensions client-side</p>
            </div>
          </>
        )}
      </div>

      {file && (
        <div className="bg-nav-bg/60 p-4 rounded-lg border border-accent-cyan/10 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sliders */}
            <div className="space-y-3 p-3 bg-main-bg/50 rounded border border-white/5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-desc flex items-center space-x-1">
                  <Sliders className="w-3.5 h-3.5 text-accent-cyan" />
                  <span>Compression Quality</span>
                </span>
                <span className="text-accent-cyan font-mono font-bold">{quality}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-accent-cyan cursor-pointer"
              />

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-text-desc">Scale Factor (Resize)</span>
                <span className="text-accent-cyan font-mono font-bold">{scale}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                className="w-full accent-accent-cyan cursor-pointer"
              />
            </div>

            {/* Metrics */}
            <div className="flex flex-col justify-center space-y-3 p-3 bg-main-bg/50 rounded border border-white/5 font-mono text-sm">
              <div className="flex justify-between">
                <span className="text-text-desc">Original:</span>
                <span className="text-white">{(originalSize / 1024).toFixed(1)} KB</span>
              </div>
              {compressedSize > 0 && (
                <>
                  <div className="flex justify-between">
                    <span className="text-text-desc">Compressed:</span>
                    <span className="text-accent-cyan">{(compressedSize / 1024).toFixed(1)} KB</span>
                  </div>
                  <div className="flex justify-between border-t border-white/10 pt-1.5 text-xs">
                    <span className="text-text-desc">Size Reduced:</span>
                    <span className="text-emerald-400 font-bold">
                      {Math.max(0, Math.round((1 - compressedSize / originalSize) * 100))}%
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleCompress}
              disabled={compressing}
              className="flex-1 bg-nav-bg hover:bg-accent-cyan border border-accent-cyan text-white hover:text-black font-bold py-2 rounded transition-all text-sm uppercase flex items-center justify-center space-x-2"
            >
              {compressing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Compressing...</span>
                </>
              ) : (
                <span>Calculate & Preview</span>
              )}
            </button>

            {compressedSrc && (
              <button
                onClick={downloadCompressed}
                className="flex-1 bg-accent-cyan hover:bg-accent-alt text-black font-bold py-2 rounded transition-all text-sm uppercase flex items-center justify-center space-x-2"
              >
                <span>Save Compressed</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
