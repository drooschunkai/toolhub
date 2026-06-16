import React, { useState, useRef } from 'react';
import { Upload, Video, Play, Pause, Camera, Info, Sparkles } from 'lucide-react';

export default function VideoController() {
  const [file, setFile] = useState<File | null>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [volume, setVolume] = useState<number>(1.0);
  const [duration, setDuration] = useState<number>(0);
  const [snapshot, setSnapshot] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setVideoSrc(URL.createObjectURL(selected));
      setSnapshot(null);
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSpeedChange = (speed: number) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = speed;
    setPlaybackSpeed(speed);
  };

  const handleVolumeChange = (val: number) => {
    if (!videoRef.current) return;
    videoRef.current.volume = val;
    setVolume(val);
  };

  const handleMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  const captureSnapshot = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setSnapshot(dataUrl);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-accent-cyan text-glow">Video Controller & Inspector</h3>
        <span className="text-xs text-text-desc font-mono">FRAME CAPTURE • PLAYBACK RATE</span>
      </div>

      {!videoSrc ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-accent-cyan/20 hover:border-accent-cyan/80 bg-nav-bg/40 rounded-xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-4 min-h-[180px]"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="video/*"
            className="hidden"
          />
          <Video className="w-10 h-10 text-accent-cyan/60 pulse-glower" />
          <div>
            <p className="text-white text-sm font-medium">Click to load local video file</p>
            <p className="text-xs text-text-desc mt-0.5">MP4, WebM or Ogg - all decoded sandbox-safe</p>
          </div>
        </div>
      ) : (
        <div className="bg-nav-bg/60 p-4 rounded-lg border border-accent-cyan/10 space-y-4">
          
          <div className="relative border border-white/10 rounded-lg overflow-hidden bg-black flex items-center justify-center max-h-[350px]">
            <video
              ref={videoRef}
              src={videoSrc}
              className="w-full max-h-[340px]"
              onLoadedMetadata={handleMetadata}
              onClick={togglePlay}
              onEnded={() => setIsPlaying(false)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Visual Indicators */}
            <div className="space-y-3 p-3 bg-main-bg/50 rounded border border-white/5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-desc flex items-center space-x-1">
                  <Info className="w-3.5 h-3.5 text-accent-cyan" />
                  <span>Video Information</span>
                </span>
              </div>
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-text-desc">Filename:</span>
                  <span className="text-white truncate max-w-[155px]">{file?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-desc">Duration:</span>
                  <span className="text-white">{duration ? `${duration.toFixed(2)} seconds` : 'Loading...'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-desc">Filesize:</span>
                  <span className="text-white">{file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : '0 MB'}</span>
                </div>
              </div>
            </div>

            {/* Speeds & Volumes */}
            <div className="space-y-3 p-3 bg-main-bg/50 rounded border border-white/5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-text-desc">Playback Speed</span>
                <span className="text-accent-cyan font-bold font-mono">{playbackSpeed}x</span>
              </div>
              <div className="flex gap-2">
                {[0.5, 1.0, 1.5, 2.0].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => handleSpeedChange(spd)}
                    className={`flex-1 py-1 rounded cursor-pointer transition-all ${
                      playbackSpeed === spd
                        ? 'bg-accent-cyan text-black font-bold'
                        : 'bg-nav-bg border border-accent-cyan/15 hover:border-accent-cyan/50 text-white'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>

              <div className="flex justify-between items-center pt-1.5">
                <span className="text-text-desc">Engine Volume</span>
                <span className="text-accent-cyan font-mono">{Math.round(volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                className="w-full accent-accent-cyan cursor-pointer"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={togglePlay}
              className="px-4 py-2 bg-accent-cyan hover:bg-accent-alt text-black font-bold rounded text-xs uppercase flex items-center space-x-1"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>
            <button
              onClick={captureSnapshot}
              className="px-4 py-2 bg-nav-bg border border-accent-cyan text-white hover:bg-accent-cyan hover:text-black font-bold rounded text-xs uppercase flex items-center space-x-1"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Snapshot Frame</span>
            </button>
            <button
              onClick={() => {
                setVideoSrc(null);
                setSnapshot(null);
                setFile(null);
              }}
              className="px-4 py-2 bg-red-500/10 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded text-xs font-bold uppercase ml-auto"
            >
              Close Video
            </button>
          </div>

          {/* Snapshot result */}
          {snapshot && (
            <div className="border-t border-accent-cyan/15 pt-4 space-y-2">
              <div className="flex items-center space-x-1 text-accent-cyan text-xs font-mono">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Captured Frame Quality JPEG</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 bg-black/40 p-3 rounded">
                <img src={snapshot} alt="Captured frame" className="max-h-24 rounded border border-accent-cyan/40" />
                <div className="space-y-1 text-xs">
                  <p className="text-text-desc">Frame exported out at full original resolution. Perfect for quick screenshots or timestamps.</p>
                  <a
                    href={snapshot}
                    download="video-snapshot.jpg"
                    className="inline-block bg-emerald-500 hover:bg-emerald-600 text-black font-bold px-3 py-1.5 rounded uppercase mt-1"
                  >
                    Download Frame
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
