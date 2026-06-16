import React, { useState, useEffect } from 'react';
import ToolsGrid from './components/ToolsGrid';
import ToolModal from './components/ToolModal';
import InfoModal from './components/InfoModal';
import Footer from './components/Footer';
import { Cpu, ShieldCheck, Menu, X, Sparkles, Star, History, Compass, Search, Terminal, Award, Sun, Moon } from 'lucide-react';
import { ToolCategory } from './types';

export default function App() {
  const [activeToolId, setActiveToolId] = useState<string | null>(null);
  const [category, setCategory] = useState<ToolCategory>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterMode, setFilterMode] = useState<'all' | 'favorites' | 'recents'>('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Info Docs Overlay Support State
  const [infoModalOpen, setInfoModalOpen] = useState<boolean>(false);
  const [activeInfoTab, setActiveInfoTab] = useState<'about' | 'blog' | 'status' | 'privacy' | 'terms' | 'contact'>('about');

  // Theme configuration support
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('toolhub_theme');
      return saved === 'light' ? 'light' : 'dark';
    } catch (err) {
      return 'dark';
    }
  });

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
    localStorage.setItem('toolhub_theme', theme);
  }, [theme]);

  // Local storage management for Favorites & Recents
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('toolhub_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error('Failed to parse favorites', err);
      return [];
    }
  });

  const [recents, setRecents] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('toolhub_recents');
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error('Failed to parse recents', err);
      return [];
    }
  });

  // Watch for favoriting modifications
  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];
      localStorage.setItem('toolhub_favorites', JSON.stringify(updated));
      return updated;
    });
  };

  // Launch a tool & record usage safely
  const handleLaunchTool = (id: string) => {
    setRecents((prev) => {
      const filtered = prev.filter((item) => item !== id);
      const updated = [id, ...filtered].slice(0, 5); // Keep the top 5 most recent
      localStorage.setItem('toolhub_recents', JSON.stringify(updated));
      return updated;
    });
    setActiveToolId(id);
  };

  // Synchronize dynamic lists
  useEffect(() => {
    // Scroll to tool list anchor on filtering switches
    const viewContainer = document.getElementById('tools-view');
    if (viewContainer) {
      viewContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [category, filterMode]);

  return (
    <div className="min-h-screen bg-main-bg text-text-desc flex md:flex-row flex-col selection:bg-accent-cyan selection:text-black font-sans relative antialiased">
      
      {/* 1. SIDEBAR NAVIGATION PANELS (Desktop permanent, Mobile sliding drawer) */}
      
      {/* Mobile Backdrop overlay when drawer is open */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[1100] md:hidden cursor-pointer transition-opacity"
        />
      )}

      {/* Sidebar navigation component */}
      <aside className={`
        fixed inset-y-0 left-0 w-64 bg-nav-bg border-r border-border-subtle flex flex-col z-[1200] transform transition-transform duration-300 ease-out md:translate-x-0 md:static md:h-screen md:sticky md:top-0 h-full
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Sidebar Header logotype */}
        <div className="p-6 flex items-center justify-between border-b border-border-subtle">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-accent-cyan flex items-center justify-center relative shadow-lg shadow-accent-cyan/30">
              <Sparkles className="w-4.5 h-4.5 text-black" />
            </div>
            <span className="text-xl font-bold tracking-tighter text-glow text-accent-cyan select-none font-mono">TOOLHUB</span>
          </div>
          
          {/* Mobile close button */}
          <button 
            type="button"
            onClick={() => setMobileMenuOpen(false)} 
            className="md:hidden p-1.5 hover:bg-white/5 rounded-lg text-text-desc hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic menu items layout */}
        <nav className="mt-6 flex-1 px-4 space-y-6 overflow-y-auto">
          {/* Main system menu */}
          <div className="space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono">
              Main Menu
            </div>
            
            <button
              onClick={() => {
                setFilterMode('all');
                setCategory('all');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center px-3 py-3 rounded-lg text-xs font-mono font-bold uppercase cursor-pointer transition-all ${
                filterMode === 'all' && category === 'all'
                  ? 'bg-[#42f8f5]/5 border-r-4 border-accent-cyan text-accent-cyan'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>All Hub Tools</span>
              <span className="ml-auto bg-[#42f8f5]/20 text-[#42f8f5] text-[10px] px-2 py-0.5 rounded">20</span>
            </button>

            <button
              onClick={() => {
                setFilterMode('favorites');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center px-3 py-3 rounded-lg text-xs font-mono font-bold uppercase cursor-pointer transition-all ${
                filterMode === 'favorites'
                  ? 'bg-[#42f8f5]/5 border-r-4 border-accent-cyan text-accent-cyan'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5" /> Bookmarked
              </span>
              <span className="ml-auto bg-[#42f8f5]/20 text-[#42f8f5] text-[10px] px-2 py-0.5 rounded">
                {favorites.length}
              </span>
            </button>

            <button
              onClick={() => {
                setFilterMode('recents');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center px-3 py-3 rounded-lg text-xs font-mono font-bold uppercase cursor-pointer transition-all ${
                filterMode === 'recents'
                  ? 'bg-[#42f8f5]/5 border-r-4 border-accent-cyan text-accent-cyan'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <History className="w-3.5 h-3.5" /> Recent Runs
              </span>
              <span className="ml-auto bg-[#42f8f5]/20 text-[#42f8f5] text-[10px] px-2 py-0.5 rounded">
                {recents.length}
              </span>
            </button>
          </div>

          {/* Categories select list */}
          <div className="space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono">
              Categories
            </div>

            <button
              onClick={() => {
                setFilterMode('all');
                setCategory('media');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center px-3- py-2.5 px-3 rounded-lg text-xs font-mono font-semibold text-left transition-colors cursor-pointer ${
                filterMode === 'all' && category === 'media'
                  ? 'text-accent-cyan bg-[#42f8f5]/5 font-extrabold border-r-2 border-accent-cyan'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Media Tools
            </button>

            <button
              onClick={() => {
                setFilterMode('all');
                setCategory('calculations');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center px-3- py-2.5 px-3 rounded-lg text-xs font-mono font-semibold text-left transition-colors cursor-pointer ${
                filterMode === 'all' && category === 'calculations'
                  ? 'text-accent-cyan bg-[#42f8f5]/5 font-extrabold border-r-2 border-accent-cyan'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Calculations & Math
            </button>

            <button
              onClick={() => {
                setFilterMode('all');
                setCategory('developer');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center px-3- py-2.5 px-3 rounded-lg text-xs font-mono font-semibold text-left transition-colors cursor-pointer ${
                filterMode === 'all' && category === 'developer'
                  ? 'text-accent-cyan bg-[#42f8f5]/5 font-extrabold border-r-2 border-accent-cyan'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Developer Utilities
            </button>

            <button
              onClick={() => {
                setFilterMode('all');
                setCategory('utility');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center px-3- py-2.5 px-3 rounded-lg text-xs font-mono font-semibold text-left transition-colors cursor-pointer ${
                filterMode === 'all' && category === 'utility'
                  ? 'text-accent-cyan bg-accent-cyan/5 font-extrabold border-r-2 border-accent-cyan'
                  : 'text-text-muted hover:text-text-header hover:bg-white/5'
              }`}
            >
              General Utilities
            </button>
          </div>

          {/* Preferences switcher panel */}
          <div className="space-y-1 pt-4 border-t border-border-subtle">
            <div className="px-3 py-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono">
              Preferences
            </div>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-full flex items-center px-3 py-2.5 rounded-lg text-xs font-mono font-bold uppercase cursor-pointer transition-all text-text-desc hover:text-text-header hover:bg-white/5"
            >
              <span className="flex items-center gap-1.5">
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" /> Light Mode
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-indigo-500 shrink-0" /> Dark Mode
                  </>
                )}
              </span>
            </button>
          </div>
        </nav>

        {/* Corporate system status panel */}
        <div className="p-4 border-t border-border-subtle mt-auto">
          <div className="bg-[#42f8f5]/5 border border-border-subtle rounded-lg p-3.5 text-xs font-mono">
            <p className="text-text-desc mb-1.5 font-bold tracking-tight text-[11px] uppercase">Compliance Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-accent-cyan pulse-glower shadow shadow-accent-cyan/65"></div>
              <span className="text-accent-cyan font-extrabold text-[10.5px]">ALL NODES SECURE</span>
            </div>
            <p className="text-[9.5px] text-text-desc/50 mt-1 leading-snug">Local Client Processor Mode</p>
          </div>
        </div>
      </aside>

      {/* 2. MAIN WORKING INTERFACE WINDOW */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        
        {/* Dynamic Header container */}
        <header className="h-16 flex items-center justify-between px-6 sm:px-8 bg-nav-bg border-b border-border-subtle sticky top-0 z-40 shadow-sm">
          
          {/* Left Portion of Top header */}
          <div className="flex items-center gap-2 lg:gap-4">
            {/* Hamburger helper toggler for small devices */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 bg-accent-cyan/5 hover:bg-accent-cyan/10 border border-border-subtle rounded-lg text-text-desc hover:text-accent-cyan cursor-pointer transition-colors"
              title="Toggle Menu Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Micro branding (only visible on small mobile when sidebar hidden) */}
            <div className="flex md:hidden items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent-cyan" />
              <span className="font-extrabold text-xs tracking-wider uppercase font-mono text-accent-cyan text-glow">toolhub</span>
            </div>

            {/* Quick dashboard path links */}
            <div className="hidden sm:flex items-center gap-5 text-xs font-mono text-text-desc font-bold">
              <button
                onClick={() => {
                  setFilterMode('all');
                  setCategory('all');
                }}
                className={`hover:text-accent-cyan cursor-pointer transition-colors ${
                  filterMode === 'all' && category === 'all' ? 'text-accent-cyan border-b-2 border-accent-cyan py-4' : ''
                }`}
              >
                Workspace Core
              </button>
              
              <a href="#about" className="hover:text-accent-cyan transition-colors py-4">
                Compliance Specs
              </a>

              <div className="hidden lg:flex items-center space-x-1 border border-accent-cyan/15 bg-accent-cyan/10 text-accent-cyan text-[10px] uppercase font-extrabold px-2 py-0.5 rounded">
                <span>Verified Client Sandbox</span>
              </div>
            </div>
          </div>

          {/* Right portion of Top header (Search + Theme Switcher + User badge) */}
          <div className="flex items-center gap-4">
            
            {/* Context search panel */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-text-desc/60" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tools instantly..."
                className="bg-main-bg border border-border-subtle rounded-full px-4 py-1.5 pl-9 text-[11px] w-36 sm:w-56 focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan/30 outline-none text-text-header transition-all font-mono"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1.5 text-[10px] text-text-desc hover:text-text-header px-1.5 py-0.5 bg-accent-cyan/10 hover:bg-accent-cyan/25 rounded"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick Header Theme Switcher Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 hover:bg-main-bg/85 border border-border-subtle rounded-lg text-text-desc hover:text-accent-cyan cursor-pointer transition-all"
              title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-500" />
              )}
            </button>

            {/* Glowing dev banner avatar balloon */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent-cyan to-blue-500 shadow-lg shadow-accent-cyan/25 flex items-center justify-center font-bold text-xs text-black border border-accent-cyan/30 select-none">
              OP
            </div>

          </div>

        </header>

        {/* Dynamic fluid content of Workspace */}
        <main className="flex-1 p-6 sm:p-8 space-y-8 w-full max-w-7xl mx-auto flex flex-col justify-start">
          
          {/* Large display header block */}
          <header className="pb-2">
            <div className="inline-flex items-center space-x-2 bg-nav-bg border border-accent-cyan/15 px-3 py-1 rounded-full text-[9px] font-mono font-bold tracking-wider uppercase text-accent-cyan mb-3">
              <Cpu className="w-3 h-3 animate-spin" style={{ animationDuration: '3s' }} />
              <span>All crypto & graphic algorithms secure</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-text-header tracking-tight text-glow flex flex-wrap items-center gap-x-3 gap-y-1">
              Multi Tool Hub 
              <span className="text-accent-cyan font-light text-xs ml-0 sm:ml-2 bg-accent-cyan/10 px-2.5 py-0.5 rounded font-mono border border-accent-cyan/15 select-none">
                v2.4.0
              </span>
            </h1>
            
            <p className="text-sm text-text-desc max-w-3xl mt-2 leading-relaxed">
              Access a comprehensive suite of 20+ professional offline utility components. Highly optimized, secure, private, and calculated entirely inside your client web browser. No telemetry triggers active.
            </p>
          </header>

          {/* Interactive grid of modules */}
          <section id="tools">
            <ToolsGrid 
              onSelectTool={handleLaunchTool}
              category={category}
              setCategory={setCategory}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              filterMode={filterMode}
              setFilterMode={setFilterMode}
              recents={recents}
            />
          </section>

        </main>

        {/* System overlay component launcher */}
        <ToolModal toolId={activeToolId} onClose={() => setActiveToolId(null)} />

        {/* Info Console Modal Overlay */}
        <InfoModal 
          isOpen={infoModalOpen} 
          initialTab={activeInfoTab} 
          onClose={() => setInfoModalOpen(false)} 
        />

        {/* Global Footer component */}
        <Footer onOpenDoc={(tab) => {
          setActiveInfoTab(tab);
          setInfoModalOpen(true);
        }} />

      </div>

    </div>
  );
}
