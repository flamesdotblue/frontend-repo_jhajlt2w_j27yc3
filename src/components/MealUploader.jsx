import React, { useMemo, useState } from 'react';
import { Camera, Upload, PlusCircle, AlertTriangle, Trash2 } from 'lucide-react';

// Simple lookup per unit (approximate values)
const FOOD_DB = {
  chapati: { unit: 'piece', kcal: 120, protein: 4, fat: 4, carbs: 18 },
  roti: { unit: 'piece', kcal: 120, protein: 4, fat: 4, carbs: 18 },
  appam: { unit: 'piece', kcal: 100, protein: 2, fat: 2, carbs: 20 },
  dosa: { unit: 'piece', kcal: 160, protein: 4, fat: 6, carbs: 24 },
  idli: { unit: 'piece', kcal: 58, protein: 2, fat: 0.4, carbs: 12 },
  rice: { unit: 'cup (cooked)', kcal: 200, protein: 4, fat: 0.4, carbs: 45 },
  chicken: { unit: '100g cooked', kcal: 165, protein: 31, fat: 3.6, carbs: 0 },
  egg: { unit: 'piece', kcal: 78, protein: 6, fat: 5, carbs: 0.6 },
  banana: { unit: 'piece', kcal: 105, protein: 1.3, fat: 0.4, carbs: 27 },
  milk: { unit: 'cup (250ml)', kcal: 150, protein: 8, fat: 8, carbs: 12 },
  paneer: { unit: '100g', kcal: 265, protein: 18, fat: 20, carbs: 4 },
};

function detectFoodName(filename = '') {
  const lower = filename.toLowerCase();
  const candidates = Object.keys(FOOD_DB).filter(k => lower.includes(k));
  if (candidates.length) return candidates[0];
  return '';
}

export default function MealUploader({ onAddMeal, exceeded }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [name, setName] = useState('');
  const [count, setCount] = useState(1);
  const [foodKey, setFoodKey] = useState('');
  const [custom, setCustom] = useState({ kcal: '', protein: '', fat: '', carbs: '' });

  const isAmbiguous = useMemo(() => {
    // Ask clarification between chapati and appam if keywords like 'flatbread' or 'round' present
    if (!name) return false;
    const n = name.toLowerCase();
    return n.includes('chapati') || n.includes('roti') || n.includes('appam');
  }, [name]);

  const autoMacros = useMemo(() => {
    const key = foodKey || name.toLowerCase();
    const entry = FOOD_DB[key];
    if (!entry) return null;
    return {
      kcal: Math.round(entry.kcal * count),
      protein: Math.round(entry.protein * count * 10) / 10,
      fat: Math.round(entry.fat * count * 10) / 10,
      carbs: Math.round(entry.carbs * count * 10) / 10,
      perUnit: entry.unit,
    };
  }, [foodKey, name, count]);

  const macros = autoMacros || {
    kcal: Number(custom.kcal) || 0,
    protein: Number(custom.protein) || 0,
    fat: Number(custom.fat) || 0,
    carbs: Number(custom.carbs) || 0,
  };

  function handleFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result?.toString() || '');
    reader.readAsDataURL(f);
    const guess = detectFoodName(f.name);
    if (guess) {
      setName(guess);
      setFoodKey(guess);
    }
  }

  function addMeal() {
    if (!name || (!autoMacros && !custom.kcal)) return;
    onAddMeal({
      id: Date.now(),
      name,
      count,
      ...(autoMacros ? macros : { ...macros }),
      img: preview,
    });
    setFile(null);
    setPreview('');
    setName('');
    setCount(1);
    setFoodKey('');
    setCustom({ kcal: '', protein: '', fat: '', carbs: '' });
  }

  return (
    <section className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Add a meal</h2>
        {exceeded && (
          <div className="flex items-center gap-2 text-amber-400 text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>Target exceeded today</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <label className="flex items-center justify-center aspect-video lg:aspect-square bg-black/40 border border-dashed border-white/15 rounded-xl cursor-pointer hover:border-emerald-500/40 transition-colors overflow-hidden">
          {preview ? (
            <img src={preview} alt="preview" className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-2 text-white/60">
              <Camera className="w-8 h-8" />
              <span className="text-sm">Upload meal photo</span>
            </div>
          )}
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </label>

        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="col-span-1 sm:col-span-2">
            <label className="block text-xs text-white/60 mb-1">What is this meal?</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g., chapati, rice, chicken curry" className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500/40" />
          </div>

          {isAmbiguous && (
            <div className="col-span-1 sm:col-span-2 bg-black/30 border border-white/10 rounded-lg p-3">
              <p className="text-sm mb-2">Did you mean chapati/roti or appam?</p>
              <div className="flex flex-wrap gap-2">
                {['chapati', 'appam'].map(opt => (
                  <button key={opt} onClick={() => { setFoodKey(opt); setName(opt); }} className={`px-3 py-1.5 rounded-md border ${foodKey === opt ? 'bg-emerald-500 text-black border-emerald-500' : 'bg-white/5 border-white/10 text-white'}`}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs text-white/60 mb-1">How many?</label>
            <input type="number" min={1} value={count} onChange={e => setCount(Math.max(1, Number(e.target.value)))} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500/40" />
          </div>

          <div>
            <label className="block text-xs text-white/60 mb-1">Detected database</label>
            <select value={foodKey} onChange={e => setFoodKey(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500/40">
              <option value="">Custom</option>
              {Object.keys(FOOD_DB).map(k => (
                <option key={k} value={k}>{k} ({FOOD_DB[k].unit})</option>
              ))}
            </select>
          </div>

          {autoMacros ? (
            <div className="sm:col-span-2 grid grid-cols-4 gap-2">
              {['kcal', 'protein', 'fat', 'carbs'].map(key => (
                <div key={key} className="bg-black/40 border border-white/10 rounded-lg p-3">
                  <p className="text-xs text-white/50">{key.toUpperCase()}</p>
                  <p className="text-lg font-semibold">{macros[key]} {key === 'kcal' ? 'kcal' : 'g'}</p>
                </div>
              ))}
              <p className="col-span-4 text-xs text-white/50">Per {count} x {FOOD_DB[foodKey]?.unit}</p>
            </div>
          ) : (
            <div className="sm:col-span-2 grid grid-cols-4 gap-2">
              {['kcal', 'protein', 'fat', 'carbs'].map(key => (
                <div key={key}>
                  <label className="block text-xs text-white/60 mb-1">{key.toUpperCase()}</label>
                  <input type="number" value={custom[key]} onChange={e => setCustom(prev => ({ ...prev, [key]: e.target.value }))} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500/40" />
                </div>
              ))}
            </div>
          )}

          <div className="sm:col-span-2 flex items-center gap-3">
            <button onClick={addMeal} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 text-black font-medium hover:bg-emerald-400 transition-colors">
              <PlusCircle className="w-4 h-4" /> Add meal
            </button>
            {file && (
              <button onClick={() => { setFile(null); setPreview(''); setName(''); setFoodKey(''); setCustom({ kcal: '', protein: '', fat: '', carbs: '' }); }} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 text-white hover:bg-white/15 border border-white/10">
                <Trash2 className="w-4 h-4" /> Clear
              </button>
            )}
          </div>
        </div>
      </div>

      <p className="mt-3 text-xs text-white/50 flex items-center gap-2">
        <Upload className="w-3.5 h-3.5" /> Tip: The app will try to guess from the photo filename. You can correct the food and quantity to get accurate macros.
      </p>
    </section>
  );
}
