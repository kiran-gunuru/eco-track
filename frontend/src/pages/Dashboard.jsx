import React, { useState, useEffect } from 'react';
import CarbonGauge from '../components/CarbonGauge';
import QuickStatsBar from '../components/QuickStatsBar';
import ReportModal from '../components/ReportModal';
import { fetchTodayLogApi, fetchAnalyticsApi, saveDailyLogApi } from '../services/api';
import { Sparkles, FileText, ArrowRight, CheckCircle2, Leaf, Car, Utensils, Zap } from 'lucide-react';

export default function Dashboard({ setActiveTab }) {
  const [data, setData] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reportOpen, setReportOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const todayRes = await fetchTodayLogApi();
    const analyticsRes = await fetchAnalyticsApi();
    setData(todayRes);
    setAnalytics(analyticsRes);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const todayLog = data?.today_log || {};
  const currentKg = todayLog.total_kg || 7.6;
  const budgetKg = data?.daily_budget_kg || 10.0;

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="glass-card rounded-3xl p-6 lg:p-8 border border-emerald-500/20 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-cyan-950/40 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              🌱 Welcome back, Alex!
            </span>
            <span className="text-xs text-slate-400">College Sustainability Project</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white font-heading tracking-tight">
            Track, Reduce & AI-Optimize Your Carbon Footprint
          </h2>
          <p className="text-sm text-slate-300 max-w-xl">
            Record daily travel, food, and energy habits to monitor your real-time carbon gauge against your 10 kg CO₂e budget.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('log-habit')}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-600/20"
          >
            <Leaf className="w-4 h-4" />
            <span>Log Daily Activity</span>
          </button>
          
          <button
            onClick={() => setReportOpen(true)}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-white font-bold text-sm transition-all border border-slate-700"
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Export Health Report</span>
          </button>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <QuickStatsBar metrics={analytics?.metrics} />

      {/* Main Grid: Gauge & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Radial Carbon Gauge */}
        <div className="lg:col-span-1">
          <CarbonGauge currentKg={currentKg} budgetKg={budgetKg} />
        </div>

        {/* Right Column: Today's Category Breakdown & AI Quick CTA */}
        <div className="lg:col-span-2 space-y-6">
          {/* Category Breakdown Card */}
          <div className="glass-card rounded-2xl p-6 border border-emerald-500/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white font-heading">Today's Category Breakdown</h3>
              <span className="text-xs text-slate-400">{todayLog.date || 'Today'}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Travel */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400 font-medium">Travel ({todayLog.travel_mode || 'Car'})</span>
                  <Car className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold text-white font-heading">{todayLog.travel_kg || 2.4} <span className="text-xs font-normal text-slate-400">kg</span></div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(100, ((todayLog.travel_kg || 2.4) / budgetKg) * 100)}%` }} />
                </div>
              </div>

              {/* Food */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400 font-medium">Food ({todayLog.diet_type || 'Omnivore'})</span>
                  <Utensils className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-bold text-white font-heading">{todayLog.food_kg || 5.4} <span className="text-xs font-normal text-slate-400">kg</span></div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.min(100, ((todayLog.food_kg || 5.4) / budgetKg) * 100)}%` }} />
                </div>
              </div>

              {/* Energy */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400 font-medium">Energy & Utilities</span>
                  <Zap className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-2xl font-bold text-white font-heading">{todayLog.energy_kg || 1.8} <span className="text-xs font-normal text-slate-400">kg</span></div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${Math.min(100, ((todayLog.energy_kg || 1.8) / budgetKg) * 100)}%` }} />
                </div>
              </div>
            </div>

            {/* Quick Scenario Buttons */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-400">Quick Scenario Shortcuts:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('log-habit')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold hover:bg-emerald-500/20"
                >
                  Scenario 1: Travel Log
                </button>
                <button
                  onClick={() => setActiveTab('log-habit')}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold hover:bg-amber-500/20"
                >
                  Scenario 2: Food Log
                </button>
                <button
                  onClick={() => setActiveTab('suggestions')}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold hover:bg-cyan-500/20"
                >
                  Scenario 3: AI Swaps
                </button>
              </div>
            </div>
          </div>

          {/* AI Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border border-purple-500/30 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40">
                <Sparkles className="w-6 h-6 animate-spin-slow" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white font-heading">AI Eco Suggestions Powered by Groq</h4>
                <p className="text-xs text-slate-300">Using llama-3.3-70b-versatile to generate personalized lifestyle swaps.</p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('suggestions')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shrink-0"
            >
              <span>Get AI Swaps</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Health Report Modal */}
      <ReportModal
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
        equivalents={data?.equivalents}
        todayLog={todayLog}
        profile={{ name: 'Alex River' }}
      />
    </div>
  );
}
