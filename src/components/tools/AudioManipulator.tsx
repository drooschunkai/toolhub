import React, { useState, useRef } from 'react';
import { Upload, Music, Play, Pause, Save, CheckCircle, RefreshCw } from 'lucide-react';

export default function AudioManipulator() {
  const [file, setFile] = useState<File | null>(null);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [gainValue, setGainValue] = useState<number>(1.0);
  const [pitchRate, setPitchRate] = useState<number>(1.0);
  const [processing, setProcessing] = useState<boolean>(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setAudioSrc(URL.createObjectURL(selected));
      setDownloadUrl(null);
      setSuccess(false);
    }
  };

  const handleApplyChanges = async () => {
    if (!file) return;
    setProcessing(true);
    setSuccess(false);

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const context = new AudioCtx();
      const arrayBuffer = await file.arrayBuffer();
      const decodedBuffer = await context.decodeAudioData(arrayBuffer);

      // Create offline context to render modifications at maximum speed
      const OfflineCtx = window.OfflineAudioContext || (window as any).webkitOfflineAudioContext;
      const offlineContext = new OfflineCtx(
        decodedBuffer.numberOfChannels,
        decodedBuffer.length,
        decodedBuffer.sampleRate
      );

      // Source
      const sourceNode = offlineContext.createBufferSource();
      sourceNode.buffer = decodedBuffer;
      sourceNode.playbackRate.value = pitchRate;

      // Gain (Volume multiplier)
      const gainNode = offlineContext.createGain();
      gainNode.gain.value = gainValue;

      // Connect
      sourceNode.connect(gainNode);
      gainNode.connect(offlineContext.destination);

      // Render
      sourceNode.start(0);
      const renderedBuffer = await offlineContext.startRendering();

      // Encode buffer to WAV
      const wavBlob = audioBufferToWav(renderedBuffer);
      const outputUrl = URL.createObjectURL(wavBlob);
      setDownloadUrl(outputUrl);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      alert('Error rendering updated audio buffer.');
    } finally {
      setProcessing(false);
    }
  };

  // Helper WAV Encoder (Standard layout)
  function audioBufferToWav(buffer: AudioBuffer) {
    const numOfChan = buffer.numberOfChannels;
    const length = buffer.length * numOfChan * 2 + 44;
    const bufferArr = new ArrayBuffer(length);
    const view = new DataView(bufferArr);
    const channels = [];
    let i = 0;
    let sample = 0;
    let offset = 0;
    let pos = 0;

    const setUint16 = (data: number) => { view.setUint16(pos, data, true); pos += 2; };
    const setUint32 = (data: number) => { view.setUint32(pos, data, true); pos += 4; };

    setUint32(0x46464952); // "RIFF"
    setUint32(length - 8);
    setUint32(0x45564157); // "WAVE"
    setUint32(0x20746d66); // "fmt "
    setUint32(16);
    setUint16(1);
    setUint16(numOfChan);
    setUint32(buffer.sampleRate);
    setUint32(buffer.sampleRate * 2 * numOfChan);
    setUint16(numOfChan * 2);
    setUint16(16);
    setUint32(0x61746164); // "data"
    setUint32(length - pos - 4);

    for (i = 0; i < numOfChan; i++) {
      channels.push(buffer.getChannelData(i));
    }

    while (pos < length) {
      for (i = 0; i < numOfChan; i++) {
        sample = Math.max(-1, Math.min(1, channels[i][offset]));
        sample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
        view.setInt16(pos, sample, true);
        pos += 2;
      }
      offset++;
    }

    return new Blob([bufferArr], { type: 'audio/wav' });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-accent-cyan text-glow">Audio Manipulator</h3>
        <span className="text-xs text-text-desc font-mono">GAIN • PLAYBACK SPEED</span>
      </div>

      {!audioSrc ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-accent-cyan/20 hover:border-accent-cyan/80 bg-nav-bg/40 rounded-xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-4 min-h-[160px]"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="audio/*"
            className="hidden"
          />
          <Music className="w-10 h-10 text-accent-cyan/60 pulse-glower" />
          <div>
            <p className="text-white text-sm font-medium">Click to load local audio file</p>
            <p className="text-xs text-text-desc mt-0.5">MP3, WAV, AAC, M4A local rendering support</p>
          </div>
        </div>
      ) : (
        <div className="bg-nav-bg/60 p-4 rounded-lg border border-accent-cyan/10 space-y-4">
          <div className="bg-main-bg/40 p-3 rounded flex flex-col items-center space-y-2 border border-white/5">
            <span className="text-xs font-mono text-text-desc truncate max-w-full font-semibold">{file?.name}</span>
            <audio ref={audioRef} src={audioSrc} controls className="w-full h-10 accent-accent-cyan" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Gain control */}
            <div className="space-y-2 p-3 bg-main-bg/50 rounded border border-white/5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-text-desc">Boost Volume (Gain)</span>
                <span className="text-accent-cyan font-bold font-mono">{gainValue.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="3.0"
                step="0.1"
                value={gainValue}
                onChange={(e) => setGainValue(Number(e.target.value))}
                className="w-full accent-accent-cyan cursor-pointer"
              />
              <p className="text-[10px] text-text-desc/70">Raise or reduce the audio decibel output multiplier.</p>
            </div>

            {/* Playback speed */}
            <div className="space-y-2 p-3 bg-main-bg/50 rounded border border-white/5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-text-desc">Playback Speed Rate</span>
                <span className="text-accent-cyan font-bold font-mono">{pitchRate.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.05"
                value={pitchRate}
                onChange={(e) => setPitchRate(Number(e.target.value))}
                className="w-full accent-accent-cyan cursor-pointer"
              />
              <p className="text-[10px] text-text-desc/70">Speeds up or slows down duration & sample pitch.</p>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleApplyChanges}
              disabled={processing}
              className="flex-1 bg-nav-bg hover:bg-accent-cyan border border-accent-cyan text-white hover:text-black font-bold py-2 rounded transition-all text-sm uppercase flex items-center justify-center space-x-2 cursor-pointer"
            >
              {processing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Rendering WAV...</span>
                </>
              ) : (
                <span>Re-Render modified parameters</span>
              )}
            </button>

            {downloadUrl && (
              <a
                href={downloadUrl}
                download="manipulated-audio.wav"
                className="flex-1 bg-accent-cyan hover:bg-accent-alt text-black font-bold py-2 rounded transition-all text-sm uppercase flex items-center justify-center space-x-2 text-center"
              >
                <Save className="w-4 h-4" />
                <span>Download WAV</span>
              </a>
            )}
          </div>

          {success && (
            <div className="flex items-center space-x-2 text-emerald-400 text-sm justify-center bg-emerald-500/10 p-2 rounded">
              <CheckCircle className="w-4 h-4" />
              <span>Audio successfully modified on client. Perfect conversion!</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
