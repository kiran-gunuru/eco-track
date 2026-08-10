import React, { useState, useEffect } from 'react';
import BadgeGrid from '../components/BadgeGrid';
import { fetchBadgesApi } from '../services/api';
import { Award, Flame, Trophy } from 'lucide-react';

export default function Badges() {
  const [data, setData] = useState({ streak_days: 5, badges: [] });

  useEffect(() => {
    async function load() {
      const res = await fetchBadgesApi();
      setData(res);
    }
    load();
  }, []);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
          <Trophy className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-3xl font-extrabold text-white font-heading tracking-tight">
            Sustainability Badges & Streaks
          </h2>
          <p className="text-sm text-slate-400">
            Gamified rewards program for logging daily habits under your 10 kg CO₂e budget.
          </p>
        </div>
      </div>

      <BadgeGrid badges={data.badges} streakDays={data.streak_days} />
    </div>
  );
}
