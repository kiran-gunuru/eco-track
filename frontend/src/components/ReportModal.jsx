import React from 'react';
import { X, Printer, Trees, Car, Share2, Award, ShieldCheck, Heart } from 'lucide-react';

export default function ReportModal({ isOpen, onClose, equivalents, todayLog, profile }) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-card w-full max-w-2xl rounded-3xl border border-emerald-500/30 overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-900/60 via-slate-900 to-teal-900/60 border-b border-emerald-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-heading">EcoTrack Carbon Footprint Impact Certificate</h3>
              <p className="text-xs text-slate-300">Official Sustainability Report & Health Equivalents</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* User & Date Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400">Logged User</span>
              <div className="text-sm font-bold text-white mt-0.5">{profile?.name || 'Alex River'}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400">Report Date</span>
              <div className="text-sm font-bold text-white mt-0.5">{todayLog?.date || 'Today'}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400">Total Emissions</span>
              <div className="text-sm font-bold text-emerald-400 mt-0.5">{todayLog?.total_kg || 7.6} kg CO₂e</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400">Budget Status</span>
              <div className="text-sm font-bold text-cyan-400 mt-0.5">Under Budget</div>
            </div>
          </div>

          {/* Environmental Equivalents */}
          <div>
            <h4 className="text-sm font-bold text-white font-heading uppercase tracking-wider mb-3">
              Real-World Environmental Equivalents
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
                <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Trees className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xl font-extrabold text-white">{equivalents?.trees_daily_absorb_needed || 126}</div>
                  <div className="text-xs text-slate-300">Trees Needed Daily</div>
                  <div className="text-[10px] text-slate-400">to offset this footprint</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center gap-3">
                <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-400">
                  <Car className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xl font-extrabold text-white">{equivalents?.car_miles_equivalent || 38.0}</div>
                  <div className="text-xs text-slate-300">Car Miles Equiv</div>
                  <div className="text-[10px] text-slate-400">gasoline vehicle miles</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center gap-3">
                <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400">
                  <Heart className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xl font-extrabold text-white">{equivalents?.plastic_bottles_footprint || 92}</div>
                  <div className="text-xs text-slate-300">Plastic Bottles</div>
                  <div className="text-[10px] text-slate-400">production CO₂ equiv</div>
                </div>
              </div>
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h4 className="text-xs font-bold text-slate-300 mb-2">Category Emissions Breakdown</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Travel ({todayLog?.travel_mode || 'Car Petrol'})</span>
                <span className="font-semibold text-white">{todayLog?.travel_kg || 2.4} kg CO₂e</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Food ({todayLog?.diet_type || 'Omnivore'})</span>
                <span className="font-semibold text-white">{todayLog?.food_kg || 5.4} kg CO₂e</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Energy & Utilities</span>
                <span className="font-semibold text-white">{todayLog?.energy_kg || 1.8} kg CO₂e</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>Print Report</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
