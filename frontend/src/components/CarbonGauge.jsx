import React from 'react';
import { AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function CarbonGauge({ currentKg = 7.6, budgetKg = 10.0 }) {
  const percentage = Math.min(100, Math.max(0, (currentKg / budgetKg) * 100));
  const isOverBudget = currentKg > budgetKg;
  const isNearBudget = currentKg >= budgetKg * 0.8 && !isOverBudget;

  // Gauge colors
  let strokeColor = '#10b981'; // emerald
  let statusBg = 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
  let statusText = 'Under Budget (Great Job!)';
  let StatusIcon = CheckCircle2;

  if (isOverBudget) {
    strokeColor = '#f43f5e'; // rose
    statusBg = 'bg-rose-500/10 border-rose-500/30 text-rose-400';
    statusText = 'Budget Exceeded!';
    StatusIcon = ShieldAlert;
  } else if (isNearBudget) {
    strokeColor = '#f59e0b'; // amber
    statusBg = 'bg-amber-500/10 border-amber-500/30 text-amber-400';
    statusText = 'Close to Budget Limit';
    StatusIcon = AlertCircle;
  }

  // SVG Radial Gauge Calculations
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  // Semi-circle arc (180 degrees or 240 degrees arc)
  const arcLength = circumference * 0.75;
  const strokeDashoffset = arcLength - (arcLength * percentage) / 100;

  return (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden flex flex-col items-center justify-center">
      {/* Background glow */}
      <div 
        className="absolute w-48 h-48 rounded-full blur-3xl opacity-20 -z-10 transition-colors duration-500"
        style={{ backgroundColor: strokeColor }}
      />

      <div className="w-full flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-white font-heading">Daily Carbon Gauge</h3>
          <p className="text-xs text-slate-400">Emissions logged for today</p>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusBg}`}>
          <StatusIcon className="w-3.5 h-3.5" />
          <span>{statusText}</span>
        </div>
      </div>

      {/* SVG Radial Gauge */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
          {/* Background Track */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            className="stroke-slate-800"
            strokeWidth="16"
            fill="transparent"
            strokeDasharray={arcLength}
            strokeDashoffset="0"
            strokeLinecap="round"
          />
          {/* Progress Arc */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke={strokeColor}
            strokeWidth="16"
            fill="transparent"
            strokeDasharray={arcLength}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Text Stats */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-extrabold font-heading text-white tracking-tight">
            {currentKg.toFixed(1)}
            <span className="text-base font-normal text-slate-400 ml-1">kg</span>
          </span>
          <span className="text-xs text-slate-400 mt-0.5">CO₂e Total</span>
          <div className="mt-2 px-3 py-0.5 rounded-full bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300 font-medium">
            Budget: <span className="font-bold text-emerald-400">{budgetKg} kg</span>
          </div>
        </div>
      </div>

      {/* Budget Progress Bar */}
      <div className="w-full mt-4 space-y-1.5">
        <div className="flex justify-between text-xs font-medium text-slate-400">
          <span>0 kg</span>
          <span>{percentage.toFixed(0)}% of Budget Used</span>
          <span>{budgetKg} kg</span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${percentage}%`,
              backgroundColor: strokeColor
            }}
          />
        </div>
      </div>
    </div>
  );
}
