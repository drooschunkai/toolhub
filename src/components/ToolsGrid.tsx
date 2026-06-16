import React from 'react';
import { Search, Compass, Shield, Award, Activity, Code, Settings, Star, History, Calendar, Percent, TrendingUp, QrCode, Palette, Volume2, Mic, Timer, Key, FileText, ShieldAlert, Scale, Image, Zap, Crop, Video, Music, Scissors, Sparkles } from 'lucide-react';
import { Tool, ToolCategory } from '../types';

interface ToolsGridProps {
  onSelectTool: (id: string) => void;
  category: ToolCategory;
  setCategory: (cat: ToolCategory) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  filterMode: 'all' | 'favorites' | 'recents';
  setFilterMode: (mode: 'all' | 'favorites' | 'recents') => void;
  recents: string[];
}

export const allTools: Tool[] = [
  { id: 'imgConv', title: 'Image Converter', description: 'Convert images to PNG, JPG, or WebP format instantly.', category: 'media', icon: 'Image' },
  { id: 'imgComp', title: 'Image Compressor', description: 'Reduce image file size with custom quality tuning.', category: 'media', icon: 'Zap' },
  { id: 'imgCrop', title: 'Image Cropper', description: 'Crop images to 1:1, 16:9, or custom dynamic ratios.', category: 'media', icon: 'Crop' },
  { id: 'videoCtrl', title: 'Video Controller', description: 'Inspect video details and capture beautiful timeline screenshots.', category: 'media', icon: 'Video' },
  { id: 'audioManip', title: 'Audio Manipulator', description: 'Boost volume gain and playback rates offline.', category: 'media', icon: 'Music' },
  { id: 'audioTrim', title: 'Audio Trimmer', description: 'Trim segments of audio and export as clean WAV.', category: 'media', icon: 'Scissors' },

  { id: 'ageCalc', title: 'Age Calculator', description: 'Calculate exact live chronological age detail down to seconds.', category: 'calculations', icon: 'Calendar' },
  { id: 'emiCalc', title: 'EMI Calculator', description: 'Calculate mortgage repayments with dynamic principal-interest gauges.', category: 'calculations', icon: 'Percent' },
  { id: 'sipCalc', title: 'SIP Calculator', description: 'Project future investment growth wealth gains via interactive sliders.', category: 'calculations', icon: 'TrendingUp' },
  { id: 'bmiCalc', title: 'BMI Calculator', description: 'Check health status and receive target nutritional advice.', category: 'calculations', icon: 'Activity' },

  { id: 'qrGen', title: 'QR Code Generator', description: 'Generate custom QR codes instantly with adjustable themes.', category: 'utility', icon: 'QrCode' },
  { id: 'colorPick', title: 'Color Picker', description: 'Extract accurate HEX, RGB, and HSL codes with complementary palettes.', category: 'utility', icon: 'Palette' },
  { id: 'tts', title: 'Text to Speech', description: 'Convert written document content into natural local voices.', category: 'utility', icon: 'Volume2' },
  { id: 'stt', title: 'Speech to Text', description: 'Dictate speech live through your microphone into copyable transcripts.', category: 'utility', icon: 'Mic' },
  { id: 'swTimer', title: 'Timer Stopwatch', description: 'Precision elapsed lap chronometer and alarm timer.', category: 'utility', icon: 'Timer' },

  { id: 'passGen', title: 'Password Generator', description: 'Create randomized, ultra-secure password seeds instantly.', category: 'developer', icon: 'Key' },
  { id: 'wordCount', title: 'Word Counter', description: 'Display read speeds, characters, sentences, and query counts.', category: 'developer', icon: 'FileText' },
  { id: 'base64', title: 'Base64 Tool', description: 'Encode plain text or local files to binary or decode assets.', category: 'developer', icon: 'ShieldAlert' },
  { id: 'jsonFormat', title: 'JSON Formatter', description: 'Validate, format, prettify, and clean code strings instantly.', category: 'developer', icon: 'Code' },
  { id: 'unitConv', title: 'Unit Converter', description: 'Convert lengths, weights, speed, and temperatures instantly.', category: 'developer', icon: 'Scale' }
];

// Helper component for tool icons
export function ToolIcon({ name, className }: { name: string; className?: string }) {
  const cn = className || "w-5 h-5";
  switch (name) {
    case 'Image': return <Image className={cn} />;
    case 'Zap': return <Zap className={cn} />;
    case 'Crop': return <Crop className={cn} />;
    case 'Video': return <Video className={cn} />;
    case 'Music': return <Music className={cn} />;
    case 'Scissors': return <Scissors className={cn} />;
    case 'Calendar': return <Calendar className={cn} />;
    case 'Percent': return <Percent className={cn} />;
    case 'TrendingUp': return <TrendingUp className={cn} />;
    case 'Activity': return <Activity className={cn} />;
    case 'QrCode': return <QrCode className={cn} />;
    case 'Palette': return <Palette className={cn} />;
    case 'Volume2': return <Volume2 className={cn} />;
    case 'Mic': return <Mic className={cn} />;
    case 'Timer': return <Timer className={cn} />;
    case 'Key': return <Key className={cn} />;
    case 'FileText': return <FileText className={cn} />;
    case 'ShieldAlert': return <ShieldAlert className={cn} />;
    case 'Code': return <Code className={cn} />;
    case 'Scale': return <Scale className={cn} />;
    default: return <Code className={cn} />;
  }
}

export default function ToolsGrid({
  onSelectTool,
  category,
  setCategory,
  searchTerm,
  setSearchTerm,
  favorites,
  toggleFavorite,
  filterMode,
  setFilterMode,
  recents
}: ToolsGridProps) {

  // Filtration logic
  const getFilteredTools = () => {
    let list = [...allTools];

    // Filter modes
    if (filterMode === 'favorites') {
      list = list.filter(tool => favorites.includes(tool.id));
    } else if (filterMode === 'recents') {
      // Map recents in strict last-used sorting order
      const recentsMap = recents.map(rId => list.find(t => t.id === rId)).filter(Boolean) as Tool[];
      list = recentsMap;
    }

    // Category filter (only applies to normal 'all' hub menu or within selected modes)
    if (filterMode === 'all' && category !== 'all') {
      list = list.filter(tool => tool.category === category);
    }

    // Search filter
    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      list = list.filter(tool => 
        tool.title.toLowerCase().includes(query) || 
        tool.description.toLowerCase().includes(query) ||
        tool.category.toLowerCase().includes(query)
      );
    }

    return list;
  };

  const filteredTools = getFilteredTools();

  return (
    <div className="space-y-6 animate-fadeIn" id="tools-view">
      {/* Sub-Filters Dashboard */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-nav-bg p-4 rounded-xl border border-border-subtle shadow-lg">
        {/* Breadcrumb info or active view label */}
        <div className="flex items-center space-x-2">
          {filterMode === 'all' ? (
            <div className="flex items-center space-x-2">
              <span className="text-text-header font-bold text-sm uppercase font-mono tracking-wider">
                {category === 'all' ? 'All Workspace Tools' : `${category} utilities`}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-accent-cyan/20 text-accent-cyan font-bold font-mono">
                {category === 'all' ? '20' : filteredTools.length} total
              </span>
            </div>
          ) : filterMode === 'favorites' ? (
            <div className="flex items-center space-x-2 font-mono text-sm uppercase">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-amber-400 font-bold">Your Favorited Tools</span>
              <span className="bg-amber-400/20 text-amber-400 font-extrabold text-[10px] px-1.5 py-0.5 rounded">
                {filteredTools.length}
              </span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 font-mono text-sm uppercase">
              <History className="w-4 h-4 text-accent-cyan animate-pulse" />
              <span className="text-text-header font-bold">Recently Used Logs</span>
              <span className="bg-accent-cyan/20 text-accent-cyan font-bold text-[10px] px-1.5 py-0.5 rounded">
                {filteredTools.length}
              </span>
            </div>
          )}
        </div>

        {/* Categories helper selector within the content view */}
        {filterMode === 'all' && (
          <div className="flex flex-wrap gap-1 text-[11px] font-mono">
            {(['all', 'media', 'calculations', 'utility', 'developer'] as ToolCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1 bg-main-bg hover:border-accent-cyan/60 rounded border transition-all cursor-pointer font-semibold uppercase ${
                  category === cat
                    ? 'border-accent-cyan text-accent-cyan bg-accent-cyan/5 font-extrabold'
                    : 'border-border-subtle text-text-desc hover:text-text-header'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid view of tools matching parameters */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => {
            const isFav = favorites.includes(tool.id);

            return (
              <div
                key={tool.id}
                className="tool-card bg-card-bg p-6 rounded-xl border border-border-subtle glow-cyan-hover flex flex-col group relative transition-all duration-300"
              >
                {/* Favorite Star button directly on the card */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(tool.id);
                  }}
                  className="absolute top-4 right-4 text-text-desc hover:text-amber-400/80 p-1 bg-main-bg border border-border-subtle rounded-lg transition-all cursor-pointer"
                  title={isFav ? "Remove from Favorites" : "Add to Favorites"}
                >
                  <Star className={`w-4 h-4 ${isFav ? 'text-amber-400 fill-amber-400' : 'text-text-desc/40'}`} />
                </button>

                <div className="flex justify-between items-start mb-4">
                  <div className="p-2.5 bg-accent-cyan/10 rounded-lg text-accent-cyan group-hover:bg-accent-cyan group-hover:text-black transition-all">
                    <ToolIcon name={tool.icon} className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] bg-main-bg border border-border-subtle uppercase px-2 py-0.5 rounded text-text-muted font-mono tracking-wider mr-8">
                    {tool.category}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-text-header group-hover:text-accent-cyan transition-colors mt-1 mb-2">
                  {tool.title}
                </h3>
                <p className="text-xs text-text-desc leading-relaxed flex-1">
                  {tool.description}
                </p>

                <button
                  onClick={() => onSelectTool(tool.id)}
                  className="neon-button mt-5 py-2 px-4 rounded font-extrabold text-xs tracking-wider uppercase w-full cursor-pointer flex items-center justify-center space-x-1"
                >
                  <span>LAUNCH UTILITY</span>
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-nav-bg/30 rounded-xl border border-white/5 space-y-4 flex flex-col items-center justify-center">
          <Compass className="w-12 h-12 text-accent-cyan/30 animate-spin" style={{ animationDuration: '8s' }} />
          <div className="space-y-1.5 p-1">
            <h4 className="text-white font-bold text-sm font-mono tracking-tight">No Matching Tools Located</h4>
            <p className="text-text-desc text-xs max-w-sm mx-auto">
              We couldn't locate any dynamic utilities based on your selected categories, search queries, or bookmark states.
            </p>
          </div>
          <button
            onClick={() => {
              setSearchTerm('');
              setCategory('all');
              setFilterMode('all');
            }}
            className="px-4 py-1.5 neon-button rounded text-xs font-bold uppercase transition-all whitespace-nowrap"
          >
            Reset active parameters
          </button>
        </div>
      )}
    </div>
  );
}
