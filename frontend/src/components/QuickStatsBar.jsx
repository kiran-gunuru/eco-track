import React from 'react';
import { TrendingDown, Calendar, Trophy, Zap, Activity } from 'lucide-react';

export default function QuickStatsBar({ metrics }) {
  const stats = [
    {
      label: '7-Day Average',
      value: `${metrics?.seven_day_avg_kg || 7.9} kg`,
      subtext: 'Target < 10 kg',
      icon: Activity,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/20'
    },
    {
      label: 'Best Day (Lowest)',
      value: `${metrics?.best_day?.total_kg || 5.2} kg`,
      subtext: metrics?.best_day?.date || 'Aug 08',
      icon: Trophy,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20'
    },
    {
      label: 'Worst Day (Peak)',
      value: `${metrics?.worst_day?.total_kg || 11.4} kg`,
      subtext: metrics?.worst_day?.date || 'Jul 28',
      icon: TrendingDown,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20'
    },
    {
      label: 'Monthly Total',
      value: `${metrics?.monthly_total_kg || 245.8} kg`,
      subtext: '30 Days Logged',
      icon: Calendar,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20'
    },
    {
      label: 'Current Streak',
      value: `${metrics?.streak_days || 5} Days`,
      subtext: 'Under Daily Budget',
      icon: Zap,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div 
            key={idx} 
            className="glass-card glass-card-hover rounded-2xl p-4 flex flex-col justify-between border"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 font-medium">{stat.label}</span>
              <div className={`p-2 rounded-xl border ${stat.bg}`}>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white font-heading tracking-tight">
                {stat.value}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">{stat.subtext}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
