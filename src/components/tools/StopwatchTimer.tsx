import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Award, Trash2, Bell, AlertTriangle } from 'lucide-react';

export default function StopwatchTimer() {
  const [mode, setMode] = useState<'stopwatch' | 'timer'>('stopwatch');

  // STOPWATCH STATE
  const [swActive, setSwActive] = useState<boolean>(false);
  const [swTime, setSwTime] = useState<number>(0); // in ms
  const [laps, setLaps] = useState<number[]>([]);
  const swIntervalRef = useRef<any>(null);

  // TIMER STATE
  const [timerMinutes, setTimerMinutes] = useState<number>(5);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [timerRemaining, setTimerRemaining] = useState<number>(300); // in seconds
  const timerIntervalRef = useRef<any>(null);

  // STOPWATCH CLEAN EFFECT
  useEffect(() => {
    if (swActive) {
      const startTime = Date.now() - swTime;
      swIntervalRef.current = setInterval(() => {
        setSwTime(Date.now() - startTime);
      }, 10);
    } else {
      clearInterval(swIntervalRef.current);
    }
    return () => clearInterval(swIntervalRef.current);
  }, [swActive]);

  // TIMER CLEAN EFFECT
  useEffect(() => {
    if (timerActive) {
      timerIntervalRef.current = setInterval(() => {
        setTimerRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current);
            setTimerActive(false);
            triggerAlarmSignal();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerIntervalRef.current);
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [timerActive]);

  const triggerAlarmSignal = () => {
    // Generate browser sine-wave beep sound sandbox-safe (very futuristic!)
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 chord tone
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch (err) {
      console.log('Oscillator failed', err);
    }
    alert('Timer Countdown Finished!');
  };

  // Stopwatch triggers
  const handleSwReset = () => {
    setSwActive(false);
    setSwTime(0);
    setLaps([]);
  };

  const handleSwLap = () => {
    setLaps((prev) => [swTime, ...prev]);
  };

  // Timer triggers
  const syncTimerFromPickers = () => {
    const total = (timerMinutes * 60) + timerSeconds;
    setTimerRemaining(total);
  };

  useEffect(() => {
    if (!timerActive) {
      syncTimerFromPickers();
    }
  }, [timerMinutes, timerSeconds, timerActive]);

  const formatSwTime = (ms: number) => {
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    const cents = Math.floor((ms % 1000) / 10);
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}.${cents.toString().padStart(2, '0')}`;
  };

  const formatTimerTime = (secs: number) => {
    const min = Math.floor(secs / 60);
    const sec = secs % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-accent-cyan text-glow">Time Keeper Core</h3>
        <span className="text-xs text-text-desc font-mono">STOPWATCH & TIMER</span>
      </div>

      <div className="bg-nav-bg/60 p-4 rounded-lg border border-accent-cyan/10 space-y-4">
        
        {/* Toggle Mode headers */}
        <div className="flex bg-main-bg/50 p-1 rounded border border-white/5 gap-2">
          <button
            onClick={() => setMode('stopwatch')}
            className={`flex-1 py-1 rounded cursor-pointer transition-all text-xs font-bold uppercase ${
              mode === 'stopwatch' ? 'bg-accent-cyan text-black font-extrabold shadow' : 'text-white'
            }`}
          >
            Precision Stopwatch
          </button>
          <button
            onClick={() => setMode('timer')}
            className={`flex-1 py-1 rounded cursor-pointer transition-all text-xs font-bold uppercase ${
              mode === 'timer' ? 'bg-accent-cyan text-black font-extrabold shadow' : 'text-white'
            }`}
          >
            Countdown Timer
          </button>
        </div>

        {mode === 'stopwatch' ? (
          /* STOPWATCH INTERFACE */
          <div className="space-y-4 text-center font-mono">
            <div className="text-4xl sm:text-5xl font-extrabold text-accent-cyan tracking-wider text-glow py-3">
              {formatSwTime(swTime)}
            </div>

            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setSwActive(!swActive)}
                className="px-6 py-2 bg-accent-cyan hover:bg-accent-alt text-black font-extrabold rounded text-xs uppercase flex items-center space-x-1 cursor-pointer"
              >
                {swActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{swActive ? 'Pause' : 'Start'}</span>
              </button>
              {swActive && (
                <button
                  onClick={handleSwLap}
                  className="px-5 py-2 bg-main-bg border border-accent-cyan text-white hover:text-black hover:bg-accent-cyan font-bold rounded text-xs uppercase flex items-center space-x-1 cursor-pointer"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Lap</span>
                </button>
              )}
              <button
                onClick={handleSwReset}
                className="px-5 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/25 rounded text-xs uppercase flex items-center space-x-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            {/* Lap logs */}
            {laps.length > 0 && (
              <div className="border-t border-accent-cyan/15 pt-3 text-left space-y-1.5 max-h-36 overflow-y-auto">
                <div className="flex justify-between items-center text-[10px] uppercase font-bold text-text-desc pb-1 border-b border-white/5">
                  <span>Saved Laps Records</span>
                  <button onClick={() => setLaps([])} className="p-0.5 hover:text-red-400 cursor-pointer text-text-desc">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                {laps.map((lap, idx) => (
                  <div key={idx} className="flex justify-between text-xs text-white">
                    <span className="text-text-desc font-bold">Lap #{laps.length - idx}</span>
                    <span className="font-bold">{formatSwTime(lap)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* TIMER INTERFACE */
          <div className="space-y-4 text-center font-mono">
            
            {/* Input hours/minutes sliders or selectors when inactive */}
            {!timerActive && timerRemaining === (timerMinutes * 60) + timerSeconds ? (
              <div className="flex items-center justify-center space-x-3 py-1.5">
                <div className="flex flex-col items-center">
                  <span className="text-[9px] uppercase font-bold text-text-desc mb-1">Mins</span>
                  <select
                    value={timerMinutes}
                    onChange={(e) => setTimerMinutes(Number(e.target.value))}
                    className="bg-main-bg border border-accent-cyan/30 rounded px-2.5 py-1 text-white outline-none focus:border-accent-cyan text-base font-bold scale-105"
                  >
                    {Array.from({ length: 60 }).map((_, idx) => (
                      <option key={idx} value={idx}>{idx.toString().padStart(2, '0')}</option>
                    ))}
                  </select>
                </div>
                
                <span className="text-2xl font-bold text-accent-cyan relative top-2">:</span>

                <div className="flex flex-col items-center">
                  <span className="text-[9px] uppercase font-bold text-text-desc mb-1">Secs</span>
                  <select
                    value={timerSeconds}
                    onChange={(e) => setTimerSeconds(Number(e.target.value))}
                    className="bg-main-bg border border-accent-cyan/30 rounded px-2.5 py-1 text-white outline-none focus:border-accent-cyan text-base font-bold scale-105"
                  >
                    {Array.from({ length: 60 }).map((_, idx) => (
                      <option key={idx} value={idx}>{idx.toString().padStart(2, '0')}</option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div className="text-4xl sm:text-5xl font-extrabold text-accent-cyan tracking-wider text-glow py-3">
                {formatTimerTime(timerRemaining)}
              </div>
            )}

            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setTimerActive(!timerActive)}
                className="px-6 py-2 bg-accent-cyan hover:bg-accent-alt text-black font-extrabold rounded text-xs uppercase flex items-center space-x-1.5 cursor-pointer"
              >
                {timerActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{timerActive ? 'Pause' : 'Start'}</span>
              </button>
              <button
                onClick={() => {
                  setTimerActive(false);
                  syncTimerFromPickers();
                }}
                className="px-5 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/25 rounded text-xs uppercase flex items-center space-x-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            <div className="p-2.5 bg-main-bg/35 rounded border border-white/5 text-[10.5px] text-text-desc leading-relaxed flex items-center space-x-2 justify-center">
              <Bell className="w-4 h-4 text-accent-cyan/60 flex-shrink-0 animate-bounce" />
              <span>Alarm bells trigger at absolute expiration. Sandbox-safe audio frequency.</span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
