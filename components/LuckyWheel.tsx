import React, { useState, useRef, useMemo } from 'react';
import { Prize, SpinResult, ThemeConfig } from '../types';
import { prizeService } from '../services/prizeService';
import SpinButton from './SpinButton';
import { useGameAuth } from '@/hooks/useGameAuth';

interface LuckyWheelProps {
  prizes: Prize[];
  onSpinComplete: (result: SpinResult) => void;
  theme: ThemeConfig;
}

const LuckyWheel: React.FC<LuckyWheelProps> = ({ prizes, onSpinComplete, theme }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);
  const { user } = useGameAuth();

  // Số lượng ô cố định là 6 theo UI hiện tại của bạn
  const segmentCount = 6;
  const segmentAngle = 360 / segmentCount;

  // Giả lập danh sách ô (Sẽ map với data BE sau này)
  const demoSlices = useMemo(() => {
    return Array.from({ length: segmentCount }).map((_, i) => {
      const type = i % 2 === 0 ? 'POINT' : 'ITEM'; // 0, 2, 4 là POINT | 1, 3, 5 là ITEM
      return {
        id: i,
        type,
        label: type === 'POINT' ? 'Xu' : 'Vật Phẩm',
      };
    });
  }, [segmentCount]);

  const handleSpin = async () => {
    if (isSpinning) return;

    try {
      setIsSpinning(true);

      const result = await prizeService.spin(user.userId);

      if ((result as any).error === 'LIMIT_REACHED') {
        alert((result as any).message);
        setIsSpinning(false);
        return;
      }

      // --- LOGIC XỬ LÝ KHI PRIZE NULL ---
      let targetIndex = 1; // Mặc định dừng ở ô "Vật phẩm" (index 1) nếu hụt quà

      if (result && result.prize) {
        // Nếu có quà: Tìm index theo logic Point/Item
        const isPointPrize = result.prize.name.toLowerCase().includes('point');
        targetIndex = demoSlices.findIndex(slice => 
          isPointPrize ? slice.type === 'POINT' : slice.type === 'ITEM'
        );
      } else {
        // Nếu hụt quà (prize === null): Cho dừng đại vào một ô ITEM bất kỳ (ví dụ index 1, 3, hoặc 5)
        targetIndex = 1; 
        // Gán message "Chúc may mắn" nếu BE chưa trả về message
        if (!result.message) result.message = "Phần thưởng đã hết mất rồi. Chúc bạn may mắn lần sau nhé!";
      }
      // ----------------------------------

      requestAnimationFrame(() => {
        setRotation(prev => {
          const extraSpins = 360 * 8; 
          const baseRotation = prev - (prev % 360);
          // targetIndex đã được bảo vệ ở trên nên không lo undefined
          const stopAngle = extraSpins - (targetIndex * segmentAngle) - (segmentAngle / 2);
          return baseRotation + stopAngle;
        });
      });

      setTimeout(() => {
        setIsSpinning(false);
        onSpinComplete(result);
      }, 5000);

    } catch (error) {
      alert('Quay thất bại, bạn đã hết lượt quay, vui lòng thử lại sau!.');
      console.log('Spin error:', error);
      setIsSpinning(false);
    }
  };

  const slices = useMemo(() => {
    return demoSlices.map((slice, i) => {
      const startAngle = i * segmentAngle;
      const endAngle = (i + 1) * segmentAngle;

      // Tính toán tọa độ SVG cho từng lát cắt
      const x1 = 50 + 50 * Math.cos((Math.PI * (startAngle - 90)) / 180);
      const y1 = 50 + 50 * Math.sin((Math.PI * (startAngle - 90)) / 180);
      const x2 = 50 + 50 * Math.cos((Math.PI * (endAngle - 90)) / 180);
      const y2 = 50 + 50 * Math.sin((Math.PI * (endAngle - 90)) / 180);
      const largeArcFlag = segmentAngle > 180 ? 1 : 0;

      const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
      const color = i % 2 === 0 ? theme.wheelColors[0] : theme.wheelColors[1];

      return (
        <g key={slice.id} className="transition-opacity hover:opacity-90">
          <path 
            d={pathData} 
            fill={color} 
            stroke="rgba(255,255,255,0.15)" 
            strokeWidth="0.5" 
          />
          <path d={pathData} fill="url(#sliceGradient)" opacity="0.12" />
          <g transform={`rotate(${startAngle + segmentAngle / 2}, 50, 50)`}>
            <text 
              x="50" y="14" 
              fill={theme.wheelColors.length === 0 ? theme.accent : 'white'}
              fontSize="3.2" 
              fontWeight="900"
              textAnchor="middle"
              className="select-none pointer-events-none drop-shadow-sm font-heading"
            >
              {slice.label}
            </text>
            <circle cx="50" cy="6" r="1.1" fill="white" opacity="0.4" />
          </g>
        </g>
      );
    });
  }, [demoSlices, segmentAngle, theme]);

  return (
    <div className="relative w-full max-w-[500px] flex justify-center items-center">
      <div className="relative aspect-square w-full">
        
        {/* Outer Decorative Rim */}
        <div className="absolute inset-[-4%] rounded-full border-[10px] md:border-[20px] border-[#1a0404] wheel-shadow z-0 shadow-2xl">
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
        
        {/* Pointer (Kim chỉ - Cố định ở đỉnh 12h) */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[45%] z-50 transition-transform origin-bottom ${isSpinning ? 'pointer-active' : ''}`}>
          <svg width="50" height="60" viewBox="0 0 60 70" className="w-[50px] md:w-[70px]">
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

        {/* Wheel Body */}
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

        {/* Center Spin Button */}
        <div className="absolute inset-0 flex items-center justify-center z-40">
           <div className={`pointer-events-auto transform transition-transform active:scale-90 ${isSpinning ? 'scale-95 opacity-80' : 'hover:scale-105'}`}>
             <SpinButton onClick={handleSpin} isSpinning={isSpinning} theme={theme} />
           </div>
        </div>
      </div>
    </div>
  );
};

export default LuckyWheel;