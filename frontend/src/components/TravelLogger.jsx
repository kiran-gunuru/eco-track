import React, { useState, useEffect } from 'react';
import { Car, Bus, Train, Bike, Plane, Users, Compass, CheckCircle } from 'lucide-react';
import { calculateTravelApi } from '../services/api';

export default function TravelLogger({ onCalculate }) {
  const [transportMode, setTransportMode] = useState('Car Petrol');
  const [distanceKm, setDistanceKm] = useState(25);
  const [passengers, setPassengers] = useState(2);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const modes = [
    { id: 'Car Petrol', label: 'Petrol Car', icon: Car, factor: 0.192, desc: '0.192 kg/km' },
    { id: 'Car Diesel', label: 'Diesel Car', icon: Car, factor: 0.171, desc: '0.171 kg/km' },
    { id: 'EV Car', label: 'Electric Vehicle', icon: Car, factor: 0.053, desc: '0.053 kg/km (EV)' },
    { id: 'Bus', label: 'Public Bus', icon: Bus, factor: 0.089, desc: '0.089 kg/km' },
    { id: 'Train/Metro', label: 'Train / Metro', icon: Train, factor: 0.035, desc: '0.035 kg/km' },
    { id: 'Flight', label: 'Flight', icon: Plane, factor: 0.255, desc: '0.255 kg/km' },
    { id: 'Bicycle', label: 'Bicycle / Walk', icon: Bike, factor: 0.0, desc: '0.000 kg/km' },
  ];

  const handleRecalculate = async () => {
    setLoading(true);
    const res = await calculateTravelApi({
      transport_mode: transportMode,
      distance_km: distanceKm,
      passengers: passengers
    });
    setResult(res);
    setLoading(false);
    if (onCalculate) onCalculate(res);
  };

  useEffect(() => {
    handleRecalculate();
  }, [transportMode, distanceKm, passengers]);

  return (
    <div className="glass-card rounded-2xl p-6 border border-emerald-500/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          <Car className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white font-heading">Scenario 1: Travel Activity Logger</h3>
          <p className="text-xs text-slate-400">Select transport mode, distance (km), and passenger count for carpooling</p>
        </div>
      </div>

      {/* Mode Selector Grid */}
      <div className="mb-6">
        <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
          1. Select Transport Mode
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {modes.map((m) => {
            const Icon = m.icon;
            const isSelected = transportMode === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setTransportMode(m.id)}
                className={`p-3 rounded-xl flex flex-col items-center justify-center text-center transition-all ${
                  isSelected
                    ? 'bg-emerald-500/20 border-2 border-emerald-400 text-white shadow-lg shadow-emerald-500/10'
                    : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 mb-1 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span className="text-xs font-semibold">{m.label}</span>
                <span className="text-[10px] text-slate-500">{m.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Distance Slider & Passenger Count Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Distance km */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-300">2. Distance Travelled (km)</span>
            <span className="text-emerald-400 font-bold">{distanceKm} km</span>
          </div>
          <input
            type="range"
            min="1"
            max="300"
            value={distanceKm}
            onChange={(e) => setDistanceKm(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>1 km</span>
            <span>150 km</span>
            <span>300 km</span>
          </div>
        </div>

        {/* Passengers (Carpooling Divisor) */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-300">3. Passengers (Carpool Division)</span>
            <span className="text-cyan-400 font-bold">{passengers} Person{passengers > 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-3">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setPassengers(num)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${
                  passengers === num
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-sm shadow-cyan-500/10'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {num} {num === 1 ? 'Solo' : `${num}x`}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-400">
            {passengers > 1 
              ? `✨ Carpooling splits emissions across ${passengers} passengers!`
              : 'Solo driving accounts for full vehicle emissions.'}
          </p>
        </div>
      </div>

      {/* Calculated Result Box */}
      {result && (
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400">Calculated Travel Carbon Footprint</div>
              <div className="text-2xl font-extrabold text-white font-heading">
                {result.emissions_kg} <span className="text-sm font-normal text-emerald-400">kg CO₂e</span>
              </div>
            </div>
          </div>

          {result.carpool_savings_kg > 0 && (
            <div className="px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
              🌱 Carpool Saved: {result.carpool_savings_kg} kg CO₂e
            </div>
          )}
        </div>
      )}
    </div>
  );
}
