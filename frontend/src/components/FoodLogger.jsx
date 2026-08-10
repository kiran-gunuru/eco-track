import React, { useState, useEffect } from 'react';
import { Utensils, AlertTriangle, Sparkles, CheckCircle2 } from 'lucide-react';
import { calculateFoodApi } from '../services/api';

export default function FoodLogger({ onCalculate }) {
  const [dietType, setDietType] = useState('Omnivore');
  const [foodWasted, setFoodWasted] = useState(false);
  const [result, setResult] = useState(null);

  const diets = [
    { id: 'Meat-heavy', label: 'Meat-Heavy', desc: '7.20 kg CO₂e/day (High beef/pork)', icon: '🥩', bg: 'hover:border-rose-500/50' },
    { id: 'Omnivore', label: 'Omnivore', desc: '5.40 kg CO₂e/day (Balanced diet)', icon: '🍗', bg: 'hover:border-amber-500/50' },
    { id: 'Vegetarian', label: 'Vegetarian', desc: '3.80 kg CO₂e/day (Dairy/Eggs + Plants)', icon: '🧀', bg: 'hover:border-emerald-500/50' },
    { id: 'Vegan', label: 'Vegan', desc: '2.90 kg CO₂e/day (Pure Plant-based)', icon: '🌱', bg: 'hover:border-teal-500/50' }
  ];

  const handleCalculate = async () => {
    const res = await calculateFoodApi({
      diet_type: dietType,
      food_wasted: foodWasted
    });
    setResult(res);
    if (onCalculate) onCalculate(res);
  };

  useEffect(() => {
    handleCalculate();
  }, [dietType, foodWasted]);

  return (
    <div className="glass-card rounded-2xl p-6 border border-emerald-500/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
          <Utensils className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white font-heading">Scenario 2: Food Consumption Logger</h3>
          <p className="text-xs text-slate-400">Select diet type and toggle food waste penalty (+10% emission surcharge)</p>
        </div>
      </div>

      {/* Diet Selection */}
      <div className="mb-6">
        <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
          1. Select Daily Diet Profile
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {diets.map((d) => {
            const isSelected = dietType === d.id;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => setDietType(d.id)}
                className={`p-4 rounded-xl flex flex-col items-start text-left transition-all ${
                  isSelected
                    ? 'bg-amber-500/20 border-2 border-amber-400 text-white shadow-lg shadow-amber-500/10'
                    : `bg-slate-900/60 border border-slate-800 text-slate-400 ${d.bg}`
                }`}
              >
                <span className="text-2xl mb-1">{d.icon}</span>
                <span className="text-sm font-bold text-white">{d.label}</span>
                <span className="text-[11px] text-slate-400 mt-1">{d.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Food Waste Toggle */}
      <div className="mb-6 p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-sm font-bold text-white">Was any cooked or raw food wasted today?</span>
            <p className="text-xs text-slate-400">Adds a 10% methane landfill surcharge to your food score</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setFoodWasted(!foodWasted)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
            foodWasted
              ? 'bg-rose-500/20 border-rose-400 text-rose-300 shadow-sm shadow-rose-500/10'
              : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
          }`}
        >
          {foodWasted ? '⚠️ Food Wasted (+10%)' : '✅ Zero Food Waste'}
        </button>
      </div>

      {/* Food Carbon Score Result Box */}
      {result && (
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400">Total Food Carbon Emissions</div>
              <div className="text-2xl font-extrabold text-white font-heading">
                {result.total_food_emissions_kg} <span className="text-sm font-normal text-amber-400">kg CO₂e</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[11px] text-slate-400">Eco Cleanliness Score</div>
              <div className="text-lg font-bold text-emerald-400">{result.clean_score} / 100</div>
            </div>
            {result.waste_penalty_kg > 0 && (
              <span className="px-3 py-1 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
                +{result.waste_penalty_kg} kg Waste Penalty
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
