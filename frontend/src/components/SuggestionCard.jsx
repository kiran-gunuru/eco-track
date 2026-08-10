import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, Flame, Clock, ShieldCheck } from 'lucide-react';

export default function SuggestionCard({ suggestion, onAdopt }) {
  const [adopted, setAdopted] = useState(false);

  const handleAdopt = () => {
    setAdopted(true);
    if (onAdopt) onAdopt(suggestion);
  };

  const getImpactBadge = (impact) => {
    switch (impact?.toLowerCase()) {
      case 'high impact':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'medium impact':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      default:
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    }
  };

  return (
    <div className={`glass-card glass-card-hover rounded-2xl p-6 border transition-all relative overflow-hidden flex flex-col justify-between ${
      adopted ? 'border-emerald-500 bg-emerald-950/20' : 'border-slate-800'
    }`}>
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            {suggestion.category} Swap
          </span>

          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getImpactBadge(suggestion.impact_level)}`}>
              {suggestion.impact_level}
            </span>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              ⚡ Save {suggestion.estimated_co2_savings_kg} kg CO₂
            </span>
          </div>
        </div>

        {/* Title */}
        <h4 className="text-lg font-bold text-white font-heading mb-2 leading-snug">
          {suggestion.title}
        </h4>

        {/* Description */}
        <p className="text-xs text-slate-300 mb-4 leading-relaxed">
          {suggestion.description}
        </p>

        {/* Action Steps */}
        {suggestion.action_steps && (
          <div className="mb-4 space-y-1.5 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Recommended Steps</span>
            <ul className="space-y-1">
              {suggestion.action_steps.map((step, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <Flame className="w-3 h-3 text-amber-400" /> {suggestion.difficulty}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-cyan-400" /> {suggestion.timeframe}
          </span>
        </div>

        <button
          onClick={handleAdopt}
          disabled={adopted}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
            adopted
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
              : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-600/20'
          }`}
        >
          {adopted ? (
            <>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Swap Adopted!</span>
            </>
          ) : (
            <>
              <span>Adopt Swap</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
