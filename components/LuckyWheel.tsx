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

  // ✅ GUARD QUAN TRỌNG
  if (!prizes || prizes.length === 0) {
    return (
      <div className="w-full h-[360px] flex items-center justify-center text-slate-400">
        Chưa có dữ liệu vòng quay
      </div>
    );
  }

  const handleSpin = async () => {
    if (isSpinning) return;

    try {
      const result = await prizeService.spin('user_tet_2026', 'local_dev');

      if ((result as any).error === 'LIMIT_REACHED') {
        alert((result as any).message);
        return;
      }

      setIsSpinning(true);
      setRotation(result.rotationDegrees);

      setTimeout(() => {
        setIsSpinning(false);
        onSpinComplete(result);
      }, 5000);
    } catch {
      alert('Spin failed, please try again');
    }
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

      const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;
      const color = theme.wheelColors[i % theme.wheelColors.length];

      return (
        <g key={prize.id}>
          <path d={pathData} fill={color} />
          <g transform={`rotate(${startAngle + segmentAngle / 2}, 50, 50)`}>
            <text
              x="50"
              y="14"
              fill="white"
              fontSize="3"
              fontWeight="700"
              textAnchor="middle"
            >
              {prize.name}
            </text>
          </g>
        </g>
      );
    });
  }, [prizes, segmentAngle, theme]);

  return (
    <div className="relative w-full max-w-[500px]">
      <div
        ref={wheelRef}
        className="aspect-square rounded-full overflow-hidden transition-transform duration-[5000ms]"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {slices}
        </svg>
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <SpinButton onClick={handleSpin} isSpinning={isSpinning} theme={theme} />
      </div>
    </div>
  );
};

export default LuckyWheel;