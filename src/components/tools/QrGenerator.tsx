import React, { useState } from 'react';
import { QrCode, Download, Link, Settings, Grid } from 'lucide-react';

export default function QrGenerator() {
  const [text, setText] = useState<string>('https://ai.studio/build');
  const [size, setSize] = useState<number>(200);
  const [fgColor, setFgColor] = useState<string>('000000');
  const [bgColor, setBgColor] = useState<string>('ffffff');
  const [generating, setGenerating] = useState<boolean>(false);

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&color=${fgColor}&bgcolor=${bgColor}`;

  const downloadQr = async () => {
    try {
      setGenerating(true);
      const res = await fetch(qrUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `toolhub_qr_${size}.png`;
      link.href = url;
      link.click();
    } catch (err) {
      console.error(err);
      alert('Error fetching QR image from secure proxy.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-accent-cyan text-glow">QR Code Generator</h3>
        <span className="text-xs text-text-desc font-mono">DYN SPEC & COLOR</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-nav-bg/60 p-4 rounded-lg border border-accent-cyan/10">
        
        {/* Left configurations */}
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-mono text-text-desc flex items-center space-x-1.5 font-bold">
              <Link className="w-3.5 h-3.5 text-accent-cyan" />
              <span>Enter URL or Content</span>
            </label>
            <textarea
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste content here to convert to QR payload..."
              className="w-full bg-main-bg border border-accent-cyan/30 rounded px-3 py-1.5 text-white outline-none focus:border-accent-cyan text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-text-desc block">QR Size (px)</label>
              <select
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full bg-main-bg border border-accent-cyan/30 rounded px-2 py-1 text-white outline-none focus:border-accent-cyan text-xs"
              >
                <option value="150">150 x 150</option>
                <option value="200">200 x 200</option>
                <option value="300">300 x 300</option>
                <option value="400">400 x 400</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-text-desc block">Foreground Color</label>
              <select
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="w-full bg-main-bg border border-accent-cyan/30 rounded px-2 py-1 text-white outline-none focus:border-accent-cyan text-xs"
              >
                <option value="000000">Black (#000)</option>
                <option value="1c222d">Charcoal (#1C22)</option>
                <option value="42f8f5">Cyan Accent (#42F)</option>
                <option value="ff4444">Deep Red (#FF4)</option>
              </select>
            </div>
          </div>
          
          <button
            onClick={downloadQr}
            disabled={generating || !text}
            className="w-full bg-accent-cyan hover:bg-accent-alt text-black font-bold py-2 rounded transition-all text-xs uppercase flex items-center justify-center space-x-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{generating ? 'Downloading...' : 'Download QR Code image'}</span>
          </button>
        </div>

        {/* Right Preview */}
        <div className="flex flex-col items-center justify-center bg-main-bg/50 p-4 rounded border border-white/5 space-y-3">
          <span className="text-[10px] uppercase font-bold font-mono tracking-wider text-text-desc flex items-center space-x-1.5">
            <Grid className="w-3.5 h-3.5 text-accent-cyan" />
            <span>Interactive QR Preview</span>
          </span>
          {text ? (
            <div className="bg-white p-3 rounded-lg shadow-lg border-2 border-accent-cyan/40">
              <img
                src={qrUrl}
                alt="QR generating output"
                className="object-contain"
                style={{ width: `${Math.min(size, 200)}px`, height: `${Math.min(size, 200)}px` }}
              />
            </div>
          ) : (
            <div className="w-36 h-36 border border-dashed border-white/10 rounded flex flex-col items-center justify-center text-text-desc text-[10.5px]">
              <QrCode className="w-6 h-6 text-white/20 animate-pulse mb-1" />
              <span>Empty content payload</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
