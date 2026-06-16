import React, { useState } from 'react';
import { DollarSign, Landmark, CreditCard, Percent } from 'lucide-react';

export default function EmiCalculator() {
  const [loanAmount, setLoanAmount] = useState<number>(100000);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [duration, setDuration] = useState<number>(24); // in months
  const [durationType, setDurationType] = useState<string>('months');

  // Calculates financial figures
  const n = durationType === 'years' ? duration * 12 : duration;
  const r = (interestRate / 12) / 100;
  const p = loanAmount;

  let emi = 0;
  if (r > 0) {
    emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  } else {
    emi = p / n;
  }

  const totalAmount = emi * n;
  const totalInterest = totalAmount - p;

  const principalPercent = totalAmount > 0 ? (p / totalAmount) * 100 : 100;
  const interestPercent = totalAmount > 0 ? (totalInterest / totalAmount) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-accent-cyan text-glow">EMI Calculator</h3>
        <span className="text-xs text-text-desc font-mono">LOAN INTEREST ESTIMATOR</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-nav-bg/60 p-4 rounded-lg border border-accent-cyan/10">
        
        {/* Input Form */}
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-mono text-text-desc flex items-center space-x-1.5">
              <Landmark className="w-3.5 h-3.5 text-accent-cyan" />
              <span>Loan Amount ($)</span>
            </label>
            <input
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Math.max(1, Number(e.target.value)))}
              className="w-full bg-main-bg border border-accent-cyan/30 rounded px-3 py-1.5 text-white outline-none focus:border-accent-cyan font-mono text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-text-desc flex items-center space-x-1.5">
              <Percent className="w-3.5 h-3.5 text-accent-cyan" />
              <span>Interest Rate (% per annum)</span>
            </label>
            <input
              type="number"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Math.max(0.1, Number(e.target.value)))}
              className="w-full bg-main-bg border border-accent-cyan/30 rounded px-3 py-1.5 text-white outline-none focus:border-accent-cyan font-mono text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-text-desc flex items-center space-x-1.5">
              <CreditCard className="w-3.5 h-3.5 text-accent-cyan" />
              <span>Repayment Duration</span>
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Math.max(1, Number(e.target.value)))}
                className="flex-1 bg-main-bg border border-accent-cyan/30 rounded px-3 py-1.5 text-white outline-none focus:border-accent-cyan font-mono text-sm"
              />
              <select
                value={durationType}
                onChange={(e) => setDurationType(e.target.value)}
                className="bg-main-bg border border-accent-cyan/30 rounded px-2 py-1.5 text-white outline-none focus:border-accent-cyan text-xs font-bold font-mono"
              >
                <option value="months">Months</option>
                <option value="years">Years</option>
              </select>
            </div>
          </div>
        </div>

        {/* Outputs and Chart */}
        <div className="space-y-4 flex flex-col justify-between">
          <div className="space-y-2 text-sm font-mono p-3 bg-main-bg/50 rounded border border-white/5">
            <div className="flex justify-between border-b border-white/5 pb-1.5">
              <span className="text-text-desc">Monthly EMI:</span>
              <span className="text-accent-cyan font-bold">${emi.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-desc">Principal Amount:</span>
              <span className="text-white">${loanAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-desc">Interest Payable:</span>
              <span className="text-accent-alt">${totalInterest.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between border-t border-white/10 pt-1.5 font-bold">
              <span className="text-text-desc">Total Repayment:</span>
              <span className="text-white">${totalAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
            </div>
          </div>

          {/* SVG Pie Representation */}
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] uppercase font-bold text-text-desc font-mono">
              <span>Principal vs. Interest Percentage</span>
            </div>
            <div className="w-full bg-[#0d0f14] h-4 rounded overflow-hidden flex border border-accent-cyan/10">
              <div
                style={{ width: `${principalPercent}%` }}
                className="bg-accent-cyan flex items-center justify-center text-[10px] text-black font-extrabold"
              >
                {principalPercent > 20 && `${principalPercent.toFixed(1)}%`}
              </div>
              <div
                style={{ width: `${interestPercent}%` }}
                className="bg-accent-alt flex items-center justify-center text-[10px] text-black font-extrabold"
              >
                {interestPercent > 20 && `${interestPercent.toFixed(1)}%`}
              </div>
            </div>
            <div className="flex justify-start space-x-4 text-[10px] font-mono">
              <div className="flex items-center space-x-1">
                <div className="w-2.5 h-2.5 bg-accent-cyan rounded" />
                <span className="text-white font-semibold">Principal (${p.toLocaleString()})</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2.5 h-2.5 bg-accent-alt rounded" />
                <span className="text-white font-semibold">Interest (${totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })})</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
