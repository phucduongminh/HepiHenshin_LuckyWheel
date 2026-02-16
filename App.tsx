import React, { useState, useEffect } from "react";
import { Prize, SpinRecord, SpinResult, ThemeConfig } from "./types";
import { THEMES } from "./themeConfig";
import { prizeService } from "./services/prizeService";
import LuckyWheel from "./components/LuckyWheel";
import AdminDashboard from "./components/AdminDashboard";
import SpinHistory from "./components/SpinHistory";
import EventHeader from "./components/EventHeader";
import PrizeModal from "./components/PrizeModal";
import { AuthProvider } from "./context/auth-provider";
import { AdminGuard } from "./guard/admin-guard";
import { useGameAuth } from "./hooks/useGameAuth";

// --- Helpers bên ngoài component để tránh khởi tạo lại ---
const getHash = () =>
  window.location.hash.startsWith("#/")
    ? window.location.hash
    : "#/lucky-wheel";

/* =========================
   AppContent (logic chính)
========================= */
const AppContent: React.FC = () => {
  // 1. States
  const [currentPath, setCurrentPath] = useState<string>(getHash());
  const [theme] = useState<ThemeConfig>(THEMES.tet);
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [history, setHistory] = useState<SpinRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showResultModal, setShowResultModal] = useState(false);
  const [lastResult, setLastResult] = useState<SpinResult | null>(null);

  const { user, loadingUser } = useGameAuth(); // ✅ lấy user từ context

  // 2. Data Fetching & Side Effects
  useEffect(() => {
    if (loadingUser) return; // ✅ chờ auth xong mới gọi API

    const initData = async () => {
      try {
        setLoading(true);

        const historyPromise = user
          ? prizeService.getUserSpinHistory(user.id) // ✅ user.id
          : prizeService.getSpinHistory();

        const [p, h] = await Promise.all([
          prizeService.getPrizes(),
          historyPromise,
        ]);

        setPrizes(Array.isArray(p) ? p : []);
        setHistory(Array.isArray(h) ? h : []);
      } catch (err) {
        console.error("Lỗi tải dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, [user, loadingUser]);

  useEffect(() => {
    const handleHashChange = () => setCurrentPath(getHash());
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // 3. Event Handlers
  const refreshData = async () => {
    const historyPromise = user
      ? prizeService.getUserSpinHistory(user.id)
      : prizeService.getSpinHistory();

    const [newPrizes, newHistory] = await Promise.all([
      prizeService.getPrizes(),
      historyPromise,
    ]);

    setPrizes(newPrizes);
    setHistory(newHistory);
  };

  const handleSpinComplete = (result: SpinResult) => {
    setLastResult(result);
    setShowResultModal(true);
    refreshData();
  };

  // 4. Sub-render functions
  const renderHomeContent = () => (
    <div className="flex flex-col items-center justify-start pb-24">
      <EventHeader theme={theme} />

      <div className="w-full px-4 sm:px-8 flex justify-center mt-4 mb-8 md:my-12">
        <LuckyWheel
          prizes={prizes}
          onSpinComplete={handleSpinComplete}
          theme={theme}
        />
      </div>

      <div className="w-full max-w-6xl px-4 sm:px-8 mt-12 md:mt-24">
        <div className="flex items-center space-x-6 mb-10">
          <div className="h-px flex-1 bg-white/5"></div>
          <h4 className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-black text-amber-500/60 whitespace-nowrap">
            Danh Sách Quà Tặng Đặc Biệt
          </h4>
          <div className="h-px flex-1 bg-white/5"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {prizes
            .filter((p) => p.isActive && p.winProbability < 10)
            .slice(0, 3)
            .map((p) => (
              <div
                key={p.id}
                className="glass-panel rounded-[2.5rem] p-6 flex items-center space-x-6 group hover:bg-white/10 transition-all duration-500 transform hover:-translate-y-2 border-white/5 hover:border-amber-500/20"
              >
                <div className="relative shrink-0">
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-3xl object-cover border-2 border-amber-500/20 shadow-2xl group-hover:border-amber-500/50 transition-colors"
                  />
                  <div className="absolute -top-3 -right-3 bg-red-600 text-white text-[9px] font-black px-2.5 py-1 rounded-full shadow-lg border border-amber-500/50">
                    HIẾM
                  </div>
                </div>
                <div className="overflow-hidden">
                  <h3 className="font-bold text-base md:text-lg text-slate-100 group-hover:text-amber-400 transition truncate">
                    {p.name}
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-1.5 uppercase tracking-widest font-black">
                    SL: {p.remainingQuantity}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (loading)
      return (
        <div className="h-[60vh] flex items-center justify-center text-slate-400 font-bold animate-pulse">
          🏮 Đang tải dữ liệu...
        </div>
      );

    switch (currentPath) {
      case "#/admin":
        return (
          <div className="px-4 sm:px-6">
            <AdminGuard>
              <AdminDashboard prizes={prizes} onUpdate={refreshData} />
            </AdminGuard>
          </div>
        );
      case "#/history":
        return (
          <div className="px-4 sm:px-6">
            <SpinHistory history={history} />
          </div>
        );
      default:
        return renderHomeContent();
    }
  };

  return (
    <div
      className={`min-h-screen ${theme.bgClass} flex flex-col text-slate-100 selection:bg-amber-500 selection:text-red-900`}
    >
      <nav className="sticky top-0 z-[60] glass-panel border-b border-white/5 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => (window.location.hash = "#/lucky-wheel")}
          >
            <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-amber-400 to-red-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition duration-300">
              <span className="text-lg md:text-xl">🧧</span>
            </div>
            <span className="text-lg md:text-xl font-black font-festive tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">
              HepiHenshin 2026
            </span>
          </div>

            <div className="hidden sm:flex space-x-8 text-[11px] font-black uppercase tracking-[0.2em]">
              {[
                { label: "TRANG CHỦ", path: "#/lucky-wheel" },
                { label: "VINH DANH", path: "#/history" },
                { label: "QUẢN TRỊ", path: "#/admin" },
              ].map((nav) => (
                <a
                  key={nav.path}
                  href={nav.path}
                  className={`hover:text-amber-400 transition-colors ${currentPath === nav.path ? "text-amber-400" : "text-slate-400"}`}
                >
                  {nav.label}
                </a>
              ))}
            </div>

            <div className="sm:hidden flex items-center space-x-4">
              <a
                href="#/history"
                className={`p-2 ${currentPath === "#/history" ? "grayscale-0" : "grayscale"}`}
              >
                🏆
              </a>
              <a
                href="#/admin"
                className={`p-2 ${currentPath === "#/admin" ? "grayscale-0" : "grayscale"}`}
              >
                ⚙️
              </a>
            </div>
        </div>
      </nav>

      <main className="flex-1 w-full max-w-7xl mx-auto overflow-x-hidden">
        {renderContent()}
      </main>

      {loadingUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[70]">
          <div className="bg-white/10 border border-white/20 rounded-lg p-6 flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-slate-300 font-bold">
              Đang xác thực người chơi...
            </p>
          </div>
        </div>
      )}

      <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-[70]">
        {user ? (
          <span>Xin chào, {user.name}!</span>
        ) : (
          <span>Phiên đăng nhập đã hết hạn.</span>
        )}
      </div>
    </div>
  );
};

/* =========================
   App wrapper
========================= */
const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
