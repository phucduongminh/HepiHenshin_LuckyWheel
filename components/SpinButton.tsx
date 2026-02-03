
import React from 'react';
import { ThemeConfig } from '../types';

interface SpinButtonProps {
  onClick: () => void;
  isSpinning: boolean;
  theme: ThemeConfig;
}

const SpinButton: React.FC<SpinButtonProps> = ({ onClick, isSpinning, theme }) => {
  return (
    <div className="relative z-40 group">
      {/* Glowing Ring */}
      <div className={`absolute -inset-4 rounded-full blur-xl opacity-40 transition-opacity duration-500 ${isSpinning ? 'animate-pulse' : 'group-hover:opacity-70'}`}
           style={{ backgroundColor: theme.secondary }}></div>
      
      <button 
        onClick={onClick}
        disabled={isSpinning}
        className={`relative w-28 h-28 rounded-full font-black text-2xl transition-all transform flex items-center justify-center shadow-2xl border-4 ${
          isSpinning 
          ? 'scale-90 cursor-not-allowed opacity-90' 
          : 'hover:scale-105 active:scale-95'
        }`}
        style={{ 
          backgroundColor: isSpinning ? '#450A0A' : theme.buttonBg,
          color: theme.buttonText,
          borderColor: theme.accent
        }}
      >
        <div className="flex flex-col items-center">
          <span className="tracking-tighter">{isSpinning ? 'WAIT' : 'QUAY'}</span>
          {!isSpinning && <span className="text-[10px] opacity-70">NGAY!</span>}
        </div>
      </button>
    </div>
  );
};

export default SpinButton;
