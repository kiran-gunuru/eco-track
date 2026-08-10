import React, { useState, useEffect } from 'react';
import { Zap, Sun, Flame, CheckCircle } from 'lucide-react';
import { calculateEnergyEmissions } from '../services/api'; // or inline

export default function EnergyLogger({ onCalculate }) {
  const [elecKwh, setElecKwh] = useState(4.0);
  const [gasKwh, setGasKwh] = useState(0.0);
  const [solarKwh, setSolarKwh] = useState(1.5);
  const [result, setResult] = useState(null);

  const calculate = () => {
    const elecEm = elecKwh * 0.475;
    const gasEm = gasKwh * 0.202;
    const solarCred = solarKwh * 0.450;
    const net = Math.max(0.0, parseFloat((elecEm + gasEm - solarCred).toFixed(3)));
    
    const res = {
      electricity_kwh: elecKwh,
      gas_kwh: gasKwh,
      solar_kwh: solarKwh,
      elec_emissions_kg: parseFloat(elecEm.toFixed(3)),
      solar_credit_kg: parseFloat(solarCred.toFixed(3)),
      total_energy_emissions_kg: net
    };
    setResult(res);
    if (onCalculate) onCalculate(res);
  };

  useEffect(() => {
    calculate();
  }, [elecKwh, gasKwh, solarKwh]);

  return (
    <div className="glass-card rounded-2xl p-6 border border-emerald-500/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
          <Zap className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white font-heading">Energy & Utility Consumption</h3>
          <p className="text-xs text-slate-400">Log grid electricity, natural gas, and clean solar generation credits</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Electricity */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-300">Electricity (kWh)</span>
            <span className="text-cyan-400 font-bold">{elecKwh} kWh</span>
          </div>
          <input
            type="range"
            min="0"
            max="20"
            step="0.5"
            value={elecKwh}
            onChange={(e) => setElecKwh(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
          <p className="text-[10px] text-slate-500">0.475 kg CO₂e per kWh grid avg</p>
        </div>

        {/* Solar Credit */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-300">Solar Generation (kWh)</span>
            <span className="text-emerald-400 font-bold">{solarKwh} kWh</span>
          </div>
          <input
            type="range"
            min="0"
            max="15"
            step="0.5"
            value={solarKwh}
            onChange={(e) => setSolarKwh(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <p className="text-[10px] text-slate-500">-0.450 kg CO₂e offset credit</p>
        </div>

        {/* Gas */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-300">Gas / Heating (kWh)</span>
            <span className="text-amber-400 font-bold">{gasKwh} kWh</span>
          </div>
          <input
            type="range"
            min="0"
            max="15"
            step="0.5"
            value={gasKwh}
            onChange={(e) => setGasKwh(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <p className="text-[10px] text-slate-500">0.202 kg CO₂e per kWh</p>
        </div>
      </div>

      {result && (
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400">Net Energy Carbon Emissions</div>
              <div className="text-2xl font-extrabold text-white font-heading">
                {result.total_energy_emissions_kg} <span className="text-sm font-normal text-cyan-400">kg CO₂e</span>
              </div>
            </div>
          </div>
          {result.solar_credit_kg > 0 && (
            <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
              ☀️ Solar Offset: -{result.solar_credit_kg} kg CO₂e
            </span>
          )}
        </div>
      )}
    </div>
  );
}
