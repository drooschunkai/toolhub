import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Info, BookOpen, Activity, Shield, FileText, 
  Mail, Cpu, CheckCircle, Clock, ArrowLeft, Send, Copy, AlertCircle, Sparkles, Terminal
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface InfoModalProps {
  isOpen: boolean;
  initialTab: 'about' | 'blog' | 'status' | 'privacy' | 'terms' | 'contact';
  onClose: () => void;
}

interface BlogPost {
  id: string;
  title: string;
  date: string;
  category: string;
  readTime: string;
  summary: string;
  content: string[];
}

export default function InfoModal({ isOpen, initialTab, onClose }: InfoModalProps) {
  const [activeTab, setActiveTab] = useState<'about' | 'blog' | 'status' | 'privacy' | 'terms' | 'contact'>(initialTab);
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null);
  
  // Contact Form State
  const [formData, setFormData] = useState({ name: '', email: '', category: 'general', Message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [copiedDispatch, setCopiedDispatch] = useState(false);

  // Status Terminal Log State
  const [logs, setLogs] = useState<string[]>([]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActiveTab(initialTab);
    setSelectedBlogPost(null);
    setFormSubmitted(false);
    setFormData({ name: '', email: '', category: 'general', Message: '' });
  }, [initialTab, isOpen]);

  // Handle Terminal Logs simulation
  useEffect(() => {
    if (activeTab === 'status' && isOpen) {
      setLogs([
        `[${new Date().toISOString()}] INITIALIZING TOOLHUB STATUS REPORT CONTAINER...`,
        `[${new Date().toISOString()}] loading secure cryptographic sandbox...`,
        `[${new Date().toISOString()}] WASM assembly verification: OK (SHA-256 validated)`,
        `[${new Date().toISOString()}] browser LocalStorage interface mapped successfully.`
      ]);

      const events = [
        "scanning temporary canvas buffer limits...",
        "audio context thread latency calibrated at 5.4ms.",
        "refreshing local memory descriptors...",
        "SSL routing node client-side layer confirmed.",
        "checked zero-telemetry policy configuration: VERIFIED-OFFLINE",
        "verified local QR matrix engine module code load...",
        "verified text-to-speech Web-Audio synthesizers...",
        "browser sandbox running inside secure CPU container."
      ];

      const interval = setInterval(() => {
        setLogs(prev => {
          const nextLogs = [...prev, `[${new Date().toISOString()}] ${events[Math.floor(Math.random() * events.length)]}`];
          if (nextLogs.length > 25) nextLogs.shift();
          return nextLogs;
        });
      }, 3500);

      return () => clearInterval(interval);
    }
  }, [activeTab, isOpen]);

  // Scroll terminal logs to bottom
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  if (!isOpen) return null;

  // Blog content entries
  const blogPosts: BlogPost[] = [
    {
      id: 'wasm-revolution',
      title: 'The Local WASM Revolution: Making Transcoding Servers Obsolete',
      date: 'June 10, 2026',
      category: 'Innovation',
      readTime: '4 min read',
      summary: 'Explore how modern WebAssembly allows compilers and complex media manipulators to work directly on your CPU without ever exposing raw assets to remote networks.',
      content: [
        'For decades, developers believed that converting high-resolution images, transcoding files, or running heavy multi-threaded tools required powerful server-side arrays. Cloud computing was the default answer to every problem.',
        'With the introduction of highly-optimized WebAssembly (WASM) compilers, things changed dramatically. Browsers can now run near-native C, C++, and Rust code directly on your local device. We are capable of computing millions of multi-threaded pixels inside a secure browser sandboxed tab.',
        'This shifts processing of sensitive image data, cryptographic tasks, and algorithmic computations completely off remote nodes. Your system hardware becomes the compute cluster, removing transit-layer delays, eliminating monthly cloud overhead, and fundamentally protecting document integrity.',
        'Here at ToolHub, our compiler-bound utilities run entirely client-side. There is no backend waiting to peek, buffer, or save your source bytes. Beautiful, performant, and 100% cloud-free.'
      ]
    },
    {
      id: 'cryto-entropy',
      title: 'Cryptographic Client-Side Entropy in Javascript',
      date: 'June 01, 2026',
      category: 'Security',
      readTime: '6 min read',
      summary: 'Delving into how crypto.getRandomValues renders old insecure mathematical pseudo-random engines completely vulnerable and obsolete. Are your passwords truly safe?',
      content: [
        'Most simple random number generators in legacy web tools use Math.random() under the hood. What many do not realize is that the V8 and SpiderMonkey engines construct Math.random using algorithms that are completely predictable once enough samples are observed.',
        'For password generation or cryptographic hashes, utilizing Math.random is an absolute safety anti-pattern. Instead, modern web architectures utilize the high-entropy Web Cryptography API stream: window.crypto.getRandomValues.',
        'This API requests cryptographically secure random numbers generated directly by your hardware’s true entropy pool (such as mouse movements, atmospheric thermal fluctuations, or keyboard timings formatted through the OS kernel).',
        'In our Password Generator and general cryptography modules on ToolHub, secure entropy is the key design core. We prioritize strict mathematical isolation, keeping your secret digits secure and impossible to recreate or forecast.'
      ]
    },
    {
      id: 'local-video-memory',
      title: 'Avoiding Memory Leaks with Object URLs in Binary Blobs',
      date: 'May 20, 2026',
      category: 'Web Tech',
      readTime: '3 min read',
      summary: 'Analyzing block buffers and how utilizing URL.revokeObjectURL keeps browser memory tidy when cropping or compressing heavy high-res visual assets.',
      content: [
        'When you select a file in your browser, a dynamic file interface maps it as a local binary object (Blob). To show a preview or allow downloads, we often turn this Blob into a temporary memory URL via URL.createObjectURL(file).',
        'However, because the browser doesn’t know when you are finished downloading or viewing that cropped avatar or converted audio file, it binds it in RAM indefinitely until the tab is closed.',
        'Generating multiple heavy assets can swiftly bloat browser memory to hundreds of megabytes, leading to unresponsive tabs—or outright tab crashing.',
        'At ToolHub, garbage clean-up loops are deeply integrated into the lifecycle of every converter. By leveraging URL.revokeObjectURL immediately after downloads are initiated or when modal screens close, we ensure our utilities remain fast, agile, and respect system memory.'
      ]
    }
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.Message) return;
    setFormSubmitted(true);
  };

  const copyDispatchLogs = () => {
    const rawText = `[ToolHub Feedback Dispatch]\nName: ${formData.name}\nEmail: ${formData.email}\nCategory: ${formData.category}\nMessage: ${formData.Message}\nTimestamp: ${new Date().toISOString()}\nSandbox Node: Local Browser Isolated Cache`;
    navigator.clipboard.writeText(rawText);
    setCopiedDispatch(true);
    setTimeout(() => setCopiedDispatch(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[1400] flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn" id="info-center-modal">
      
      {/* Central Modal Card Container */}
      <div className="bg-card-bg border border-border-subtle rounded-2xl w-full max-w-4xl h-[85vh] sm:h-[80vh] flex flex-col md:flex-row overflow-hidden shadow-2xl relative">
        
        {/* Absolute header for close inside responsive layouts */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-main-bg/80 border border-border-subtle text-text-desc hover:text-accent-cyan rounded-full transition-all cursor-pointer"
          title="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Sidebar Tabs Select Panel */}
        <aside className="w-full md:w-60 bg-nav-bg border-b md:border-r border-border-subtle p-4 flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible md:space-y-1.5 shrink-0 select-none scrollbar-none">
          
          <div className="hidden md:flex items-center gap-2 pb-4 mb-3 border-b border-border-subtle">
            <Sparkles className="w-5 h-5 text-accent-cyan" />
            <span className="font-mono text-sm font-extrabold tracking-wide uppercase text-text-header">Info Console</span>
          </div>

          {[
            { id: 'about', label: 'About Us', icon: Info },
            { id: 'blog', label: 'Blog Insights', icon: BookOpen },
            { id: 'status', label: 'Sandbox Status', icon: Activity },
            { id: 'privacy', label: 'Privacy Policy', icon: Shield },
            { id: 'terms', label: 'Terms of Service', icon: FileText },
            { id: 'contact', label: 'Contact Us', icon: Mail }
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setSelectedBlogPost(null);
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-tight whitespace-nowrap transition-all cursor-pointer ${
                  active 
                    ? 'text-accent-cyan bg-accent-cyan/10 border border-accent-cyan/15 px-3'
                    : 'text-text-desc hover:text-text-header hover:bg-main-bg/50 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-accent-cyan' : 'text-text-muted'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Selected Tab Content Window */}
        <main className="flex-1 overflow-y-auto p-5 sm:p-8 bg-main-bg text-text-desc relative">

          <AnimatePresence mode="wait">
            {activeTab === 'about' && (
              <motion.div 
                key="about"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <header className="space-y-1.5 border-b border-border-subtle pb-4">
                  <div className="text-[10px] font-mono font-bold tracking-widest text-accent-cyan uppercase">Decentralized Engine</div>
                  <h2 className="text-2xl font-bold font-mono text-text-header">About ToolHub</h2>
                </header>

                <div className="space-y-4 text-xs leading-relaxed">
                  <p className="text-text-header font-semibold text-sm">
                    Reclaiming the power of the browser to build pristine, 100% private computing environments.
                  </p>
                  <p>
                    ToolHub was engineered to solve a common dilemma: why do web developers, visual designers, and security professionals need to upload confidential files, corporate calculations, and personal values to third-party endpoints just to perform trivial utility tools like image resizing, EMIs calculations, password mapping, or JSON linting?
                  </p>
                  <p>
                    Our mission is centered on 100% client-side computing: any algorithms loaded on this hub execute completely inside your local memory blocks.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                  <div className="p-4 rounded-xl border border-border-subtle bg-card-bg space-y-2">
                    <div className="w-8 h-8 rounded bg-accent-cyan/10 flex items-center justify-center text-accent-cyan">
                      <Cpu className="w-4.5 h-4.5" />
                    </div>
                    <h4 className="text-xs font-bold uppercase text-text-header font-mono">1. Local CPU Execution</h4>
                    <p className="text-[11px] text-text-desc/70 leading-relaxed">
                      Every byte and computation loops strictly in native WebAssembly and Javascript threads, keeping raw data isolated.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-border-subtle bg-card-bg space-y-2">
                    <div className="w-8 h-8 rounded bg-accent-cyan/10 flex items-center justify-center text-accent-cyan">
                      <Shield className="w-4.5 h-4.5" />
                    </div>
                    <h4 className="text-xs font-bold uppercase text-text-header font-mono">2. Zero Host Logs</h4>
                    <p className="text-[11px] text-text-desc/70 leading-relaxed">
                      We do not provision cloud storage endpoints for files, texts, password algorithms, or user profiles. Offline by default.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-border-subtle bg-card-bg space-y-2">
                    <div className="w-8 h-8 rounded bg-accent-cyan/10 flex items-center justify-center text-accent-cyan">
                      <CheckCircle className="w-4.5 h-4.5" />
                    </div>
                    <h4 className="text-xs font-bold uppercase text-text-header font-mono">3. Open Compliance</h4>
                    <p className="text-[11px] text-text-desc/70 leading-relaxed">
                      Audited modules built using open standardized frameworks. Transparent client calculation without backend barriers.
                    </p>
                  </div>
                </div>

              </motion.div>
            )}

            {activeTab === 'blog' && (
              <motion.div 
                key="blog"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {!selectedBlogPost ? (
                  <>
                    <header className="space-y-1.5 border-b border-border-subtle pb-4">
                      <div className="text-[10px] font-mono font-bold tracking-widest text-accent-cyan uppercase">Technical Insights</div>
                      <h2 className="text-2xl font-bold font-mono text-text-header">Computational Blog</h2>
                    </header>

                    <div className="grid grid-cols-1 gap-4">
                      {blogPosts.map(post => (
                        <div 
                          key={post.id}
                          onClick={() => setSelectedBlogPost(post)}
                          className="p-5 rounded-xl border border-border-subtle bg-card-bg hover:border-accent-cyan/40 cursor-pointer transition-all space-y-3 group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="px-2 py-0.5 rounded text-[9px] bg-accent-cyan/10 text-accent-cyan font-mono font-bold uppercase">
                              {post.category}
                            </span>
                            <div className="flex items-center text-[10px] text-text-muted gap-1 font-mono">
                              <Clock className="w-3 h-3" />
                              <span>{post.readTime}</span>
                            </div>
                          </div>
                          <h3 className="text-sm font-bold text-text-header group-hover:text-accent-cyan transition-colors font-mono">
                            {post.title}
                          </h3>
                          <p className="text-xs text-text-desc/85 leading-relaxed">
                            {post.summary}
                          </p>
                          <div className="text-[10px] text-accent-cyan font-mono font-bold uppercase flex items-center gap-1 pt-1.5">
                            <span>Read Article</span>
                            <span className="group-hover:translate-x-1 duration-200 transition-transform">→</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="space-y-6">
                    <button 
                      onClick={() => setSelectedBlogPost(null)} 
                      className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-accent-cyan hover:text-accent-alt bg-accent-cyan/10 border border-accent-cyan/10 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Articles</span>
                    </button>

                    <header className="space-y-2 border-b border-border-subtle pb-4">
                      <div className="flex items-center gap-2 text-[10px] text-text-muted font-mono">
                        <span className="text-accent-cyan hover:underline uppercase font-bold">{selectedBlogPost.category}</span>
                        <span>•</span>
                        <span>{selectedBlogPost.date}</span>
                        <span>•</span>
                        <span>{selectedBlogPost.readTime}</span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-text-header font-mono leading-tight">{selectedBlogPost.title}</h2>
                    </header>

                    <div className="space-y-4 text-xs leading-relaxed text-text-desc/95">
                      {selectedBlogPost.content.map((paragraph, idx) => (
                        <p key={idx}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'status' && (
              <motion.div 
                key="status"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <header className="space-y-1.5 border-b border-border-subtle pb-4">
                  <div className="text-[10px] font-mono font-bold tracking-widest text-accent-cyan uppercase">Live Diagnostics</div>
                  <h2 className="text-2xl font-bold font-mono text-text-header font-semibold">Sandbox Status Console</h2>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Status Indicator Dashboard Panel */}
                  <div className="p-5 rounded-xl border border-border-subtle bg-card-bg space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold uppercase text-text-header">Telemetry Monitor</span>
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-extrabold uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span>99.98% Healthy</span>
                      </div>
                    </div>

                    <div className="space-y-2.5 pt-2">
                      {[
                        { label: 'WASM Compiler Sandbox', val: 'OPERATIONAL', ok: true },
                        { label: 'Local Audio Stream Core', val: 'ACTIVE', ok: true },
                        { label: 'Memory Buffer Cache', val: 'SANDBOXED', ok: true },
                        { label: 'Entropy Vault Core', val: 'SECURE', ok: true },
                        { label: 'Static CDN Pipeline', val: 'ONLINE', ok: true },
                        { label: 'Server Telemetry Logs', val: 'DISABLED', ok: 'amber' }
                      ].map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs border-b border-border-subtle/40 pb-1.5 last:border-0 last:pb-0">
                          <span className="text-text-muted font-mono text-[11px]">{item.label}</span>
                          <span className={`font-mono text-[10px] font-bold ${
                            item.ok === true 
                              ? 'text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded' 
                              : 'text-amber-400 bg-amber-500/5 px-2 py-0.5 rounded'
                          }`}>
                            {item.val}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Terminal Simulation Frame */}
                  <div className="p-4 rounded-xl border border-border-subtle bg-black text-emerald-400 flex flex-col h-60">
                    <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2 mb-2">
                      <div className="flex items-center gap-1.5">
                        <Terminal className="w-4.5 h-4.5 text-emerald-400" />
                        <span className="font-mono text-[10px] font-bold">LOCAL_CONSOLE_OUT_BUS</span>
                      </div>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded bg-red-400/30"></div>
                        <div className="w-2 h-2 rounded bg-yellow-400/30"></div>
                        <div className="w-2 h-2 rounded bg-emerald-400/30"></div>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto font-mono text-[9px] leading-relaxed scrollbar-none space-y-1">
                      {logs.map((log, index) => (
                        <div key={index} className="whitespace-pre-wrap">{log}</div>
                      ))}
                      <div ref={terminalEndRef}></div>
                    </div>
                  </div>
                </div>

              </motion.div>
            )}

            {activeTab === 'privacy' && (
              <motion.div 
                key="privacy"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <header className="space-y-1.5 border-b border-border-subtle pb-4">
                  <div className="text-[10px] font-mono font-bold tracking-widest text-accent-cyan uppercase">Security Parameters</div>
                  <h2 className="text-2xl font-bold font-mono text-text-header">Privacy Policy</h2>
                </header>

                <div className="space-y-5 text-xs leading-relaxed">
                  <div className="space-y-1.5">
                    <h3 className="font-mono text-sm font-extrabold text-text-header">1. Isolated Memory Computing</h3>
                    <p className="text-text-desc/90">
                      ToolHub operates entirely under a self-contained local compute sandbox pattern. Any records, strings, password combinations, file structures, uploaded visual graphics, or voice transcripts processed by any utility exist strictly inside memory heaps handled by your browser. We never host, parse, copy, or read any file contents.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="font-mono text-sm font-extrabold text-text-header">2. WebStorage Preferences</h3>
                    <p className="text-text-desc/90">
                      We utilize standard local device memory layers (e.g., `localStorage`) solely to maintain client interface choices. This includes retaining custom theme states, pinning favorited tools, and caching small labels in your Recently Used registry. No identifiers or account metadata are written or shipped.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="font-mono text-sm font-extrabold text-text-header">3. Third-Party Tracker Elimination</h3>
                    <p className="text-text-desc/90">
                      Our framework has been stripped clean of commercial user trackers, telemetry beacons, heatmaps, and advertisement scripts. We maintain compliance by treating user safety and local data isolation as an absolute requirement of software design.
                    </p>
                  </div>
                </div>

              </motion.div>
            )}

            {activeTab === 'terms' && (
              <motion.div 
                key="terms"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <header className="space-y-1.5 border-b border-border-subtle pb-4">
                  <div className="text-[10px] font-mono font-bold tracking-widest text-accent-cyan uppercase">Client Standards</div>
                  <h2 className="text-2xl font-bold font-mono text-text-header">Terms of Service</h2>
                </header>

                <div className="space-y-5 text-xs leading-relaxed">
                  <div className="space-y-1.5">
                    <h3 className="font-mono text-sm font-extrabold text-text-header">1. Platform Scope & Provision</h3>
                    <p className="text-text-desc/90">
                      ToolHub presents lightweight mathematical, media, and programmatic algorithms compiled for client usage. Use of these resources is completely free-of-charge, distributed entirely without tracking, and run solely dynamically on your personal hardware client stack.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="font-mono text-sm font-extrabold text-text-header">2. Liability and Precision</h3>
                    <p className="text-text-desc/90">
                      While calculations, QR configurations, and transcoding steps designed here have been extensively audited and reviewed for accuracy under native ES specifications, all results are presented "as-is", in a certified local sandbox. Under no parameters shall ToolHub be held liable, legal, or financial for any computing flaws.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="font-mono text-sm font-extrabold text-text-header">3. Open Access</h3>
                    <p className="text-text-desc/90">
                      You are in full ownership of any converted graphics, compressed streams, formatted lists, and hashes computed inside this engine workspace. We assert zero licensing or intellectual claims over any processing deliverables compiled locally.
                    </p>
                  </div>
                </div>

              </motion.div>
            )}

            {activeTab === 'contact' && (
              <motion.div 
                key="contact"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-5"
              >
                <header className="space-y-1.5 border-b border-border-subtle pb-4">
                  <div className="text-[10px] font-mono font-bold tracking-widest text-accent-cyan uppercase">Transceiver Tunnel</div>
                  <h2 className="text-2xl font-bold font-mono text-text-header">Contact Us</h2>
                </header>

                {!formSubmitted ? (
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <p className="text-xs text-text-desc/80 leading-relaxed">
                      Have security questions, audit queries, or feature requests? Fill in the dispatch frame below to generate a secure feedback ticket.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono font-bold uppercase text-text-muted">Full Name</label>
                        <input 
                          type="text" 
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="Sender identifier"
                          className="w-full bg-main-bg border border-border-subtle rounded-lg px-3 py-2 text-xs outline-none focus:border-accent-cyan transition-all"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono font-bold uppercase text-text-muted">Email Address</label>
                        <input 
                          type="email" 
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          placeholder="client@e-node.net"
                          className="w-full bg-main-bg border border-border-subtle rounded-lg px-3 py-2 text-xs outline-none focus:border-accent-cyan transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold uppercase text-text-muted">Inquiry Category</label>
                      <select 
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full bg-main-bg border border-border-subtle rounded-lg px-3 py-2 text-xs outline-none focus:border-accent-cyan transition-all cursor-pointer font-sans"
                      >
                        <option value="general">General Support Dialog</option>
                        <option value="bug">Bug Report Diagnostics</option>
                        <option value="security">Private Security Code Audit</option>
                        <option value="feature">Algorithm Proposal Request</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold uppercase text-text-muted">Message Dispatch Content</label>
                      <textarea 
                        rows={3}
                        required
                        value={formData.Message}
                        onChange={(e) => setFormData({...formData, Message: e.target.value})}
                        placeholder="State your communication lines..."
                        className="w-full bg-main-bg border border-border-subtle rounded-lg px-3 py-2 text-xs outline-none focus:border-accent-cyan transition-all resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-accent-cyan hover:bg-accent-alt text-black font-mono font-bold uppercase text-xs py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer relative overflow-hidden group shadow shadow-accent-cyan/25"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Transmit Message Terminal</span>
                    </button>
                  </form>
                ) : (
                  <div className="p-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-4 animate-fadeIn">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-text-header font-mono uppercase">Transmission Compiled!</h4>
                        <p className="text-[11px] text-emerald-400/80 font-mono">Feedback is securely cataloged into your sandboxed memory buffer.</p>
                      </div>
                    </div>

                    <div className="space-y-2 max-w-full">
                      <p className="text-[11px] text-text-desc/80 leading-relaxed">
                        To maintain 100% offline-only decentralized boundaries, we buffered this form dispatch locally. You can capture this feedback package below to copy or forward:
                      </p>

                      <div className="bg-main-bg border border-border-subtle p-3 rounded-lg flex items-start justify-between font-mono text-[10px] overflow-x-auto gap-2">
                        <pre className="text-text-desc flex-1 leading-normal select-all">
{`Sender: ${formData.name}
Inquiry: ${formData.category}
Dispatch: ${formData.Message}`}
                        </pre>
                        <button
                          onClick={copyDispatchLogs}
                          className="p-1 px-1.5 bg-accent-cyan/10 hover:bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/10 rounded font-mono text-[9px] flex items-center gap-1 cursor-pointer shrink-0"
                        >
                          {copiedDispatch ? (
                            <>
                              <CheckCircle className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy Package</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => setFormSubmitted(false)}
                      className="text-[10px] font-mono font-bold text-text-muted hover:text-text-header transition-colors uppercase cursor-pointer block text-center"
                    >
                      ( Reset Feedback Terminal Form )
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

        </main>

      </div>

    </div>
  );
}
