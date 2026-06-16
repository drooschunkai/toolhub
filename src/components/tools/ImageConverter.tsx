import React, { useState, useRef } from 'react';
import { Upload, Download, FileImage, CheckCircle, RefreshCw } from 'lucide-react';

export default function ImageConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<string>('image/png');
  const [preview, setPreview] = useState<string | null>(null);
  const [converting, setConverting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setSuccess(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selected = e.dataTransfer.files[0];
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setSuccess(false);
    }
  };

  const convertImage = () => {
    if (!file) return;
    setConverting(true);
    setSuccess(false);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          
          let extension = 'png';
          if (format === 'image/jpeg') extension = 'jpg';
          if (format === 'image/webp') extension = 'webp';

          try {
            const dataUrl = canvas.toDataURL(format);
            const link = document.createElement('a');
            link.download = `${file.name.substring(0, file.name.lastIndexOf('.')) || file.name}_converted.${extension}`;
            link.href = dataUrl;
            link.click();
            setSuccess(true);
          } catch (err) {
            console.error('Conversion failed', err);
            alert('Security sandbox error: Try a smaller or local file.');
          }
        }
        setConverting(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-accent-cyan text-glow">Image Converter</h3>
        <span className="text-xs text-text-desc font-mono">JPG • PNG • WEBP</span>
      </div>

      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-accent-cyan/20 hover:border-accent-cyan/80 bg-nav-bg/40 rounded-xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-4 min-h-[200px]"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        {preview ? (
          <div className="relative group max-w-xs">
            <img src={preview} alt="Selected preview" className="rounded-lg max-h-48 object-contain shadow-md" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg">
              <span className="text-white text-sm font-semibold">Change Image</span>
            </div>
          </div>
        ) : (
          <>
            <Upload className="w-12 h-12 text-accent-cyan/60 pulse-glower" />
            <div>
              <p className="text-white font-medium">Drag & Drop image here, or browse</p>
              <p className="text-xs text-text-desc mt-1">Supports PNG, JPEG, WEBP, GIF, SVG</p>
            </div>
          </>
        )}
      </div>

      {file && (
        <div className="bg-nav-bg/60 p-4 rounded-lg border border-accent-cyan/10 space-y-4">
          <div className="flex justify-between text-sm">
            <div className="flex items-center space-x-2">
              <FileImage className="w-4 h-4 text-accent-cyan" />
              <span className="text-white truncate max-w-[200px]">{file.name}</span>
            </div>
            <span className="text-text-desc font-mono">{(file.size / 1024).toFixed(1)} KB</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
            <label className="text-sm font-medium text-white min-w-[100px]">Convert To:</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="bg-main-bg border border-accent-cyan/30 rounded px-3 py-1.5 text-white outline-none focus:border-accent-cyan text-sm flex-1"
            >
              <option value="image/png">PNG Format (.png)</option>
              <option value="image/jpeg">JPEG Format (.jpg)</option>
              <option value="image/webp">WebP Format (.webp)</option>
            </select>
          </div>

          <button
            onClick={convertImage}
            disabled={converting}
            className="w-full bg-accent-cyan hover:bg-accent-alt text-black font-bold py-2.5 rounded transition-all text-sm uppercase flex items-center justify-center space-x-2"
          >
            {converting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Converting...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Convert & Save Image</span>
              </>
            )}
          </button>

          {success && (
            <div className="flex items-center space-x-2 text-emerald-400 text-sm justify-center bg-emerald-500/10 p-2 rounded">
              <CheckCircle className="w-4 h-4" />
              <span>Conversion Successful! Check downloads.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
