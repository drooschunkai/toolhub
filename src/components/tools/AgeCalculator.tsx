import React, { useState, useEffect } from 'react';
import { Calendar, Hourglass, Timer } from 'lucide-react';

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState<string>('');
  const [ageDetails, setAgeDetails] = useState<{
    years: number;
    months: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    totalDays: number;
  } | null>(null);

  useEffect(() => {
    if (!birthDate) return;

    const interval = setInterval(() => {
      const birth = new Date(birthDate);
      const now = new Date();

      if (birth > now) {
        setAgeDetails(null);
        return;
      }

      let years = now.getFullYear() - birth.getFullYear();
      let months = now.getMonth() - birth.getMonth();
      let days = now.getDate() - birth.getDate();

      if (days < 0) {
        months -= 1;
        // get days of previous month
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
      }

      if (months < 0) {
        years -= 1;
        months += 12;
      }

      const totalMs = now.getTime() - birth.getTime();
      const totalDays = Math.floor(totalMs / (1000 * 60 * 60 * 24));
      
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();

      setAgeDetails({
        years,
        months,
        days,
        hours,
        minutes,
        seconds,
        totalDays,
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [birthDate]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-accent-cyan text-glow">Age Calculator</h3>
        <span className="text-xs text-text-desc font-mono">LIVE MILLISECOND CHRONO</span>
      </div>

      <div className="bg-nav-bg/60 p-4 rounded-lg border border-accent-cyan/10 space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-mono text-text-desc flex items-center space-x-1.5">
            <Calendar className="w-3.5 h-3.5 text-accent-cyan" />
            <span>Select Date of Birth</span>
          </label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full bg-main-bg border border-accent-cyan/30 rounded px-3 py-2 text-white outline-none focus:border-accent-cyan text-sm"
          />
        </div>

        {ageDetails ? (
          <div className="space-y-4 animate-fadeIn">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-main-bg/50 p-3 rounded border border-white/5 flex flex-col justify-center">
                <span className="text-2xl font-bold font-mono text-accent-cyan text-glow">{ageDetails.years}</span>
                <span className="text-[10px] text-text-desc uppercase font-semibold">Years</span>
              </div>
              <div className="bg-main-bg/50 p-3 rounded border border-white/5 flex flex-col justify-center">
                <span className="text-2xl font-bold font-mono text-accent-cyan text-glow">{ageDetails.months}</span>
                <span className="text-[10px] text-text-desc uppercase font-semibold">Months</span>
              </div>
              <div className="bg-main-bg/50 p-3 rounded border border-white/5 flex flex-col justify-center">
                <span className="text-2xl font-bold font-mono text-accent-cyan text-glow">{ageDetails.days}</span>
                <span className="text-[10px] text-text-desc uppercase font-semibold">Days</span>
              </div>
            </div>

            <div className="bg-main-bg/40 p-4 rounded border border-accent-cyan/15 space-y-3">
              <span className="text-xs font-mono text-text-desc flex items-center space-x-1.5 uppercase font-bold tracking-wider">
                <Timer className="w-4 h-4 text-accent-cyan animate-spin" style={{ animationDuration: '4s' }} />
                <span>Precise live tickers:</span>
              </span>

              <div className="grid grid-cols-4 gap-2 text-center font-mono">
                <div className="bg-[#080d12] p-2 rounded">
                  <p className="text-lg font-bold text-white">{ageDetails.hours.toString().padStart(2, '0')}</p>
                  <p className="text-[8px] text-text-desc uppercase">hours</p>
                </div>
                <div className="bg-[#080d12] p-2 rounded">
                  <p className="text-lg font-bold text-white">{ageDetails.minutes.toString().padStart(2, '0')}</p>
                  <p className="text-[8px] text-text-desc uppercase">mins</p>
                </div>
                <div className="bg-[#080d12] p-2 rounded">
                  <p className="text-lg font-bold text-accent-cyan">{ageDetails.seconds.toString().padStart(2, '0')}</p>
                  <p className="text-[8px] text-accent-cyan uppercase">secs</p>
                </div>
                <div className="bg-[#080d12] p-2 rounded flex flex-col justify-center">
                  <p className="text-xs font-bold text-text-desc">#{ageDetails.totalDays}</p>
                  <p className="text-[8px] text-text-desc uppercase">tot days</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center p-6 bg-main-bg/30 rounded border border-white/5 text-text-desc text-sm flex flex-col items-center justify-center space-y-2">
            <Hourglass className="w-8 h-8 text-accent-cyan/40" />
            <p>Enter your birth date above to view exact chronological age details updating live.</p>
          </div>
        )}
      </div>
    </div>
  );
}
