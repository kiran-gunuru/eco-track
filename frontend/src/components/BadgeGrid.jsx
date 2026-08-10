import React from 'react';
import { Award, Flame, Lock, CheckCircle, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function BadgeGrid({ badges = [], streakDays = 5 }) {
  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-emerald-500/20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white font-heading">Achievements & Badges</h3>
            <p className="text-xs text-slate-400">Earn badges for consistent eco-friendly habits and budget streaks</p>
          </div>
        </div>

        <button
          onClick={triggerConfetti}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold hover:bg-amber-500/20 transition-all"
        >
          <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span>Celebrate {streakDays}-Day Streak 🎉</span>
        </button>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`p-4 rounded-2xl border transition-all flex items-start gap-4 ${
              badge.unlocked
                ? 'bg-slate-900/80 border-emerald-500/30 shadow-md shadow-emerald-500/5'
                : 'bg-slate-950/60 border-slate-800 opacity-60'
            }`}
          >
            {/* Icon */}
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 border ${
              badge.unlocked
                ? 'bg-emerald-500/10 border-emerald-500/30 shadow-inner'
                : 'bg-slate-900 border-slate-800 text-slate-600'
            }`}>
              {badge.icon}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white font-heading">{badge.title}</h4>
                {badge.unlocked ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-snug">{badge.description}</p>
              
              <div className="mt-2 flex items-center justify-between text-[10px]">
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
                  {badge.category}
                </span>
                {badge.unlocked ? (
                  <span className="text-emerald-400 font-semibold">Unlocked {badge.unlocked_date || 'Recently'}</span>
                ) : (
                  <span className="text-slate-500">Locked</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
