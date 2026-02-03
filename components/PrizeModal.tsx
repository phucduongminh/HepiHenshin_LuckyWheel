
import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { SpinResult, ThemeConfig } from '../types';
import Modal from './Modal';

interface PrizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: SpinResult;
  theme: ThemeConfig;
}

const PrizeModal: React.FC<PrizeModalProps> = ({ isOpen, onClose, result, theme }) => {
  useEffect(() => {
    if (isOpen && result.prize) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [isOpen, result]);

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title={result.prize ? "CHÚC MỪNG BẠN!" : "TIẾC QUÁ!"}
    >
      <div className="text-center py-6">
        {result.prize ? (
          <div className="animate-in zoom-in duration-500">
            <div className="relative inline-block mb-8">
              {/* Animated glow */}
              <div className="absolute inset-0 bg-amber-500 blur-3xl opacity-30 rounded-full animate-pulse"></div>
              
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-red-500 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <img 
                  src={result.prize.imageUrl} 
                  alt={result.prize.name} 
                  className="relative w-40 h-40 rounded-3xl object-cover border-4 border-amber-400" 
                />
              </div>
            </div>
            
            <h2 className="text-3xl font-black mb-2 gold-glow" style={{ color: theme.secondary }}>
              {result.prize.name}
            </h2>
            <p className="text-slate-300 font-medium max-w-xs mx-auto mb-8">
              Lộc xuân đã về! Chúc mừng bạn đã nhận được phần quà may mắn này.
            </p>
          </div>
        ) : (
          <div className="py-10">
            <div className="text-6xl mb-4">🏮</div>
            <p className="text-slate-300 text-lg mb-8 font-medium">{result.message}</p>
          </div>
        )}
        
        <button 
          onClick={onClose}
          className="w-full py-4 px-8 rounded-2xl font-bold text-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-2xl"
          style={{ 
            backgroundColor: theme.buttonBg,
            color: theme.buttonText,
            boxShadow: `0 10px 20px -5px ${theme.secondary}44`
          }}
        >
          {result.prize ? 'NHẬN LỘC NGAY' : 'THỬ LẠI LẦN SAU'}
        </button>
      </div>
    </Modal>
  );
};

export default PrizeModal;
