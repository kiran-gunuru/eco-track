import React from 'react';
import { Calendar as CalendarIcon, Info } from 'lucide-react';

export default function HeatmapCalendar({ data = [] }) {
  const getCellColor = (status, totalKg) => {
    if (status === 'green' || totalKg <= 8.0) {
      return 'bg-emerald-500/30 border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/50';
    }
    if (status === 'amber' || totalKg <= 10.0) {
      return 'bg-amber-500/30 border-amber-500/50 text-amber-300 hover:bg-amber-500/50';
    }
    return 'bg-rose-500/30 border-rose-500/50 text-rose-300 hover:bg-rose-500/50';
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-emerald-500/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-white font-heading">30-Day Activity Heatmap Calendar</h4>
            <p className="text-xs text-slate-400">Color-coded daily carbon emission compliance</p>
          </div>
        </div>

        {/* Legend */}
        <div className="hidden sm:flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1 text-slate-300">
            <span className="w-3 h-3 rounded-md bg-emerald-500/40 border border-emerald-500" /> &lt; 8.0 kg (Light)
          </span>
          <span className="flex items-center gap-1 text-slate-300">
            <span className="w-3 h-3 rounded-md bg-amber-500/40 border border-amber-500" /> 8-10 kg (Moderate)
          </span>
          <span className="flex items-center gap-1 text-slate-300">
            <span className="w-3 h-3 rounded-md bg-rose-500/40 border border-rose-500" /> &gt; 10 kg (High)
          </span>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2.5 my-4">
        {data.map((item, idx) => {
          const dateDay = item.date ? item.date.split('-')[2] : idx + 1;
          return (
            <div
              key={idx}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer group relative ${getCellColor(
                item.status,
                item.total_kg
              )}`}
            >
              <div className="text-[10px] text-slate-400 font-mono mb-0.5">{dateDay}</div>
              <div className="text-xs font-extrabold">{item.total_kg}</div>
              
              {/* Tooltip on Hover */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-20 w-32 p-2 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl text-[10px] text-slate-200 pointer-events-none">
                <div className="font-bold text-white mb-0.5">{item.date}</div>
                <div>Footprint: {item.total_kg} kg</div>
                <div className="text-emerald-400 capitalize">{item.status} status</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
