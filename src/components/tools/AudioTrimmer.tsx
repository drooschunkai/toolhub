import React, { useState, useRef } from 'react';
import { Upload, Music, Scissors, Info, Play, Pause, Download, RefreshCw } from 'lucide-react';

export default function AudioTrimmer() {
  const [file, setFile] = useState<File | null>(null);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(10);
  const [duration, setDuration] = useState<number>(0);
  const [trimming, setTrimming] = useState<boolean>(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setAudioSrc(URL.createObjectURL(selected));
      setDownloadUrl(null);

      // Extract duration using lightweight sandbox Audio context decoding
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        const ab = await selected.arrayBuffer();
        const decoded = await ctx.decodeAudioData(ab);
        setDuration(decoded.duration);
        setStartTime(0);
        setEndTime(Math.min(decoded.duration, 10)); // Default to first 10 seconds
      } catch (err) {
        console.error('Failed to parse audio length', err);
        // Fallback guess length
        setDuration(120);
        setStartTime(0);
        setEndTime(15);
      }
    }
  };

  const trimAudio = async () => {
    if (!file) return;
    setTrimming(true);
    setDownloadUrl(null);

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const context = new AudioCtx();
      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await context.decodeAudioData(arrayBuffer);

      const sampleRate = audioBuffer.sampleRate;
      const startOffset = Math.max(0, startTime * sampleRate);
      const endOffset = Math.min(audioBuffer.length, endTime * sampleRate);
      const frameCount = Math.max(1, endOffset - startOffset);

      if (frameCount <= 0 || startOffset >= endOffset) {
        alert('Start time must be strictly less than end time.');
        setTrimming(false);
        return;
      }

      // Create new buffer for trimmed fragment
      const newBuffer = context.createBuffer(
        audioBuffer.numberOfChannels,
        frameCount,
        sampleRate
      );

      for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
        const sourceData = audioBuffer.getChannelData(i);
        const destinationData = newBuffer.getChannelData(i);
        // Extract sliced PCM channel data array portion
        const segment = sourceData.subarray(startOffset, endOffset);
        destinationData.set(segment);
      }

      // Convert buffer to WAV
      const wavBlob = audioBufferToWav(newBuffer);
      const url = URL.createObjectURL(wavBlob);
      setDownloadUrl(url);
    } catch (err) {
      console.error(err);
      alert('Error trimming audio. Make sure the file isn\'t too large.');
    } finally {
      setTrimming(false);
    }
  };

  // Standard WAV Encoder
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
        <h3 className="text-xl font-bold text-accent-cyan text-glow">Audio Trimmer</h3>
        <span className="text-xs text-text-desc font-mono">DURATIONS • RANGE CROP</span>
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
          <Scissors className="w-10 h-10 text-accent-cyan/60 pulse-glower" />
          <div>
            <p className="text-white text-sm font-medium">Click to upload audio file</p>
            <p className="text-xs text-text-desc mt-0.5">WAV, MP3, AAC supported for quick precision cropping</p>
          </div>
        </div>
      ) : (
        <div className="bg-nav-bg/60 p-4 rounded-lg border border-accent-cyan/10 space-y-4">
          <div className="bg-main-bg/40 p-3 rounded flex flex-col items-center space-y-2 border border-white/5">
            <span className="text-xs font-mono text-text-desc truncate max-w-full font-bold">{file?.name}</span>
            <audio ref={audioRef} src={audioSrc} controls className="w-full h-10 accent-accent-cyan" />
            <div className="text-xs font-mono text-accent-cyan self-start mt-1">
              Total Duration: {duration.toFixed(2)}s
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Start offset */}
            <div className="space-y-2 p-3 bg-main-bg/50 rounded border border-white/5 text-xs">
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-desc">Trim Start Cut Time</span>
                <span className="text-accent-cyan font-bold font-mono">{startTime.toFixed(2)}s</span>
              </div>
              <input
                type="range"
                min="0"
                max={Math.max(0, endTime - 0.1)}
                step="0.05"
                value={startTime}
                onChange={(e) => setStartTime(Number(e.target.value))}
                className="w-full accent-accent-cyan cursor-pointer"
              />
              <p className="text-[10px] text-text-desc/70">Move slider to define where your trimmed audio clip begins.</p>
            </div>

            {/* End offset */}
            <div className="space-y-2 p-3 bg-main-bg/50 rounded border border-white/5 text-xs">
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-desc">Trim End Cut Time</span>
                <span className="text-accent-cyan font-bold font-mono">{endTime.toFixed(2)}s</span>
              </div>
              <input
                type="range"
                min={startTime + 0.1}
                max={duration || 120}
                step="0.05"
                value={endTime}
                onChange={(e) => setEndTime(Number(e.target.value))}
                className="w-full accent-accent-cyan cursor-pointer"
              />
              <p className="text-[10px] text-text-desc/70">Move slider to define where your trimmed audio clip terminates.</p>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={trimAudio}
              disabled={trimming}
              className="flex-1 bg-nav-bg hover:bg-accent-cyan border border-accent-cyan text-white hover:text-black font-bold py-2 rounded transition-all text-sm uppercase flex items-center justify-center space-x-2 cursor-pointer"
            >
              {trimming ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Slicing audio track...</span>
                </>
              ) : (
                <span>Trim Segment</span>
              )}
            </button>

            {downloadUrl && (
              <a
                href={downloadUrl}
                download={`trimmed_${file?.name || 'audio'}.wav`}
                className="flex-1 bg-accent-cyan hover:bg-accent-alt text-black font-bold py-2 rounded transition-all text-sm uppercase flex items-center justify-center space-x-2 text-center"
              >
                <Download className="w-4 h-4" />
                <span>Save Trimmed WAV</span>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
