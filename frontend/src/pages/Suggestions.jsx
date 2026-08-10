import React, { useState, useEffect } from 'react';
import SuggestionCard from '../components/SuggestionCard';
import { fetchAiSuggestionsApi } from '../services/api';
import { Sparkles, RefreshCw, Bot, ShieldAlert, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Suggestions({ setActiveTab }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState(null);
  const [adoptedCount, setAdoptedCount] = useState(0);

  const loadSuggestions = async () => {
    setLoading(true);
    const res = await fetchAiSuggestionsApi();
    setSuggestions(res.suggestions || []);
    setMeta(res);
    setLoading(false);
  };

  useEffect(() => {
    loadSuggestions();
  }, []);

  const handleAdoptSwap = (suggestion) => {
    setAdoptedCount(prev => prev + 1);
    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.8 }
    });
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="glass-card rounded-3xl p-6 lg:p-8 border border-purple-500/30 bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-bold flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5" />
              Scenario 3: Groq LLM Advisor
            </span>
            <span className="text-xs font-mono text-slate-400">llama-3.3-70b-versatile</span>
          </div>

          <h2 className="text-3xl font-extrabold text-white font-heading tracking-tight">
            AI-Powered Personalized Eco Swaps
          </h2>

          <p className="text-sm text-slate-300 max-w-2xl">
            Our AI analyzes your daily travel, food, and energy breakdown to generate 3 actionable lifestyle recommendations with estimated CO₂ savings.
          </p>
        </div>

        <button
          onClick={loadSuggestions}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm transition-all shadow-lg shadow-purple-600/20 shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Consulting AI...' : 'Regenerate Swaps'}</span>
        </button>
      </div>

      {/* Adopted Count Banner */}
      {adoptedCount > 0 && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Awesome! You adopted {adoptedCount} AI eco swap{adoptedCount > 1 ? 's' : ''} today!</span>
          </span>
          <button
            onClick={() => setActiveTab('dashboard')}
            className="underline hover:text-white"
          >
            View Gauge Impact →
          </button>
        </div>
      )}

      {/* 3 Styled Suggestion Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card rounded-2xl p-6 h-64 animate-pulse flex flex-col justify-between">
              <div className="space-y-3">
                <div className="h-4 bg-slate-800 rounded w-1/3" />
                <div className="h-6 bg-slate-800 rounded w-3/4" />
                <div className="h-12 bg-slate-800/60 rounded" />
              </div>
              <div className="h-10 bg-slate-800 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {suggestions.map((suggestion, idx) => (
            <SuggestionCard
              key={suggestion.id || idx}
              suggestion={suggestion}
              onAdopt={handleAdoptSwap}
            />
          ))}
        </div>
      )}
    </div>
  );
}
