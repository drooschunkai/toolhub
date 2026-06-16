import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Copy, Check, Info, RefreshCw } from 'lucide-react';

export default function SpeechToText() {
  const [transcript, setTranscript] = useState<string>('');
  const [listening, setListening] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [notSupported, setNotSupported] = useState<boolean>(false);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setNotSupported(true);
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';

    rec.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + ' ';
        }
      }
      if (finalTranscript) {
        setTranscript((prev) => prev + finalTranscript);
      }
    };

    rec.onerror = (e: any) => {
      console.error('Speech recognition error', e);
      if (e.error === 'not-allowed') {
        alert('Microphone permission blocked. Please check your browser settings or click the Open In New Tab button to bypass iframe sandboxing limits.');
        setListening(false);
      }
    };

    rec.onend = () => {
      setListening(false);
    };

    recognitionRef.current = rec;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const toggleListening = () => {
    if (notSupported) {
      alert('Speech Recognition is not supported on this browser (Chrome recommendations).');
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
    } else {
      try {
        setTranscript('');
        recognitionRef.current?.start();
        setListening(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const copyResult = () => {
    if (!transcript) return;
    navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-accent-cyan text-glow">Speech to Text</h3>
        <span className="text-xs text-text-desc font-mono">LIVE SOUND DICTATE</span>
      </div>

      <div className="bg-nav-bg/60 p-4 rounded-lg border border-accent-cyan/10 space-y-4">
        
        {notSupported ? (
          <div className="p-3 bg-red-500/10 rounded border border-red-500/15 text-xs text-red-400 space-y-1.5 flex flex-col items-center text-center">
            <MicOff className="w-8 h-8 text-red-500 animate-pulse" />
            <p className="font-bold">Web Speech API is not supported in window context.</p>
            <p className="text-[10px] text-text-desc">Please try Chrome or Edge browser for full speech synthesis / recognition capability.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-text-desc leading-relaxed">
              Click the record button and initiate speaking your audio content. Requires active permission in your browser settings.
            </p>

            <div className="flex items-center justify-center p-4 bg-main-bg/55 rounded border border-white/5 relative">
              {listening ? (
                <div className="flex flex-col items-center space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="recording-pulse" />
                    <span className="text-xs font-mono font-bold text-accent-cyan text-glow animate-pulse">RECORDING SOUNDS...</span>
                  </div>
                  <button
                    onClick={toggleListening}
                    className="p-4 bg-red-500 hover:bg-red-600 text-white rounded-full transition-all focus:outline-none cursor-pointer"
                  >
                    <MicOff className="w-6 h-6" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-3">
                  <span className="text-[10.5px] font-mono text-text-desc uppercase font-bold tracking-tight">System calibrated and ready</span>
                  <button
                    onClick={toggleListening}
                    className="p-4 bg-accent-cyan hover:bg-accent-alt text-black rounded-full transition-all focus:outline-none bounce cursor-pointer shadow-lg hover:shadow-[#42f8f5]/40"
                  >
                    <Mic className="w-6 h-6" />
                  </button>
                </div>
              )}
            </div>

            {/* Results */}
            <div className="space-y-1 pt-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-mono text-text-desc font-bold">Dynamic Live Transcript</span>
                {transcript && (
                  <button
                    onClick={copyResult}
                    className="px-1.5 py-0.5 bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/10 rounded text-[9.5px] font-mono font-bold flex items-center space-x-0.5 cursor-pointer"
                  >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                )}
              </div>
              <textarea
                readOnly
                rows={4}
                value={transcript || 'Speak or record something to populate this transcript...'}
                className="w-full bg-main-bg/85 border border-white/5 rounded px-2.5 py-1.5 text-xs text-white outline-none focus:border-accent-cyan font-mono"
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
