import React, { useState } from 'react';
import { KeyRound, Copy, Check, Shield, Info, Sparkles } from 'lucide-react';

export default function PasswordGenerator() {
  const [length, setLength] = useState<number>(14);
  const [hasUpper, setHasUpper] = useState<boolean>(true);
  const [hasLower, setHasLower] = useState<boolean>(true);
  const [hasNumbers, setHasNumbers] = useState<boolean>(true);
  const [hasSymbols, setHasSymbols] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('gL9$vK8*pX2#zH');

  const generatePassword = () => {
    let charset = '';
    if (hasLower) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (hasUpper) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (hasNumbers) charset += '0123456789';
    if (hasSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!charset) {
      alert('Please check at least one character type.');
      return;
    }

    let generated = '';
    for (let i = 0; i < length; i++) {
      const idx = Math.floor(Math.random() * charset.length);
      generated += charset[idx];
    }

    setPassword(generated);
    setCopied(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Evaluate Password Strength
  const evaluateStrength = () => {
    let score = 0;
    if (password.length >= 8) score += 1;
    if (password.length >= 14) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 2) return { label: 'Weak', color: 'bg-red-500', width: '25%' };
    if (score <= 4) return { label: 'Medium', color: 'bg-yellow-500', width: '50%' };
    if (score <= 5) return { label: 'Strong', color: 'bg-emerald-500', width: '75%' };
    return { label: 'Ultimate Secure', color: 'bg-cyan-400 font-bold', width: '100%' };
  };

  const strength = evaluateStrength();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-accent-cyan text-glow">Password Generator</h3>
        <span className="text-xs text-text-desc font-mono">ULTRA-SECURE SANDBOX SEED</span>
      </div>

      <div className="bg-nav-bg/60 p-4 rounded-lg border border-accent-cyan/10 space-y-4">
        
        {/* Output Area */}
        <div className="bg-main-bg/80 flex items-center justify-between p-3.5 rounded border border-accent-cyan/30">
          <span className="font-mono text-white text-base overflow-x-auto select-all max-w-[80%] whitespace-nowrap scrollbar-none">
            {password}
          </span>
          <button
            onClick={copyToClipboard}
            className="p-1 px-2.5 bg-accent-cyan hover:bg-accent-alt text-black text-xs font-bold rounded flex items-center space-x-1 uppercase cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* Strength Progress Meter */}
        <div className="space-y-1 text-xs">
          <div className="flex justify-between font-mono">
            <span className="text-text-desc flex items-center space-x-1">
              <Shield className="w-3.5 h-3.5 text-accent-cyan" />
              <span>Calculated Strength Rate:</span>
            </span>
            <span className="text-white font-bold">{strength.label}</span>
          </div>
          <div className="w-full bg-[#0d0f14] h-2 rounded overflow-hidden flex border border-white/5">
            <div style={{ width: strength.width }} className={`${strength.color} transition-all h-full`} />
          </div>
        </div>

        {/* Configurations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Slider */}
          <div className="space-y-2 p-3 bg-main-bg/50 rounded border border-white/5 text-xs font-mono">
            <div className="flex justify-between font-bold">
              <span className="text-text-desc">Character Length</span>
              <span className="text-accent-cyan">{length} Characters</span>
            </div>
            <input
              type="range"
              min="6"
              max="64"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full accent-accent-cyan cursor-pointer"
            />
            <p className="text-[10px] text-text-desc/70">8-16 standard length, 32+ recommended for database seed keys.</p>
          </div>

          {/* Options checkboxes */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <label className="flex items-center space-x-2 text-white bg-main-bg/50 p-2 rounded cursor-pointer select-none">
              <input
                type="checkbox"
                checked={hasLower}
                onChange={(e) => setHasLower(e.target.checked)}
                className="accent-accent-cyan"
              />
              <span>Lowercase</span>
            </label>

            <label className="flex items-center space-x-2 text-white bg-main-bg/50 p-2 rounded cursor-pointer select-none">
              <input
                type="checkbox"
                checked={hasUpper}
                onChange={(e) => setHasUpper(e.target.checked)}
                className="accent-accent-cyan"
              />
              <span>Uppercase</span>
            </label>

            <label className="flex items-center space-x-2 text-white bg-main-bg/50 p-2 rounded cursor-pointer select-none">
              <input
                type="checkbox"
                checked={hasNumbers}
                onChange={(e) => setHasNumbers(e.target.checked)}
                className="accent-accent-cyan"
              />
              <span>Numbers</span>
            </label>

            <label className="flex items-center space-x-2 text-white bg-main-bg/50 p-2 rounded cursor-pointer select-none">
              <input
                type="checkbox"
                checked={hasSymbols}
                onChange={(e) => setHasSymbols(e.target.checked)}
                className="accent-accent-cyan"
              />
              <span>Symbols</span>
            </label>
          </div>
        </div>

        <button
          onClick={generatePassword}
          className="w-full bg-accent-cyan hover:bg-accent-alt text-black font-extrabold py-2.5 rounded transition-all text-xs uppercase flex items-center justify-center space-x-1 cursor-pointer"
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>Regenerate secure password seed</span>
        </button>

      </div>
    </div>
  );
}
