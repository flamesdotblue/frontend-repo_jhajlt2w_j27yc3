import React from 'react';
import { Utensils, Flame, Apple } from 'lucide-react';

export default function Header({ caloriesLeft, targetCalories }) {
  const percent = targetCalories > 0 ? Math.min(100, Math.round(((targetCalories - Math.max(0, targetCalories - caloriesLeft)) / targetCalories) * 100)) : 0;

  return (
    <header className="w-full bg-black/70 backdrop-blur sticky top-0 z-20 border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white/5 border border-white/10">
            <Utensils className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-white text-lg font-semibold tracking-tight">MacroTrack</h1>
            <p className="text-xs text-white/60">Track calories, protein, fat from your meals</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-white/80 text-sm">
            <Flame className="w-4 h-4 text-orange-400" />
            <span>{Math.max(0, caloriesLeft)} left</span>
            <span className="text-white/40">/</span>
            <span>{targetCalories} target</span>
          </div>
          <div className="w-28 h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500" style={{ width: `${percent}%` }} />
          </div>
          <Apple className="w-5 h-5 text-emerald-400" />
        </div>
      </div>
    </header>
  );
}
