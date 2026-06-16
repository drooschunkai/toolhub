import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, Square, Sliders, RefreshCw, Download, AlertTriangle } from 'lucide-react';

export default function TextToSpeech() {
  const [text, setText] = useState<string>('Welcome to toolhub. This is a fully browser-native text to speech voice synthesizer.');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [rate, setRate] = useState<number>(1.0);
  const [pitch, setPitch] = useState<number>(1.0);
  const [speakingState, setSpeakingState] = useState<'idle' | 'speaking' | 'paused'>('idle');
  const [downloading, setDownloading] = useState<boolean>(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  useEffect(() => {
    const synth = window.speechSynthesis;
    const loadVoices = () => {
      const avail = synth.getVoices() || [];
      setVoices(avail);
      if (avail.length > 0) {
        // Default to first english voice if available
        const defaultVoice = avail.find(v => v.lang.includes('en')) || avail[0];
        setSelectedVoice(defaultVoice.name);
      }
    };

    loadVoices();
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = loadVoices;
    }

    return () => {
      synth.cancel();
    };
  }, []);

  const handleSpeak = () => {
    if (!text.trim()) return;

    const synth = window.speechSynthesis;
    if (speakingState === 'paused') {
      synth.resume();
      setSpeakingState('speaking');
      return;
    }

    synth.cancel(); // Stop current

    const utterance = new SpeechSynthesisUtterance(text);
    const chosen = voices.find(v => v.name === selectedVoice);
    if (chosen) {
      utterance.voice = chosen;
    }
    utterance.rate = rate;
    utterance.pitch = pitch;

    utterance.onend = () => {
      setSpeakingState('idle');
    };
    utterance.onerror = () => {
      setSpeakingState('idle');
    };

    synth.speak(utterance);
    setSpeakingState('speaking');
  };

  const handlePause = () => {
    const synth = window.speechSynthesis;
    if (speakingState === 'speaking') {
      synth.pause();
      setSpeakingState('paused');
    }
  };

  const handleStop = () => {
    const synth = window.speechSynthesis;
    synth.cancel();
    setSpeakingState('idle');
  };

  const handleDownload = async () => {
    if (!text.trim()) return;
    setDownloading(true);
    setDownloadError(null);

    try {
      const chosen = voices.find(v => v.name === selectedVoice);
      const langCode = chosen ? chosen.lang.split('-')[0] : 'en';

      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          lang: langCode,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || 'Server Synthesis API error.');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `tts-speech-${langCode}-${Date.now()}.mp3`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error(err);
      setDownloadError(err.message || 'Failed to download speech synthesis audio.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-accent-cyan text-glow">Text to Speech Synth</h3>
        <span className="text-xs text-text-desc font-mono">BROWN VOICE SYNTHESIS</span>
      </div>

      <div className="bg-nav-bg/60 p-4 rounded-lg border border-accent-cyan/10 space-y-4">
        
        {/* Dynamic Voice selection and input text */}
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-text-desc">Engine Voice Select</label>
              <select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                className="w-full bg-main-bg border border-accent-cyan/30 rounded px-2 py-1 text-white outline-none focus:border-accent-cyan text-[11px]"
              >
                {voices.length > 0 ? (
                  voices.map((v) => (
                    <option key={v.name} value={v.name}>
                      {v.name} ({v.lang})
                    </option>
                  ))
                ) : (
                  <option value="">Browser Default Engine</option>
                )}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-text-desc">Voice Speed Pitch Rate</label>
              <div className="flex items-center space-x-2 text-white font-mono">
                <Sliders className="w-3.5 h-3.5 text-accent-cyan" />
                <span className="text-accent-cyan font-bold">{rate.toFixed(1)}x Rate</span>
              </div>
            </div>
          </div>

          <textarea
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type content to convert to synthesised reading speech..."
            className="w-full bg-main-bg border border-accent-cyan/30 rounded px-3 py-2 text-white outline-none focus:border-accent-cyan text-xs"
          />
        </div>

        {/* Speed / Pitch Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5 p-3 bg-main-bg/50 rounded border border-white/5 text-xs">
            <div className="flex justify-between">
              <span className="text-text-desc">Speech pacing rate (Speed)</span>
              <span className="text-accent-cyan font-mono">{rate}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full accent-accent-cyan cursor-pointer"
            />
          </div>

          <div className="space-y-1.5 p-3 bg-main-bg/50 rounded border border-white/5 text-xs">
            <div className="flex justify-between">
              <span className="text-text-desc">Speech pitch (Frequency)</span>
              <span className="text-accent-cyan font-mono">{pitch}</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={pitch}
              onChange={(e) => setPitch(Number(e.target.value))}
              className="w-full accent-accent-cyan cursor-pointer"
            />
          </div>
        </div>

        {/* Playback Trigger & Download Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-1.5">
          <div className="flex flex-1 space-x-2">
            <button
              onClick={handleSpeak}
              className="flex-1 bg-accent-cyan hover:bg-accent-alt text-black font-extrabold py-2 px-4 rounded transition-all text-xs uppercase flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              {speakingState === 'speaking' ? <Volume2 className="w-4 h-4 animate-bounce" /> : <Play className="w-4 h-4" />}
              <span>Speak Voice</span>
            </button>

            {speakingState === 'speaking' && (
              <button
                onClick={handlePause}
                className="bg-main-bg border border-accent-cyan hover:text-black hover:bg-accent-cyan text-white p-2 rounded px-3 text-xs uppercase flex items-center space-x-1 font-bold cursor-pointer"
              >
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </button>
            )}

            {speakingState !== 'idle' && (
              <button
                onClick={handleStop}
                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 p-2 rounded px-3 text-xs uppercase flex items-center space-x-1 font-bold cursor-pointer"
              >
                <Square className="w-4 h-4" />
                <span>Stop</span>
              </button>
            )}
          </div>

          <button
            onClick={handleDownload}
            disabled={downloading || !text.trim()}
            className="w-full sm:w-auto bg-nav-bg border border-accent-cyan/14 hover:bg-accent-cyan hover:text-black disabled:border-white/10 disabled:text-text-desc/40 disabled:hover:bg-transparent disabled:hover:text-text-desc/40 text-accent-cyan font-extrabold py-2 px-4 rounded transition-all text-xs uppercase flex items-center justify-center space-x-1.5 cursor-pointer"
            id="download_tts_button"
          >
            <Download className={`w-4 h-4 ${downloading ? 'animate-pulse' : ''}`} />
            <span>{downloading ? 'Merging...' : 'Download MP3'}</span>
          </button>
        </div>

        {downloadError && (
          <div className="flex items-start space-x-2 p-2.5 bg-red-500/10 border border-red-500/20 rounded text-xs text-red-400 font-mono animate-fadeIn" id="download_error_banner">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{downloadError}</span>
          </div>
        )}

      </div>
    </div>
  );
}
