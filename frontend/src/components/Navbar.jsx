import React from 'react';
import { Leaf, BarChart2, Sparkles, Award, PlusCircle, ShieldCheck, Flame } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, streakDays = 5, dailyBudget = 10.0, user = null, onLogout }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Leaf },
    { id: 'log-habit', label: 'Log Activity', icon: PlusCircle },
    { id: 'suggestions', label: 'AI Suggestions', icon: Sparkles, badge: 'Groq AI' },
    { id: 'history', label: 'History & Analytics', icon: BarChart2 },
    { id: 'badges', label: 'Streaks & Badges', icon: Award },
  ];

  return (
    <header className="sticky top-0 z-50 glass-card border-b border-emerald-500/20 px-4 lg:px-8 py-3 mb-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Leaf className="w-5 h-5 text-emerald-400 animate-pulse-subtle" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white font-heading">
                Eco<span className="text-emerald-400">Track</span>
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                v2.0 AI
              </span>
            </div>
            <p className="text-xs text-slate-400">Personal Carbon Footprint Dashboard</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto max-w-full pb-1 md:pb-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile & Streak Stats */}
        <div className="flex items-center gap-3">
          {/* Streak Indicator */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <Flame className="w-4 h-4 fill-amber-400 text-amber-500 animate-bounce" />
            <span>{streakDays} Day Streak</span>
          </div>

          {/* Daily Budget Target */}
          <div className="hidden sm:flex flex-col items-end text-xs">
            <span className="text-slate-400">Target Budget</span>
            <span className="font-bold text-emerald-400">{dailyBudget} kg CO₂e/day</span>
          </div>

          {/* User Profile Avatar / Logout */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-emerald-400">
              {user?.name ? user.name.charAt(0) : 'A'}
            </div>
            <button
              onClick={() => setActiveTab('auth')}
              className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              {user ? 'Account' : 'Demo Login'}
            </button>
          </div>

        </div>

      </div>
    </header>
  );
}
