
import React from 'react';
import { ThemeConfig } from '../types';

interface EventHeaderProps {
  theme: ThemeConfig;
}

const EventHeader: React.FC<EventHeaderProps> = ({ theme }) => {
  return (
    <header className="relative w-full pt-12 md:pt-20 pb-10 px-6 text-center overflow-visible z-10 flex flex-col items-center">
      {/* Year of the Horse Decorative Motif - Artistic and visible but secondary */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.12] pointer-events-none select-none overflow-visible w-full max-w-3xl z-0">
        <svg viewBox="0 0 200 200" className="w-full h-auto text-amber-500">
          <path fill="currentColor" d="M140,40 C140,40 120,30 100,30 C80,30 70,40 70,60 C70,80 85,90 90,110 C95,130 80,160 80,160 L120,160 C120,160 115,130 110,110 C105,90 140,80 140,60 C140,40 140,40 140,40 Z" />
          <path fill="currentColor" d="M60,80 C60,80 40,90 30,110 C20,130 30,150 30,150 L50,150 C50,150 45,130 50,115 C55,100 70,95 70,95 Z" />
          <path fill="currentColor" d="M140,80 C140,80 160,90 170,110 C180,130 170,150 170,150 L150,150 C150,150 155,130 150,115 C145,100 130,95 130,95 Z" />
        </svg>
      </div>

      {/* Side Decorations - Lanterns tucked to the far sides to avoid overlap */}
      {theme.id === 'tet' && (
        <>
          <div className="absolute top-4 left-4 lg:left-12 lantern hidden md:block z-0 pointer-events-none">
             <svg width="60" height="120" viewBox="0 0 60 120" className="opacity-80">
               <rect x="28" y="0" width="4" height="20" fill="#F59E0B" />
               <ellipse cx="30" cy="50" rx="25" ry="30" fill="#B91C1C" stroke="#F59E0B" strokeWidth="2" />
               <path d="M10 50 Q30 30 50 50 Q30 70 10 50" fill="none" stroke="#F59E0B" strokeWidth="1" opacity="0.3" />
               <rect x="25" y="80" width="10" height="30" fill="#F59E0B" />
             </svg>
          </div>
          <div className="absolute top-4 right-4 lg:right-12 lantern hidden md:block z-0 pointer-events-none">
             <svg width="60" height="120" viewBox="0 0 60 120" className="opacity-80">
               <rect x="28" y="0" width="4" height="20" fill="#F59E0B" />
               <ellipse cx="30" cy="50" rx="25" ry="30" fill="#B91C1C" stroke="#F59E0B" strokeWidth="2" />
               <path d="M10 50 Q30 30 50 50 Q30 70 10 50" fill="none" stroke="#F59E0B" strokeWidth="1" opacity="0.3" />
               <rect x="25" y="80" width="10" height="30" fill="#F59E0B" />
             </svg>
          </div>
        </>
      )}

      {/* Main Title Content - High Contrast and Clear Separation */}
      <div className="relative z-20 max-w-screen-md mx-auto pointer-events-none px-4">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black font-festive tracking-tighter gold-glow mb-6 leading-[1.1]" style={{ color: theme.secondary }}>
          {theme.headerTitle}
        </h1>
        <p className="text-lg md:text-2xl font-semibold tracking-wide opacity-95 animate-float drop-shadow-lg max-w-lg mx-auto" style={{ color: theme.accent }}>
          {theme.headerSubtitle}
        </p>
        
        {/* Year of the Horse Visual Break */}
        <div className="mt-8 flex justify-center items-center space-x-6">
          <div className="h-0.5 w-12 md:w-32 bg-gradient-to-r from-transparent via-amber-500/50 to-amber-500"></div>
          <div className="flex flex-col items-center">
            <span className="text-amber-500 text-6xl animate-pulse">🐎</span>
            <span className="text-[10px] text-amber-500/70 font-bold tracking-[0.4em] mt-1">BÍNH NGỌ 2026</span>
          </div>
          <div className="h-0.5 w-12 md:w-32 bg-gradient-to-l from-transparent via-amber-500/50 to-amber-500"></div>
        </div>
      </div>
    </header>
  );
};

export default EventHeader;
