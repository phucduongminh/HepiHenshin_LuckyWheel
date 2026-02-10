
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-bold font-heading">Prize Management</h1>
          <p className="text-slate-400 mt-1">Total allocated: <span className={`font-bold ${totalProb > 100 ? 'text-red-400' : 'text-emerald-400'}`}>{totalProb.toFixed(2)}%</span></p>
          {totalProb < 100 && <p className="text-xs text-slate-500 italic mt-1">Remaining automatically assigned to "No Prize".</p>}
        </div>
        <button 
          onClick={handleNewPrize}
          className="bg-amber-500 hover:bg-amber-600 text-red-900 px-6 py-3 rounded-xl font-bold flex items-center space-x-2 transition shadow-lg shadow-amber-500/20"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
          <span>Thêm Giải Thưởng</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {prizes.map(prize => (
          <div key={prize.id} className="glass-panel rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between group hover:border-white/20 transition-all gap-4">
            <div className="flex items-center space-x-6">
              <div className="relative shrink-0">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-slate-800 flex items-center justify-center overflow-hidden border border-white/5">
                  <img src={prize.imageUrl} alt={prize.name} className="w-full h-full object-cover" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold">{prize.name}</h3>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-slate-400">
                  <span>Prob: <span className="text-amber-400 font-medium">{prize.winProbability}%</span></span>
                  <span>Stock: <span className="text-amber-400 font-medium">{prize.remainingQuantity}</span></span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2 w-full sm:w-auto">
              <button 
                onClick={() => setEditingPrize(prize)}
                className="flex-1 sm:flex-none p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
              >
                Sửa
              </button>
              <button 
                onClick={() => { if(confirm('Xóa giải thưởng này?')){ prizeService.deletePrize(prize.id); onUpdate(); }}}
                className="flex-1 sm:flex-none p-3 bg-rose-900/20 hover:bg-rose-900/40 text-rose-400 rounded-xl transition"
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingPrize && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <form onSubmit={handleSave} className="glass-panel w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl border border-amber-500/20 animate-in zoom-in duration-300">
            <h2 className="text-2xl font-bold mb-6 text-amber-500">Cấu Hình Giải Thưởng</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Tên giải thưởng</label>
                <input 
                  type="text" required
                  value={editingPrize.name}
                  onChange={e => setEditingPrize({...editingPrize, name: e.target.value})}
                  className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Tỷ lệ (%)</label>
                  <input 
                    type="number" step="0.001" required
                    value={editingPrize.winProbability}
                    onChange={e => setEditingPrize({...editingPrize, winProbability: parseFloat(e.target.value)})}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Số lượng</label>
                  <input 
                    type="number" required
                    value={editingPrize.remainingQuantity}
                    onChange={e => setEditingPrize({...editingPrize, remainingQuantity: parseInt(e.target.value)})}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                  />
                </div>
              </div>
            </div>
            <div className="flex space-x-3 mt-8">
              <button 
                type="button" 
                onClick={() => setEditingPrize(null)}
                className="flex-1 px-4 py-3 border border-white/10 rounded-xl hover:bg-white/5 transition font-bold"
              >
                Hủy
              </button>
              <button 
                type="submit"
                className="flex-1 px-4 py-3 bg-amber-500 hover:bg-amber-600 text-red-900 font-black rounded-xl shadow-lg transition"
              >
                Lưu
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
