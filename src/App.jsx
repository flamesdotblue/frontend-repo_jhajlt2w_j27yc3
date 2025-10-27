import React, { useMemo, useState } from 'react';
import Header from './components/Header';
import ProfileSetup from './components/ProfileSetup';
import MealUploader from './components/MealUploader';
import DailySummary from './components/DailySummary';

export default function App() {
  const [profile, setProfile] = useState({
    name: '', age: '', weight: '', height: '', gender: 'male', activity: 'moderate', targetCalories: 0,
  });
  const [meals, setMeals] = useState([]);

  const totals = useMemo(() => {
    return meals.reduce((acc, m) => {
      acc.kcal += Number(m.kcal) || 0;
      acc.protein += Number(m.protein) || 0;
      acc.fat += Number(m.fat) || 0;
      acc.carbs += Number(m.carbs) || 0;
      return acc;
    }, { kcal: 0, protein: 0, fat: 0, carbs: 0 });
  }, [meals]);

  const exceeded = profile.targetCalories > 0 && totals.kcal > profile.targetCalories;
  const caloriesLeft = Math.max(0, (profile.targetCalories || 0) - totals.kcal);

  function handleAddMeal(m) {
    setMeals(prev => [m, ...prev]);
  }

  function handleRemove(id) {
    setMeals(prev => prev.filter(m => m.id !== id));
  }

  return (
    <div className="min-h-screen w-full bg-black text-white">
      <Header caloriesLeft={caloriesLeft} targetCalories={profile.targetCalories || 0} />

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <ProfileSetup
          profile={profile}
          onUpdate={(p) => setProfile(prev => ({ ...prev, ...p }))}
          onTargetChange={(val) => setProfile(prev => ({ ...prev, targetCalories: Number(val) }))}
        />

        <MealUploader onAddMeal={handleAddMeal} exceeded={exceeded} />

        <DailySummary meals={meals} totals={{
          kcal: Math.round(totals.kcal),
          protein: Math.round(totals.protein * 10) / 10,
          fat: Math.round(totals.fat * 10) / 10,
          carbs: Math.round(totals.carbs * 10) / 10,
        }} target={profile.targetCalories || 0} onRemove={handleRemove} />

        <footer className="py-6 text-center text-white/40 text-sm">
          Built for dark mode. Upload photos, clarify items like chapati vs appam, set your daily target, and get a day-end summary.
        </footer>
      </main>
    </div>
  );
}
