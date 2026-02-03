
import React, { useState } from 'react';
import { Prize } from '../types';
import { prizeService } from '../services/prizeService';

interface AdminDashboardProps {
  prizes: Prize[];
  onUpdate: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ prizes, onUpdate }) => {
  const [editingPrize, setEditingPrize] = useState<Prize | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPrize) {
      prizeService.updatePrize(editingPrize);
      setEditingPrize(null);
      onUpdate();
    }
  };

  const handleNewPrize = () => {
    setEditingPrize({
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      imageUrl: 'https://picsum.photos/100/100?random=' + Math.floor(Math.random() * 100),
      remainingQuantity: 10,
      winProbability: 5,
      isActive: true,
      color: '#'+Math.floor(Math.random()*16777215).toString(16)
    });
  };

  const totalProb = prizes.reduce((acc, p) => acc + p.winProbability, 0);

  return (
    <div className="py-10 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold font-heading">Prize Management</h1>
          <p className="text-slate-400 mt-1">Total allocated probability: <span className={`font-bold ${totalProb > 100 ? 'text-red-400' : 'text-emerald-400'}`}>{totalProb.toFixed(2)}%</span></p>
          {totalProb < 100 && <p className="text-xs text-slate-500 italic mt-1">Remaining {(100 - totalProb).toFixed(2)}% automatically assigned to "No Prize" outcomes.</p>}
        </div>
        <button 
          onClick={handleNewPrize}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center space-x-2 transition"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          <span>Add New Prize</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {prizes.map(prize => (
          <div key={prize.id} className="glass-panel rounded-2xl p-6 flex items-center justify-between group hover:border-white/20 transition">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-16 h-16 rounded-xl bg-slate-800 flex items-center justify-center overflow-hidden border border-white/5">
                  <img src={prize.imageUrl} alt={prize.name} className="w-full h-full object-cover" />
                </div>
                <div 
                  className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-slate-900"
                  style={{ backgroundColor: prize.color }}
                ></div>
              </div>
              <div>
                <h3 className="text-lg font-bold">{prize.name}</h3>
                <div className="flex space-x-4 mt-1 text-sm text-slate-400">
                  <span>Prob: <span className="text-indigo-400 font-medium">{prize.winProbability}%</span></span>
                  <span>Stock: <span className="text-indigo-400 font-medium">{prize.remainingQuantity}</span></span>
                  <span className={prize.isActive ? 'text-emerald-400' : 'text-rose-400'}>
                    {prize.isActive ? 'Active' : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition">
              <button 
                onClick={() => setEditingPrize(prize)}
                className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              </button>
              <button 
                onClick={() => { if(confirm('Delete?')){ prizeService.deletePrize(prize.id); onUpdate(); }}}
                className="p-2.5 bg-rose-900/20 hover:bg-rose-900/40 text-rose-400 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingPrize && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <form onSubmit={handleSave} className="glass-panel w-full max-w-lg rounded-3xl p-8 shadow-2xl border border-indigo-500/20">
            <h2 className="text-2xl font-bold mb-6">Edit Prize</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Prize Name</label>
                <input 
                  type="text" required
                  value={editingPrize.name}
                  onChange={e => setEditingPrize({...editingPrize, name: e.target.value})}
                  className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Win Prob (%)</label>
                  <input 
                    type="number" step="0.001" required
                    value={editingPrize.winProbability}
                    onChange={e => setEditingPrize({...editingPrize, winProbability: parseFloat(e.target.value)})}
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Stock</label>
                  <input 
                    type="number" required
                    value={editingPrize.remainingQuantity}
                    onChange={e => setEditingPrize({...editingPrize, remainingQuantity: parseInt(e.target.value)})}
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <input 
                  type="checkbox" id="isActive"
                  checked={editingPrize.isActive}
                  onChange={e => setEditingPrize({...editingPrize, isActive: e.target.checked})}
                  className="w-5 h-5 bg-slate-800 border border-white/10 rounded"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-slate-300">Active and visible on wheel</label>
              </div>
            </div>
            <div className="flex space-x-3 mt-8">
              <button 
                type="button" 
                onClick={() => setEditingPrize(null)}
                className="flex-1 px-4 py-2.5 border border-white/10 rounded-xl hover:bg-white/5 transition"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
