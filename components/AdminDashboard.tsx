import React, { useState } from 'react';
import { Prize } from '../types';
import { prizeService } from '../services/prizeService';

interface AdminDashboardProps {
  prizes: Prize[];
  onUpdate: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ prizes, onUpdate }) => {
  const [editingPrize, setEditingPrize] = useState<Prize | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPrize) return;

    setLoading(true);

    const { id, createdAt, updatedAt, ...payload } = editingPrize;

    try {
      if (!id) {
        // CREATE
        await prizeService.createPrize(payload);
      } else {
        // UPDATE
        await prizeService.updatePrize(id, payload);
      }

      setEditingPrize(null);
      onUpdate();
    } finally {
      setLoading(false);
    }
  };

  const handleNewPrize = () => {
    setEditingPrize({
      id: '',
      name: '',
      imageUrl: '',
      remainingQuantity: 10,
      winProbability: 5,
      isActive: true,
      color: '#' + Math.floor(Math.random() * 16777215).toString(16),
    });
  };

  const totalProb = prizes.reduce((acc, p) => acc + p.winProbability, 0);

  return (
    <div className="py-10 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-bold font-heading">Prize Management</h1>
          <p className="text-slate-400 mt-1">
            Total allocated:{' '}
            <span
              className={`font-bold ${
                totalProb > 100 ? 'text-red-400' : 'text-emerald-400'
              }`}
            >
              {totalProb.toFixed(2)}%
            </span>
          </p>
          {totalProb < 100 && (
            <p className="text-xs text-slate-500 italic mt-1">
              Remaining automatically assigned to "No Prize".
            </p>
          )}
        </div>

        <button
          onClick={handleNewPrize}
          className="bg-amber-500 hover:bg-amber-600 text-red-900 px-6 py-3 rounded-xl font-bold flex items-center space-x-2 transition shadow-lg shadow-amber-500/20"
        >
          <span>➕ Thêm Giải Thưởng</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {prizes.map(prize => (
          <div
            key={prize.id}
            className="glass-panel rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex items-center space-x-6">
              <div className="w-14 h-14 rounded-xl bg-slate-800 overflow-hidden border border-white/5">
                {prize.imageUrl && (
                  <img
                    src={prize.imageUrl}
                    alt={prize.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold">{prize.name}</h3>
                <div className="text-sm text-slate-400 mt-1">
                  Prob: <span className="text-amber-400">{prize.winProbability}%</span> ·
                  Stock:{' '}
                  <span className="text-amber-400">
                    {prize.remainingQuantity}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex space-x-2 w-full sm:w-auto">
              <button
                onClick={() => setEditingPrize(prize)}
                className="flex-1 sm:flex-none p-3 bg-slate-800 hover:bg-slate-700 rounded-xl"
              >
                Sửa
              </button>
              <button
  onClick={async () => {
    if (confirm('Ngừng áp dụng giải thưởng này?')) {
      await prizeService.updatePrize(prize.id, { isActive: false });
      onUpdate();
    }
  }}
  className="flex-1 sm:flex-none px-4 py-3 rounded-xl
             bg-slate-900/60 hover:bg-slate-900
             text-slate-400 hover:text-amber-400
             border border-white/10
             transition"
>
  Ngừng áp dụng
</button>
            </div>
          </div>
        ))}
      </div>

      {editingPrize && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <form
            onSubmit={handleSave}
            className="glass-panel w-full max-w-lg rounded-[2.5rem] p-8"
          >
            <h2 className="text-2xl font-bold mb-6 text-amber-500">
              Cấu Hình Giải Thưởng
            </h2>

            <div className="space-y-4">
  <div>
    <label className="block text-sm font-medium text-slate-300 mb-1">
      Tên giải thưởng
    </label>
    <input
      required
      value={editingPrize.name}
      onChange={e =>
        setEditingPrize({ ...editingPrize, name: e.target.value })
      }
      className="w-full bg-slate-900 rounded-xl px-4 py-3"
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-slate-300 mb-1">
      Image URL
    </label>
    <input
      value={editingPrize.imageUrl}
      onChange={e =>
        setEditingPrize({ ...editingPrize, imageUrl: e.target.value })
      }
      className="w-full bg-slate-900 rounded-xl px-4 py-3"
    />
  </div>

  <div className="grid grid-cols-2 gap-4">
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-1">
        Tỷ lệ trúng (%)
      </label>
      <input
        type="number"
        step="0.001"
        value={editingPrize.winProbability}
        onChange={e =>
          setEditingPrize({
            ...editingPrize,
            winProbability: Number(e.target.value),
          })
        }
        className="w-full bg-slate-900 rounded-xl px-4 py-3"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-slate-300 mb-1">
        Số lượng còn lại
      </label>
      <input
        type="number"
        value={editingPrize.remainingQuantity}
        onChange={e =>
          setEditingPrize({
            ...editingPrize,
            remainingQuantity: Number(e.target.value),
          })
        }
        className="w-full bg-slate-900 rounded-xl px-4 py-3"
      />
    </div>
  </div>

  <label className="flex items-center justify-between bg-slate-900 rounded-xl px-4 py-3 cursor-pointer">
    <span className="text-sm text-slate-300">
      Kích hoạt giải thưởng
    </span>
    <input
      type="checkbox"
      checked={editingPrize.isActive}
      onChange={e =>
        setEditingPrize({
          ...editingPrize,
          isActive: e.target.checked,
        })
      }
      className="w-5 h-5 accent-amber-500"
    />
  </label>
</div>
            <div className="flex space-x-3 mt-8">
              <button
                type="button"
                onClick={() => setEditingPrize(null)}
                className="flex-1 px-4 py-3 border border-white/10 rounded-xl"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-3 bg-amber-500 text-red-900 rounded-xl font-bold"
              >
                {loading ? 'Đang lưu...' : 'Lưu'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;