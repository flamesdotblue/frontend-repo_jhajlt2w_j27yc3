import React, { useMemo, useState, useEffect } from 'react';

function calculateBMR({ age, weight, height, gender }) {
  // Mifflin-St Jeor
  if (!age || !weight || !height) return 0;
  const s = gender === 'female' ? -161 : 5;
  return Math.round(10 * weight + 6.25 * height - 5 * age + s);
}

export default function ProfileSetup({ profile, onUpdate, onTargetChange }) {
  const [local, setLocal] = useState(() => ({
    name: profile?.name || '',
    age: profile?.age || '',
    weight: profile?.weight || '',
    height: profile?.height || '',
    gender: profile?.gender || 'male',
    activity: profile?.activity || 'moderate',
  }));

  useEffect(() => {
    setLocal(prev => ({ ...prev, ...profile }));
  }, [profile]);

  const bmr = useMemo(() => calculateBMR({
    age: Number(local.age),
    weight: Number(local.weight),
    height: Number(local.height),
    gender: local.gender,
  }), [local]);

  const activityFactor = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  }[local.activity] || 1.55;

  const maintenance = Math.round(bmr * activityFactor) || 0;

  const handleChange = (key, value) => {
    const next = { ...local, [key]: value };
    setLocal(next);
    const nextProfile = { ...next, bmr: calculateBMR({ age: Number(next.age), weight: Number(next.weight), height: Number(next.height), gender: next.gender }) };
    onUpdate(nextProfile);
  };

  useEffect(() => {
    if (maintenance && onTargetChange) onTargetChange(maintenance);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maintenance]);

  return (
    <section className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Your Profile</h2>
        <span className="text-xs text-white/50">No sign up needed</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <input className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500/40" placeholder="Name" value={local.name} onChange={e => handleChange('name', e.target.value)} />
        <input type="number" className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500/40" placeholder="Age (years)" value={local.age} onChange={e => handleChange('age', e.target.value)} />
        <input type="number" className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500/40" placeholder="Weight (kg)" value={local.weight} onChange={e => handleChange('weight', e.target.value)} />
        <input type="number" className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500/40" placeholder="Height (cm)" value={local.height} onChange={e => handleChange('height', e.target.value)} />

        <select className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500/40" value={local.gender} onChange={e => handleChange('gender', e.target.value)}>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <select className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500/40" value={local.activity} onChange={e => handleChange('activity', e.target.value)}>
          <option value="sedentary">Activity: Sedentary</option>
          <option value="light">Activity: Light</option>
          <option value="moderate">Activity: Moderate</option>
          <option value="active">Activity: Active</option>
          <option value="very_active">Activity: Very Active</option>
        </select>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-black/40 border border-white/10 rounded-lg p-3">
          <p className="text-xs text-white/50">BMR</p>
          <p className="text-xl font-semibold">{bmr || 0} kcal</p>
        </div>
        <div className="bg-black/40 border border-white/10 rounded-lg p-3">
          <p className="text-xs text-white/50">Estimated maintenance</p>
          <p className="text-xl font-semibold">{maintenance || 0} kcal</p>
        </div>
        <div className="bg-black/40 border border-white/10 rounded-lg p-3">
          <p className="text-xs text-white/50">Daily target (editable)</p>
          <input type="number" className="mt-1 w-full bg-black/60 border border-white/10 rounded-md px-2 py-1 outline-none focus:ring-2 focus:ring-emerald-500/40" value={profile?.targetCalories ?? maintenance} onChange={e => onTargetChange(Number(e.target.value) || 0)} />
        </div>
      </div>
    </section>
  );
}
