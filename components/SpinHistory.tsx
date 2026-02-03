
import React from 'react';
import { SpinRecord } from '../types';

interface SpinHistoryProps {
  history: SpinRecord[];
}

const SpinHistory: React.FC<SpinHistoryProps> = ({ history }) => {
  return (
    <div className="py-10 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-heading">Recent Winners</h1>
          <p className="text-slate-400">Total verified spins: {history.length}</p>
        </div>
        <div className="bg-indigo-500/10 text-indigo-400 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest border border-indigo-500/20">
          Live Feed
        </div>
      </div>

      <div className="glass-panel rounded-3xl overflow-hidden border border-white/5 shadow-xl">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/5 text-slate-400 text-xs font-bold uppercase tracking-wider">
              <th className="px-6 py-4">Winner ID</th>
              <th className="px-6 py-4">Prize</th>
              <th className="px-6 py-4">Time</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {history.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-slate-500 italic">No spins yet. Be the first!</td>
              </tr>
            ) : (
              history.map((record) => (
                <tr key={record.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 border border-white/10"></div>
                      <span className="font-mono text-sm">USER-{record.userId.slice(-4)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-semibold ${record.prizeId ? 'text-indigo-400' : 'text-slate-500'}`}>
                      {record.prizeName}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(record.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20 uppercase">
                      Verified
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SpinHistory;
