
import React, { useState, useEffect } from 'react';
import { Prize, SpinRecord, SpinResult, ThemeConfig } from './types';
import { THEMES } from './themeConfig';
import { prizeService } from './services/prizeService';
import LuckyWheel from './components/LuckyWheel';
import AdminDashboard from './components/AdminDashboard';
import SpinHistory from './components/SpinHistory';
import EventHeader from './components/EventHeader';
import PrizeModal from './components/PrizeModal';

const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>(window.location.hash || '#/lucky-wheel');
  const [theme] = useState<ThemeConfig>(THEMES.tet);
  const [prizes, setPrizes] = useState<Prize[]>(prizeService.getPrizes());
  const [history, setHistory] = useState<SpinRecord[]>(prizeService.getSpinHistory());
  const [showResultModal, setShowResultModal] = useState(false);
  const [lastResult, setLastResult] = useState<SpinResult | null>(null);

  useEffect(() => {
    const handleHashChange = () => setCurrentPath(window.location.hash || '#/lucky-wheel');
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const refreshData = () => {
    setPrizes(prizeService.getPrizes());
    setHistory(prizeService.getSpinHistory());
  };

  const handleSpinComplete = (result: SpinResult) => {
    setLastResult(result);
    setShowResultModal(true);
    refreshData();
  };

  const renderContent = () => {
    switch (currentPath) {
      case '#/admin':
        return <div className="px-4 sm:px-6"><AdminDashboard prizes={prizes} onUpdate={refreshData} /></div>;
      case '#/history':
        return <div className="px-4 sm:px-6"><SpinHistory history={history} /></div>;
      default:
        return (
          <div className="flex flex-col items-center justify-start pb-24">
            {/* Header Section */}
            <EventHeader theme={theme} />
            
            {/* Wheel Section - Focal Point with safety padding */}
            <div className="w-full px-4 sm:px-8 flex justify-center mt-4 mb-8 md:my-12">
              <LuckyWheel 
                prizes={prizes} 
                onSpinComplete={handleSpinComplete} 
                theme={theme} 
              />
            </div>

            {/* Prize Cards Section - Clearly distinct secondary area */}
            <div className="w-full max-w-6xl px-4 sm:px-8 mt-12 md:mt-24">
              <div className="flex items-center space-x-6 mb-10">
                <div className="h-px flex-1 bg-white/5"></div>
                <h4 className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-black text-amber-500/60 whitespace-nowrap">Danh Sách Quà Tặng Đặc Biệt</h4>
                <div className="h-px flex-1 bg-white/5"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {prizes.filter(p => p.isActive && p.winProbability < 10).slice(0, 3).map(p => (
                  <div key={p.id} className="glass-panel rounded-[2.5rem] p-6 flex items-center space-x-6 group hover:bg-white/10 transition-all duration-500 transform hover:-translate-y-2 border-white/5 hover:border-amber-500/20">
                    <div className="relative shrink-0">
                      <img src={p.imageUrl} alt={p.name} className="w-16 h-16 md:w-20 md:h-20 rounded-3xl object-cover border-2 border-amber-500/20 shadow-2xl group-hover:border-amber-500/50 transition-colors" />
                      <div className="absolute -top-3 -right-3 bg-red-600 text-white text-[9px] font-black px-2.5 py-1 rounded-full shadow-lg border border-amber-500/50">
                        HIẾM
                      </div>
                    </div>
                    <div className="overflow-hidden">
                      <h3 className="font-bold text-base md:text-lg text-slate-100 group-hover:text-amber-400 transition truncate">{p.name}</h3>
                      <p className="text-[10px] text-slate-500 mt-1.5 uppercase tracking-widest font-black">SL: {p.remainingQuantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen ${theme.bgClass} flex flex-col`}>
      <nav className="sticky top-0 z-[60] glass-panel border-b border-white/5 px-4 sm:px-6 py-4 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div 
            className="flex items-center space-x-3 cursor-pointer group" 
            onClick={() => window.location.hash = '#/lucky-wheel'}
          >
            <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-amber-400 to-red-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition duration-300">
              <span className="text-lg md:text-xl">🧧</span>
            </div>
            <span className="text-lg md:text-xl font-black font-festive tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">HEPIHENSHIN 2026</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden sm:flex space-x-6 md:space-x-8 text-[11px] font-black uppercase tracking-[0.2em]">
            <a href="#/lucky-wheel" className={`hover:text-amber-400 transition-colors duration-300 ${currentPath === '#/lucky-wheel' ? 'text-amber-400' : 'text-slate-400'}`}>TRANG CHỦ</a>
            <a href="#/history" className={`hover:text-amber-400 transition-colors duration-300 ${currentPath === '#/history' ? 'text-amber-400' : 'text-slate-400'}`}>VINH DANH</a>
            <a href="#/admin" className={`hover:text-amber-400 transition-colors duration-300 ${currentPath === '#/admin' ? 'text-amber-400' : 'text-slate-400'}`}>QUẢN TRỊ</a>
          </div>
          
          {/* Mobile Nav Toggle Icon - Visually indicates interactivity */}
          <div className="sm:hidden flex items-center space-x-4">
             <a href="#/history" className={`text-xs font-black p-2 ${currentPath === '#/history' ? 'text-amber-400' : 'text-slate-300'}`}>🏆</a>
             <a href="#/admin" className={`text-xs font-black p-2 ${currentPath === '#/admin' ? 'text-amber-400' : 'text-slate-300'}`}>⚙️</a>
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full max-w-7xl mx-auto overflow-x-hidden">
        {renderContent()}
      </main>

      {showResultModal && lastResult && (
        <PrizeModal 
          isOpen={showResultModal} 
          onClose={() => setShowResultModal(false)}
          result={lastResult}
          theme={theme}
        />
      )}

      <footer className="mt-auto py-12 md:py-16 border-t border-white/5 text-center bg-black/20 px-4">
        <div className="mb-6 flex justify-center space-x-6 md:space-x-8 text-xl md:text-2xl">
          <span className="hover:scale-125 transition cursor-default">💮</span>
          <span className="animate-pulse scale-110 cursor-default">🏮</span>
          <span className="hover:scale-125 transition cursor-default">💮</span>
        </div>
        <p className="font-bold text-slate-400 text-xs md:text-sm tracking-wide">
          2026 Năm Bính Ngọ - Vòng Quay May Mắn
        </p>
        <div className="mt-4 text-[9px] md:text-[10px] text-slate-600 uppercase tracking-[0.4em]">&copy; HepiHenshin</div>
      </footer>
    </div>
  );
};

export default App;
