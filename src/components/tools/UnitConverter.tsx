import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, Settings, Scale } from 'lucide-react';

type UnitCategory = 'length' | 'weight' | 'temp' | 'speed';

const unitDefinitions: Record<Exclude<UnitCategory, 'temp'>, Record<string, number>> & { temp: 'custom' } = {
  length: {
    Meter: 1,
    Kilometer: 1000,
    Foot: 0.3048,
    Mile: 1609.34,
    Inch: 0.0254,
    Centimeter: 0.01
  },
  weight: {
    Kilogram: 1,
    Gram: 0.001,
    Pound: 0.453592,
    Ounce: 0.0283495
  },
  speed: {
    'm/s': 1,
    'km/h': 0.277778,
    mph: 0.44704,
    Knots: 0.514444
  },
  temp: 'custom'
};

export default function UnitConverter() {
  const [category, setCategory] = useState<UnitCategory>('length');
  const [inputValue, setInputValue] = useState<number>(1);
  const [fromUnit, setFromUnit] = useState<string>('');
  const [toUnit, setToUnit] = useState<string>('');
  const [outputValue, setOutputValue] = useState<number>(0);

  // Sync available options on category load
  useEffect(() => {
    let list: string[] = [];
    if (category === 'temp') {
      list = ['Celsius', 'Fahrenheit', 'Kelvin'];
    } else {
      list = Object.keys(unitDefinitions[category]);
    }
    setFromUnit(list[0]);
    setToUnit(list[1] || list[0]);
  }, [category]);

  const doConvert = () => {
    if (category === 'temp') {
      let tempC = inputValue;
      if (fromUnit === 'Fahrenheit') tempC = (inputValue - 32) * 5 / 9;
      else if (fromUnit === 'Kelvin') tempC = inputValue - 273.15;

      let result = tempC;
      if (toUnit === 'Fahrenheit') result = (tempC * 9 / 5) + 32;
      else if (toUnit === 'Kelvin') result = tempC + 273.15;

      setOutputValue(result);
    } else {
      const conversionMap = unitDefinitions[category] as Record<string, number>;
      const factorFrom = conversionMap[fromUnit] || 1;
      const factorTo = conversionMap[toUnit] || 1;

      // convert to standard baseline
      const baseValue = inputValue * factorFrom;
      const finalResult = baseValue / factorTo;
      setOutputValue(finalResult);
    }
  };

  // Convert whenever parameters update
  useEffect(() => {
    if (fromUnit && toUnit) {
      doConvert();
    }
  }, [inputValue, fromUnit, toUnit, category]);

  const unitLists = category === 'temp' ? ['Celsius', 'Fahrenheit', 'Kelvin'] : Object.keys(unitDefinitions[category]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-accent-cyan text-glow">Unit Converter</h3>
        <span className="text-xs text-text-desc font-mono">LENGTH • WEIGHT • TEMP</span>
      </div>

      <div className="bg-nav-bg/60 p-4 rounded-lg border border-accent-cyan/10 space-y-4">
        
        {/* Category select selectors */}
        <div className="space-y-1">
          <label className="text-xs font-mono text-text-desc flex items-center space-x-1.5 font-bold mb-1">
            <Scale className="w-3.5 h-3.5 text-accent-cyan" />
            <span>Select Dimension Category:</span>
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as UnitCategory)}
            className="w-full bg-main-bg border border-accent-cyan/30 rounded px-2.5 py-1.5 text-white outline-none focus:border-accent-cyan text-xs font-bold uppercase"
          >
            <option value="length">Length and Distance</option>
            <option value="weight">Force and Weight</option>
            <option value="temp">Thermodynamic Temperature</option>
            <option value="speed">Velocity and Speed</option>
          </select>
        </div>

        {/* Dynamic converters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5 p-3 bg-main-bg/50 rounded border border-white/5 font-mono text-xs">
            <label className="text-text-desc block">Source Metric Value</label>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(Number(e.target.value))}
              placeholder="Source rate"
              className="w-full bg-main-bg border border-accent-cyan/30 rounded px-2.5 py-1 text-white outline-none focus:border-accent-cyan text-xs"
            />
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full bg-main-bg border border-accent-cyan/20 rounded px-2 py-1 text-text-desc outline-none focus:border-accent-cyan text-[11px] mt-1"
            >
              {unitLists.map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5 p-3 bg-main-bg/50 rounded border border-white/5 font-mono text-xs">
            <p className="text-text-desc block">Target Conversion Metric</p>
            <div className="bg-main-bg/75 border border-white/10 rounded px-2.5 py-1.5 text-accent-cyan text-sm font-extrabold truncate">
              {outputValue.toLocaleString(undefined, { maximumFractionDigits: 5 })}
            </div>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full bg-main-bg border border-accent-cyan/20 rounded px-2 py-1 text-text-desc outline-none focus:border-accent-cyan text-[11px] mt-1"
            >
              {unitLists.map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
        </div>

      </div>
    </div>
  );
}
