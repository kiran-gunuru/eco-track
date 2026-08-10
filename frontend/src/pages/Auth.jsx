import React, { useState } from 'react';
import { ShieldCheck, UserCheck, Leaf, ArrowRight } from 'lucide-react';

export default function Auth({ setActiveTab, onLogin }) {
  const [email, setEmail] = useState('alex.river@college.edu');
  const [password, setPassword] = useState('••••••••');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onLogin) {
      onLogin({
        name: email.split('@')[0],
        email: email
      });
    }
    setActiveTab('dashboard');
  };

  const handleGuestDemo = () => {
    if (onLogin) {
      onLogin({
        name: 'Alex River (Guest)',
        email: 'guest.demo@ecotrack.org'
      });
    }
    setActiveTab('dashboard');
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="glass-card rounded-3xl p-8 border border-emerald-500/30 shadow-2xl">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-0.5 shadow-lg shadow-emerald-500/20 mb-3">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Leaf className="w-7 h-7 text-emerald-400" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white font-heading">
            {isSignUp ? 'Create EcoTrack Account' : 'Welcome Back to EcoTrack'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Firebase Authentication & Guest Demo Access
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-500/20"
          >
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px bg-slate-800 flex-1" />
          <span className="text-[11px] text-slate-500 uppercase tracking-widest font-semibold">Or Instant Access</span>
          <div className="h-px bg-slate-800 flex-1" />
        </div>

        <button
          onClick={handleGuestDemo}
          className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-sm transition-all flex items-center justify-center gap-2"
        >
          <UserCheck className="w-4 h-4 text-emerald-400" />
          <span>Continue with Guest Demo Mode</span>
        </button>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-slate-400 hover:text-emerald-400 transition-colors"
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}
