import React, { useState } from 'react';
import { Pipette, Copy, Check, Grid, RefreshCw } from 'lucide-react';

export default function ColorPicker() {
  const [hexColor, setHexColor] = useState<string>('#42f8f5');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Convert HEX to RGB
  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) || 0;
    const g = parseInt(hex.slice(3, 5), 16) || 0;
    const b = parseInt(hex.slice(5, 7), 16) || 0;
    return `rgb(${r}, ${g}, ${b})`;
  };

  // Convert HEX to HSL
  const hexToHsl = (hex: string) => {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;

    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  };

  const handleEyedropper = async () => {
    if (!('EyeDropper' in window)) {
      alert('Native eye dropper API is only supported in Chromium-based desktop browsers.');
      return;
    }
    try {
      const eyeDropper = new (window as any).EyeDropper();
      const result = await eyeDropper.open();
      setHexColor(result.sRGBHex);
    } catch (err) {
      console.log('User cancelled eyedropper', err);
    }
  };

  const copyVal = (val: string, type: string) => {
    navigator.clipboard.writeText(val);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  // Generate Palettes based on selected color
  const generateComplementary = () => {
    // complementary is shifting hue 180 degrees
    let r = parseInt(hexColor.slice(1, 3), 16);
    let g = parseInt(hexColor.slice(3, 5), 16);
    let b = parseInt(hexColor.slice(5, 7), 16);
    
    const compHex = '#' + [255 - r, 255 - g, 255 - b].map(v => {
      const s = Math.max(0, Math.min(255, v)).toString(16);
      return s.length === 1 ? '0' + s : s;
    }).join('');

    return [hexColor, compHex];
  };

  const palettes = generateComplementary();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-accent-cyan text-glow">Color Picker & Palettes</h3>
        <span className="text-xs text-text-desc font-mono">HEX • RGB • HSL SPECTRA</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-nav-bg/60 p-4 rounded-lg border border-accent-cyan/10">
        
        {/* Left Color Selector */}
        <div className="space-y-4 flex flex-col justify-center">
          <div className="flex items-center space-x-4">
            <input
              type="color"
              value={hexColor}
              onChange={(e) => setHexColor(e.target.value)}
              className="w-16 h-16 bg-transparent rounded border-0 outline-none cursor-pointer"
            />
            <div className="space-y-0.5">
              <span className="text-white font-bold text-sm block">Spectrum Color Swatch</span>
              <span className="text-xs text-text-desc font-mono block">Click block icon to calibrate tones.</span>
            </div>
          </div>

          <button
            onClick={handleEyedropper}
            className="w-full bg-nav-bg/80 hover:bg-accent-cyan hover:text-black hover:border-accent-cyan border border-accent-cyan/30 text-white font-bold py-2 rounded transition-all text-xs uppercase flex items-center justify-center space-x-1"
          >
            <Pipette className="w-3.5 h-3.5" />
            <span>Open EyeDropper Lens</span>
          </button>
        </div>

        {/* Right Output details */}
        <div className="space-y-3 font-mono text-xs">
          
          <div className="flex items-center justify-between bg-main-bg p-2 rounded border border-white/5">
            <span className="text-text-desc font-semibold">HEX Code:</span>
            <div className="flex items-center space-x-2">
              <span className="text-white font-bold">{hexColor}</span>
              <button
                onClick={() => copyVal(hexColor, 'hex')}
                className="p-1 hover:bg-white/10 rounded cursor-pointer transition-colors"
              >
                {copiedType === 'hex' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-text-desc" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between bg-main-bg p-2 rounded border border-white/5">
            <span className="text-text-desc font-semibold">RGB format:</span>
            <div className="flex items-center space-x-2">
              <span className="text-white font-bold">{hexToRgb(hexColor)}</span>
              <button
                onClick={() => copyVal(hexToRgb(hexColor), 'rgb')}
                className="p-1 hover:bg-white/10 rounded cursor-pointer transition-colors"
              >
                {copiedType === 'rgb' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-text-desc" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between bg-main-bg p-2 rounded border border-white/5">
            <span className="text-text-desc font-semibold">HSL format:</span>
            <div className="flex items-center space-x-2">
              <span className="text-white font-bold">{hexToHsl(hexColor)}</span>
              <button
                onClick={() => copyVal(hexToHsl(hexColor), 'hsl')}
                className="p-1 hover:bg-white/10 rounded cursor-pointer transition-colors"
              >
                {copiedType === 'hsl' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-text-desc" />}
              </button>
            </div>
          </div>

          {/* Complementary palette swatch */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] text-text-desc uppercase font-bold flex items-center space-x-1.5">
              <Grid className="w-3.5 h-3.5 text-accent-cyan" />
              <span>Complementary Pair</span>
            </span>
            <div className="flex h-6 rounded overflow-hidden border border-white/10">
              {palettes.map((c, idx) => (
                <div
                  key={idx}
                  style={{ backgroundColor: c }}
                  onClick={() => setHexColor(c)}
                  className="flex-1 cursor-pointer transition-all hover:scale-110 flex items-center justify-center text-[9px] font-extrabold text-black outline-none saturate-150 shadow"
                >
                  <span className="bg-white/65 px-1 rounded">{c}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
