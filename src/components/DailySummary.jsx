import React from 'react';
import { Flame, Trash2 } from 'lucide-react';

export default function DailySummary({ meals, totals, target, onRemove }) {
  const exceeded = totals.kcal > target && target > 0;

  return (
    <section className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Today's summary</h2>
        <div className={`px-3 py-1.5 rounded-full text-xs font-medium border ${exceeded ? 'bg-red-500/10 text-red-400 border-red-500/30' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'}`}>
          {exceeded ? 'Exceeded target' : 'Within target'}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4">
        <Stat label="Calories" value={`${totals.kcal} kcal`} color="text-orange-400" />
        <Stat label="Protein" value={`${totals.protein} g`} color="text-emerald-400" />
        <Stat label="Fat" value={`${totals.fat} g`} color="text-yellow-300" />
        <Stat label="Carbs" value={`${totals.carbs} g`} color="text-blue-300" />
      </div>

      {meals.length === 0 ? (
        <p className="text-white/60">No meals added yet. Upload a photo to get started.</p>
      ) : (
        <ul className="space-y-3">
          {meals.map(m => (
            <li key={m.id} className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-xl p-3">
              <img src={m.img} alt={m.name} className="w-16 h-16 rounded-lg object-cover border border-white/10" />
              <div className="flex-1">
                <p className="font-medium">{m.name} <span className="text-xs text-white/50">x{m.count}</span></p>
                <p className="text-xs text-white/60">{m.kcal} kcal • P {m.protein}g • F {m.fat}g • C {m.carbs}g</p>
              </div>
              <button onClick={() => onRemove(m.id)} className="p-2 rounded-md bg-white/10 hover:bg-white/15 border border-white/10 text-white/80">
                <Trash2 className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex items-center justify-between bg-black/40 border border-white/10 rounded-xl p-3">
        <div className="flex items-center gap-2 text-white/80">
          <Flame className="w-4 h-4 text-orange-400" />
          <span className="text-sm">Target: {target} kcal</span>
        </div>
        <span className={`text-sm ${exceeded ? 'text-red-400' : 'text-emerald-400'}`}>{exceeded ? 'Over' : 'Remaining'}: {Math.abs(target - totals.kcal)} kcal</span>
      </div>
    </section>
  );
}

function Stat({ label, value, color }) {
  return (
    <div className="bg-black/40 border border-white/10 rounded-lg p-3">
      <p className="text-xs text-white/50">{label}</p>
      <p className={`text-xl font-semibold ${color}`}>{value}</p>
    </div>
  );
}
