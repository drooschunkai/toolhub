import React, { useState } from 'react';
import { DollarSign, Percent, Calendar, Award } from 'lucide-react';

export default function SipCalculator() {
  const [monthlySip, setMonthlySip] = useState<number>(500);
  const [returnRate, setReturnRate] = useState<number>(12);
  const [years, setYears] = useState<number>(10);

  // SIP Math Formula
  // M = P * [ ( (1 + i)^n - 1 ) / i ] * (1 + i)
  // where i = interest rate per period, n = total compounding steps
  const i = (returnRate / 100) / 12;
  const n = years * 12;
  const p = monthlySip;

  let estimatedReturn = 0;
  if (i > 0) {
    estimatedReturn = p * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
  } else {
    estimatedReturn = p * n;
  }

  const investedAmount = p * n;
  const wealthGains = estimatedReturn - investedAmount;

  const investPercent = estimatedReturn > 0 ? (investedAmount / estimatedReturn) * 100 : 100;
  const gainPercent = estimatedReturn > 0 ? (wealthGains / estimatedReturn) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-accent-cyan text-glow">SIP Calculator</h3>
        <span className="text-xs text-text-desc font-mono">COMPOUND GROWTH PROJECTOR</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-nav-bg/60 p-4 rounded-lg border border-accent-cyan/10">
        
        {/* Input Parameters */}
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-mono text-text-desc flex items-center space-x-1.5">
              <DollarSign className="w-3.5 h-3.5 text-accent-cyan" />
              <span>Monthly Investment ($)</span>
            </label>
            <input
              type="number"
              value={monthlySip}
              onChange={(e) => setMonthlySip(Math.max(10, Number(e.target.value)))}
              className="w-full bg-main-bg border border-accent-cyan/30 rounded px-3 py-1.5 text-white outline-none focus:border-accent-cyan font-mono text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-text-desc flex items-center space-x-1.5">
              <Percent className="w-3.5 h-3.5 text-accent-cyan" />
              <span>Expected Return Rate (% per annum)</span>
            </label>
            <input
              type="number"
              step="0.5"
              value={returnRate}
              onChange={(e) => setReturnRate(Math.max(0.5, Number(e.target.value)))}
              className="w-full bg-main-bg border border-accent-cyan/30 rounded px-3 py-1.5 text-white outline-none focus:border-accent-cyan font-mono text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-text-desc flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-accent-cyan" />
              <span>Duration Period (Years)</span>
            </label>
            <input
              type="number"
              value={years}
              onChange={(e) => setYears(Math.max(1, Number(e.target.value)))}
              className="w-full bg-main-bg border border-accent-cyan/30 rounded px-3 py-1.5 text-white outline-none focus:border-accent-cyan font-mono text-sm"
            />
          </div>
        </div>

        {/* Compound statistics */}
        <div className="space-y-4 flex flex-col justify-between">
          <div className="space-y-2 text-sm font-mono p-3 bg-main-bg/50 rounded border border-white/5">
            <div className="flex justify-between border-b border-white/5 pb-1.5">
              <span className="text-text-desc flex items-center space-x-1">
                <Award className="w-3.5 h-3.5 text-accent-cyan animate-pulse" />
                <span>Total Compounded Wealth:</span>
              </span>
              <span className="text-accent-cyan font-bold">${estimatedReturn.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-desc">Total Invested Amount:</span>
              <span className="text-white">${investedAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-desc">Estimated Returns (Gain):</span>
              <span className="text-accent-alt">${wealthGains.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
          </div>

          {/* SVG representation split */}
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] uppercase font-bold text-text-desc font-mono">
              <span>Investment vs Wealth Gain Ratio</span>
            </div>
            <div className="w-full bg-[#0d0f14] h-4 rounded overflow-hidden flex border border-accent-cyan/10">
              <div
                style={{ width: `${investPercent}%` }}
                className="bg-accent-cyan flex items-center justify-center text-[10px] text-black font-extrabold"
              >
                {investPercent > 20 && `${investPercent.toFixed(0)}%`}
              </div>
              <div
                style={{ width: `${gainPercent}%` }}
                className="bg-accent-alt flex items-center justify-center text-[10px] text-black font-extrabold"
              >
                {gainPercent > 20 && `${gainPercent.toFixed(0)}%`}
              </div>
            </div>
            <div className="flex justify-start space-x-4 text-[10px] font-mono">
              <div className="flex items-center space-x-1">
                <div className="w-2.5 h-2.5 bg-accent-cyan rounded" />
                <span className="text-white font-semibold">Invested (${investedAmount.toLocaleString()})</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2.5 h-2.5 bg-accent-alt rounded" />
                <span className="text-white font-semibold">Gains (${wealthGains.toLocaleString(undefined, { maximumFractionDigits: 0 })})</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
