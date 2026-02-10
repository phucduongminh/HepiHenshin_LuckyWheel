
import React, { useState, useRef, useMemo } from 'react';
import { Prize, SpinResult, ThemeConfig } from '../types';
import { prizeService } from '../services/prizeService';
import SpinButton from './SpinButton';

interface LuckyWheelProps {
  prizes: Prize[];
  onSpinComplete: (result: SpinResult) => void;
  theme: ThemeConfig;
}

const LuckyWheel: React.FC<LuckyWheelProps> = ({ prizes, onSpinComplete, theme }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  const handleSpin = async () => {
    if (isSpinning) return;

    const result = await prizeService.spin('user_tet_2026', 'local_dev');
    
    if (result.error === 'LIMIT_REACHED') {
      alert(result.message);
      return;
    }

    setIsSpinning(true);
    setRotation(result.rotationDegrees);

    setTimeout(() => {
      setIsSpinning(false);
      onSpinComplete(result);
    }, 5000); 
  };

  const segmentCount = prizes.length;
  const segmentAngle = 360 / segmentCount;

  const slices = useMemo(() => {
    return prizes.map((prize, i) => {
      const startAngle = i * segmentAngle;
      const endAngle = (i + 1) * segmentAngle;
      
      const x1 = 50 + 50 * Math.cos((Math.PI * (startAngle - 90)) / 180);
      const y1 = 50 + 50 * Math.sin((Math.PI * (startAngle - 90)) / 180);
      const x2 = 50 + 50 * Math.cos((Math.PI * (endAngle - 90)) / 180);
      const y2 = 50 + 50 * Math.sin((Math.PI * (endAngle - 90)) / 180);
      const largeArcFlag = segmentAngle > 180 ? 1 : 0;

      const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
      const color = theme.wheelColors[i % theme.wheelColors.length];

      return (
        <g key={prize.id} className="transition-opacity hover:opacity-90">
          <path 
            d={pathData} 
            fill={color} 
            stroke="rgba(255,255,255,0.15)" 
            strokeWidth="0.5" 
          />
          <path d={pathData} fill="url(#sliceGradient)" opacity="0.12" />
          <g transform={`rotate(${startAngle + segmentAngle/2}, 50, 50)`}>
            <text 
              x="50" y="14" 
              fill={i % theme.wheelColors.length === 0 ? theme.accent : 'white'} 
              fontSize="3.2" 
              fontWeight="900"
              textAnchor="middle"
              className="select-none pointer-events-none drop-shadow-sm font-heading"
            >
              {prize.name.length > 20 ? prize.name.substring(0, 17) + '...' : prize.name}
            </text>
            <circle cx="50" cy="6" r="1.1" fill="white" opacity="0.4" />
          </g>
        </g>
      );
    });
  }, [prizes, segmentAngle, theme]);

  return (
    <div className="relative w-full max-w-[500px] flex justify-center items-center">
      {/* Outer container to enforce square aspect and perfectly contain decorative elements */}
      <div className="relative aspect-square w-full">
        
        {/* Outer Decorative Rim - Using percentage based offsets to prevent mobile overflow */}
        <div className="absolute inset-[-4%] rounded-full border-[10px] md:border-[20px] border-[#1a0404] wheel-shadow z-0 shadow-2xl">
           {/* Perimeter "LED" Lights - Precisely Centered */}
           {[...Array(24)].map((_, i) => (
             <div 
               key={i} 
               className="absolute w-1.5 h-1.5 md:w-2.5 md:h-2.5 rounded-full"
               style={{ 
                 backgroundColor: i % 2 === 0 ? theme.secondary : '#FFF',
                 transform: `rotate(${i * (360/24)}deg) translateY(-48.5%)`,
                 boxShadow: `0 0 12px ${i % 2 === 0 ? theme.secondary : '#FFF'}`,
                 top: '50%',
                 left: '50%',
                 marginLeft: '-0.75px',
                 marginTop: '-0.75px',
                 transformOrigin: 'center'
               }}
             />
           ))}
        </div>
        
        {/* Pointer - Top Center of the wheel */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[45%] z-50 transition-transform origin-bottom ${isSpinning ? 'pointer-active' : ''}`}>
          <svg width="50" height="60" md-width="70" md-height="85" viewBox="0 0 60 70" className="w-[50px] md:w-[70px]">
            <defs>
              <filter id="pointerShadow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="2.5" />
                <feOffset dx="0" dy="3" />
                <feComponentTransfer><feFuncA type="linear" slope="0.6"/></feComponentTransfer>
                <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            <path d="M30 70 L5 5 L55 5 Z" fill={theme.pointerColor} filter="url(#pointerShadow)" />
            <circle cx="30" cy="22" r="9" fill="white" opacity="0.45" />
          </svg>
        </div>

        {/* Wheel Body - Absolutely Centered and Perfectly Circular */}
        <div 
          ref={wheelRef}
          className="absolute inset-0 rounded-full overflow-hidden transition-transform duration-[5000ms] cubic-bezier(0.15, 0, 0.1, 1) z-10 border-4 border-[#F59E0B]/30 bg-[#300a0a]"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full pointer-events-none">
            <defs>
               <radialGradient id="sliceGradient" cx="50%" cy="50%" r="50%">
                 <stop offset="0%" stopColor="white" />
                 <stop offset="100%" stopColor="black" />
               </radialGradient>
            </defs>
            {slices}
          </svg>
        </div>

        {/* Center Spin Button - Centered using grid for absolute stability */}
        <div className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none">
           <div className="pointer-events-auto">
             <SpinButton onClick={handleSpin} isSpinning={isSpinning} theme={theme} />
           </div>
        </div>
      </div>
    </div>
  );
};

export default LuckyWheel;
