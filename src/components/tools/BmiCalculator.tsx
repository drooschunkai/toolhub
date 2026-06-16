import React, { useState } from 'react';
import { Heart, Activity } from 'lucide-react';

export default function BmiCalculator() {
  const [height, setHeight] = useState<number>(175); // centimeters
  const [weight, setWeight] = useState<number>(70); // kilograms

  const hMeter = height / 100;
  const bmi = hMeter > 0 ? (weight / (hMeter * hMeter)) : 0;

  const getBmiCategory = () => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-amber-400', progressColor: 'bg-amber-400', desc: 'Lower than optimal body density. Focus on nutritional caloric intake.' };
    if (bmi < 25) return { label: 'Normal / Healthy Weight', color: 'text-emerald-400', progressColor: 'bg-emerald-400', desc: 'Optimal healthy range ratio. Continue balanced nutrition and exercise routines.' };
    if (bmi < 30) return { label: 'Overweight', color: 'text-orange-400', progressColor: 'bg-orange-400', desc: 'Mild excess weight detected. Regular cardio routines are beneficial.' };
    return { label: 'Obese Range', color: 'text-red-500', progressColor: 'bg-red-500', desc: 'Significant excess density indicator. Focus on clinical wellness guidelines.' };
  };

  const category = getBmiCategory();
  const progressPercent = Math.min(100, Math.max(0, ((bmi - 14) / 26) * 100)); // Normalized between BMI 14 and 40

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-accent-cyan text-glow">BMI Calculator</h3>
        <span className="text-xs text-text-desc font-mono">HEALTH ANALYSIS METRIC</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-nav-bg/60 p-4 rounded-lg border border-accent-cyan/10">
        
        {/* Sliders Input */}
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-text-desc flex items-center space-x-1">
                <Activity className="w-3.5 h-3.5 text-accent-cyan" />
                <span>Height (cm)</span>
              </span>
              <span className="text-accent-cyan font-bold">{height} cm</span>
            </div>
            <input
              type="range"
              min="100"
              max="230"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-full accent-accent-cyan cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-text-desc flex items-center space-x-1">
                <Heart className="w-3.5 h-3.5 text-red-400" />
                <span>Weight (kg)</span>
              </span>
              <span className="text-accent-cyan font-bold">{weight} kg</span>
            </div>
            <input
              type="range"
              min="30"
              max="150"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full accent-accent-cyan cursor-pointer"
            />
          </div>
        </div>

        {/* Diagnostic display feedback */}
        <div className="space-y-3 flex flex-col justify-center">
          
          <div className="bg-main-bg/50 p-3 rounded border border-white/5 text-center font-mono space-y-1">
            <span className="text-[10px] text-text-desc uppercase font-bold tracking-wider">Calculated BMI Value</span>
            <div className="text-3xl font-extrabold text-accent-cyan text-glow">
              {bmi.toFixed(2)}
            </div>
            <span className={`text-xs font-bold ${category.color}`}>
              {category.label}
            </span>
          </div>

          <div className="space-y-1 text-[10.5px] font-mono">
            <div className="flex justify-between text-text-desc">
              <span>BMI Index gauge:</span>
              <span>15 (min) - 40 (max)</span>
            </div>
            {/* Visual Gauge */}
            <div className="w-full bg-[#0d0f14] h-2.5 rounded-full overflow-hidden flex border border-white/5 relative">
              <div
                style={{ width: `${progressPercent}%` }}
                className={`h-full ${category.progressColor} rounded-full transition-all`}
              />
            </div>
            <p className="text-[10px] text-text-desc leading-relaxed pt-1 select-none">
              {category.desc}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
