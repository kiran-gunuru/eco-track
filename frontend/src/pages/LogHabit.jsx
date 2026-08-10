import React, { useState } from 'react';
import TravelLogger from '../components/TravelLogger';
import FoodLogger from '../components/FoodLogger';
import EnergyLogger from '../components/EnergyLogger';
import { saveDailyLogApi } from '../services/api';
import { CheckCircle2, Leaf, Sparkles, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function LogHabit({ setActiveTab }) {
  const [travelData, setTravelData] = useState({ mode: 'Car Petrol', distance_km: 25, passengers: 2, emissions_kg: 2.4 });
  const [foodData, setFoodData] = useState({ diet_type: 'Omnivore', food_wasted: false, total_food_emissions_kg: 5.4 });
  const [energyData, setEnergyData] = useState({ total_energy_emissions_kg: 1.8 });
  const [activeSubTab, setActiveSubTab] = useState('all');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  const totalCalculated = parseFloat((
    (travelData.emissions_kg || 0) +
    (foodData.total_food_emissions_kg || 0) +
    (energyData.total_energy_emissions_kg || 0)
  ).toFixed(2));

  const handleSaveAll = async () => {
    setSaving(true);
    const payload = {
      travel_mode: travelData.mode || 'Car Petrol',
      distance_km: travelData.distance_km || 25,
      passengers: travelData.passengers || 1,
      travel_kg: travelData.emissions_kg || 2.4,

      diet_type: foodData.diet_type || 'Omnivore',
      food_wasted: foodData.food_wasted || false,
      food_kg: foodData.total_food_emissions_kg || 5.4,

      electricity_kwh: energyData.electricity_kwh || 4.0,
      solar_kwh: energyData.solar_kwh || 1.5,
      energy_kg: energyData.total_energy_emissions_kg || 1.8
    };

    await saveDailyLogApi(payload);
    setSaving(false);
    setSaveSuccess(true);

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.7 }
    });

    setTimeout(() => {
      setSaveSuccess(false);
      setActiveTab('dashboard');
    }, 1800);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              Daily Carbon Logger
            </span>
          </div>
          <h2 className="text-3xl font-extrabold text-white font-heading tracking-tight mt-1">
            Log Daily Activities & Calculate Impact
          </h2>
          <p className="text-sm text-slate-400">
            Select Scenarios 1 & 2 below to calculate travel carpooling splits, diet waste penalties, and grid emissions.
          </p>
        </div>

        {/* Subtab Toggle */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveSubTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'all' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Loggers
          </button>
          <button
            onClick={() => setActiveSubTab('travel')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'travel' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Scenario 1: Travel
          </button>
          <button
            onClick={() => setActiveSubTab('food')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'food' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Scenario 2: Food
          </button>
        </div>
      </div>

      {/* Live Running Total Summary Bar */}
      <div className="glass-card rounded-2xl p-4 border border-emerald-500/30 bg-emerald-950/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400">
            <Leaf className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-xs text-slate-300 font-medium">Estimated Daily Total Emissions</span>
            <div className="text-2xl font-black text-white font-heading">
              {totalCalculated} <span className="text-sm font-normal text-emerald-400">kg CO₂e</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleSaveAll}
          disabled={saving || saveSuccess}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
        >
          {saveSuccess ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-white" />
              <span>Saved to Dashboard!</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>{saving ? 'Saving...' : 'Save Record & Update Gauge'}</span>
            </>
          )}
        </button>
      </div>

      {/* Loggers Sections */}
      <div className="space-y-8">
        {(activeSubTab === 'all' || activeSubTab === 'travel') && (
          <TravelLogger onCalculate={(res) => setTravelData(res)} />
        )}

        {(activeSubTab === 'all' || activeSubTab === 'food') && (
          <FoodLogger onCalculate={(res) => setFoodData(res)} />
        )}

        {(activeSubTab === 'all' || activeSubTab === 'energy') && (
          <EnergyLogger onCalculate={(res) => setEnergyData(res)} />
        )}
      </div>
    </div>
  );
}
