import React, { useState } from 'react';
import { Type, Timer, FileText, BarChart2 } from 'lucide-react';

export default function WordCounter() {
  const [text, setText] = useState<string>('');

  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const sentenceCount = text.trim() ? text.split(/[.!?]+/).filter(Boolean).length : 0;
  const paragraphCount = text.trim() ? text.split(/\n+/).filter(Boolean).length : 0;

  // Reading time at an average of 200 WPM
  const readingTime = Math.ceil(wordCount / 200);

  // Compute top words/keywords density
  const getTopKeywords = () => {
    if (!text.trim()) return [];
    const cleanText = text.toLowerCase().replace(/[^a-zA-Z\s]/g, '');
    const tokens = cleanText.split(/\s+/).filter(w => w.length > 3); // Exclude small words like is, to, high, etc.
    const freq: { [key: string]: number } = {};
    
    tokens.forEach(w => {
      freq[w] = (freq[w] || 0) + 1;
    });

    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  };

  const keywords = getTopKeywords();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-accent-cyan text-glow">Word Counter</h3>
        <span className="text-xs text-text-desc font-mono">DENSITY • REAL-TIME METER</span>
      </div>

      <div className="space-y-4 bg-nav-bg/60 p-4 rounded-lg border border-accent-cyan/10">
        
        {/* Input box */}
        <div className="space-y-1">
          <label className="text-xs font-mono text-text-desc flex items-center space-x-1.5 font-bold mb-1">
            <Type className="w-3.5 h-3.5 text-accent-cyan" />
            <span>Type or paste your document text:</span>
          </label>
          <textarea
            rows={6}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste document block..."
            className="w-full bg-main-bg border border-accent-cyan/30 rounded px-3 py-2 text-white outline-none focus:border-accent-cyan text-xs"
          />
        </div>

        {/* Dynamic Metric Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-main-bg/50 p-3 rounded border border-white/5 flex flex-col justify-center">
            <span className="text-xl font-bold font-mono text-accent-cyan text-glow">{charCount}</span>
            <span className="text-[10px] text-text-desc uppercase font-semibold">Characters</span>
          </div>
          <div className="bg-main-bg/50 p-3 rounded border border-white/5 flex flex-col justify-center">
            <span className="text-xl font-bold font-mono text-accent-cyan text-glow">{wordCount}</span>
            <span className="text-[10px] text-text-desc uppercase font-semibold">Words</span>
          </div>
          <div className="bg-main-bg/50 p-3 rounded border border-white/5 flex flex-col justify-center">
            <span className="text-xl font-bold font-mono text-white">{sentenceCount}</span>
            <span className="text-[10px] text-text-desc uppercase font-semibold">Sentences</span>
          </div>
          <div className="bg-main-bg/50 p-3 rounded border border-white/5 flex flex-col justify-center">
            <span className="text-xl font-bold font-mono text-white">{paragraphCount}</span>
            <span className="text-[10px] text-text-desc uppercase font-semibold">Paragraphs</span>
          </div>
        </div>

        {/* Meta stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Reading Speed */}
          <div className="p-3 bg-main-bg/50 rounded border border-white/5 flex items-center space-x-3 text-xs font-mono">
            <Timer className="w-8 h-8 text-accent-cyan animate-pulse" />
            <div>
              <p className="text-white font-bold">~{readingTime} Minute Read</p>
              <p className="text-[10px] text-text-desc">Estimated reading duration at 200 WPM velocity.</p>
            </div>
          </div>

          {/* Keyword Density List */}
          <div className="p-3 bg-main-bg/50 rounded border border-white/5 text-xs font-mono space-y-2">
            <span className="text-[10px] text-text-desc uppercase font-bold flex items-center space-x-1.5 border-b border-white/5 pb-1">
              <BarChart2 className="w-3.5 h-3.5 text-accent-cyan" />
              <span>Keyword Density (length &gt; 3)</span>
            </span>
            {keywords.length > 0 ? (
              <div className="space-y-1">
                {keywords.map(([word, freq]) => (
                  <div key={word} className="flex justify-between items-center text-[11px]">
                    <span className="text-white font-semibold">{word}</span>
                    <span className="text-accent-cyan font-bold">{freq}x</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[10px] text-text-desc/70 italic text-center py-1">Type content to analyze densities</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
