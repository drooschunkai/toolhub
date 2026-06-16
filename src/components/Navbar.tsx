import React from 'react';
import { Settings, Shield, Sparkles } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="sticky top-0 bg-nav-bg border-b border-accent-cyan/10 px-[5%] py-4 flex items-center justify-between z-1000 shadow-md">
      <div className="flex items-center space-x-2">
        <div className="relative">
          <div className="absolute inset-0 bg-accent-cyan/30 rounded-lg blur-sm animate-pulse" />
          <div className="bg-main-bg border border-accent-cyan p-1.5 rounded-lg relative flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-accent-cyan" />
          </div>
        </div>
        <span className="logo tracking-wider text-glow font-extrabold select-none">toolhub</span>
      </div>

      <div className="flex items-center space-x-6 text-xs uppercase font-mono font-bold font-semibold">
        <a href="#tools" className="text-accent-cyan hover:text-accent-alt transition-colors tracking-wide text-glow">
          Tools
        </a>
        <a href="#about" className="text-text-desc hover:text-accent-cyan transition-colors tracking-wide">
          Compliance
        </a>
        <div className="hidden sm:flex items-center space-x-1 border border-accent-cyan/35 bg-[#42f8f5]/10 text-accent-cyan text-[10px] font-extrabold px-2 py-0.5 rounded">
          <Shield className="w-3 h-3 text-accent-cyan" />
          <span>Local client-side sandboxed</span>
        </div>
      </div>
    </nav>
  );
}
