import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import LogHabit from './pages/LogHabit';
import Suggestions from './pages/Suggestions';
import History from './pages/History';
import Badges from './pages/Badges';
import Auth from './pages/Auth';
import { Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState({ name: 'Alex River', email: 'alex.river@college.edu' });

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      <div>
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          streakDays={5}
          dailyBudget={10.0}
          user={user}
          onLogout={() => setUser(null)}
        />

        <main className="max-w-7xl mx-auto px-4 lg:px-8">
          {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
          {activeTab === 'log-habit' && <LogHabit setActiveTab={setActiveTab} />}
          {activeTab === 'suggestions' && <Suggestions setActiveTab={setActiveTab} />}
          {activeTab === 'history' && <History />}
          {activeTab === 'badges' && <Badges />}
          {activeTab === 'auth' && <Auth setActiveTab={setActiveTab} onLogin={(u) => setUser(u)} />}
        </main>
      </div>

      {/* Footer Crediting Team Members */}
      <footer className="glass-card border-t border-slate-800/80 py-6 px-4 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            <span className="font-bold text-white font-heading">EcoTrack AI Carbon Dashboard</span> © 2026 Practical College Project
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 text-slate-400">
            <span>Built with <Heart className="w-3.5 h-3.5 inline text-rose-500 fill-rose-500" /> by Team Lead</span>
            <span className="font-bold text-emerald-400">Bhagya Marisetti</span> |
            <span>Members: Gunuru Devi Chandu, Satya Veera Hari Bhargav Ganta, Sri Sai Deepthy Govvala, Linga Reddy Sivani</span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px] text-slate-500">
            <span>Flask: Port 5000</span>
            <span>Vite: Port 5173</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
