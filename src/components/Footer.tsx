import React from 'react';
import { ShieldAlert, Cpu, Heart, CheckCircle } from 'lucide-react';

interface FooterProps {
  onOpenDoc: (tab: 'about' | 'blog' | 'status' | 'privacy' | 'terms' | 'contact') => void;
}

export default function Footer({ onOpenDoc }: FooterProps) {
  return (
    <footer className="border-t border-border-subtle bg-nav-bg/40 mt-16 py-12 px-[5%] text-center space-y-8" id="about">
      
      {/* Interactive Page Links Grid/Wrap */}
      <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-xs font-mono font-bold uppercase tracking-wider text-text-desc/70">
        <button 
          onClick={() => onOpenDoc('about')} 
          className="hover:text-accent-cyan transition-colors cursor-pointer"
        >
          About Us
        </button>
        <button 
          onClick={() => onOpenDoc('blog')} 
          className="hover:text-accent-cyan transition-colors cursor-pointer"
        >
          Blog
        </button>
        <button 
          onClick={() => onOpenDoc('status')} 
          className="hover:text-accent-cyan transition-colors cursor-pointer"
        >
          Status
        </button>
        <button 
          onClick={() => onOpenDoc('privacy')} 
          className="hover:text-accent-cyan transition-colors cursor-pointer"
        >
          Privacy
        </button>
        <button 
          onClick={() => onOpenDoc('terms')} 
          className="hover:text-accent-cyan transition-colors cursor-pointer"
        >
          Terms
        </button>
        <button 
          onClick={() => onOpenDoc('contact')} 
          className="hover:text-accent-cyan transition-colors cursor-pointer"
        >
          Contact Us
        </button>
      </div>

      <div className="max-w-2xl mx-auto space-y-3">
        <div className="flex items-center justify-center space-x-1.5 text-accent-cyan text-xs font-mono uppercase font-bold tracking-wider">
          <CheckCircle className="w-4 h-4 text-accent-cyan animate-pulse" />
          <span>Strict privacy compliant</span>
        </div>
        <p className="text-text-desc text-xs leading-relaxed max-w-xl mx-auto">
          Every single utility on <b>toolhub</b> compiles, encodes and renders entirely inside your local device processor sandbox. No data payloads, binary objects, file headers, or speech dictations are ever pushed to a remote server.
        </p>
      </div>

      <div className="flex justify-center space-x-6 text-[10px] font-mono text-text-desc/60">
        <span className="flex items-center space-x-1">
          <Cpu className="w-3.5 h-3.5 text-accent-cyan/60" />
          <span>Local CPU Compiled</span>
        </span>
        <span>•</span>
        <span>Version 2.4.0</span>
      </div>

    </footer>
  );
}

