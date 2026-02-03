
import { Prize, SpinRecord, SpinResult, UserStats } from '../types';
import { calculateWeightedWinner } from '../utils/random';

// Initial Mock Data
const INITIAL_PRIZES: Prize[] = [
  { id: '1', name: 'iPhone 15 Pro', imageUrl: 'https://picsum.photos/100/100?random=1', remainingQuantity: 1, winProbability: 0.01, isActive: true, color: '#6366f1' },
  { id: '2', name: 'Amazon $50 Gift Card', imageUrl: 'https://picsum.photos/100/100?random=2', remainingQuantity: 10, winProbability: 2.0, isActive: true, color: '#f59e0b' },
  { id: '3', name: 'Premium Hoodie', imageUrl: 'https://picsum.photos/100/100?random=3', remainingQuantity: 50, winProbability: 5.0, isActive: true, color: '#ec4899' },
  { id: '4', name: 'Discount Voucher 10%', imageUrl: 'https://picsum.photos/100/100?random=4', remainingQuantity: 1000, winProbability: 15.0, isActive: true, color: '#10b981' },
  { id: '5', name: 'Free Stickers', imageUrl: 'https://picsum.photos/100/100?random=5', remainingQuantity: 500, winProbability: 25.0, isActive: true, color: '#3b82f6' },
  { id: '6', name: 'Try Again Next Time', imageUrl: 'https://picsum.photos/100/100?random=6', remainingQuantity: 999999, winProbability: 52.99, isActive: true, color: '#64748b' },
];

class PrizeService {
  private prizes: Prize[] = [];
  private history: SpinRecord[] = [];
  private stats: Record<string, UserStats> = {};

  constructor() {
    const savedPrizes = localStorage.getItem('lucky_wheel_prizes');
    const savedHistory = localStorage.getItem('lucky_wheel_history');
    this.prizes = savedPrizes ? JSON.parse(savedPrizes) : INITIAL_PRIZES;
    this.history = savedHistory ? JSON.parse(savedHistory) : [];
  }

  private persist() {
    localStorage.setItem('lucky_wheel_prizes', JSON.stringify(this.prizes));
    localStorage.setItem('lucky_wheel_history', JSON.stringify(this.history));
  }

  getPrizes(): Prize[] {
    return [...this.prizes];
  }

  updatePrize(prize: Prize) {
    const index = this.prizes.findIndex(p => p.id === prize.id);
    if (index !== -1) {
      this.prizes[index] = prize;
    } else {
      this.prizes.push(prize);
    }
    this.persist();
  }

  deletePrize(id: string) {
    this.prizes = this.prizes.filter(p => p.id !== id);
    this.persist();
  }

  getSpinHistory(): SpinRecord[] {
    return [...this.history].reverse();
  }

  // CORE SPIN LOGIC (Simulating Server-Side)
  async spin(userId: string, ip: string): Promise<SpinResult> {
    // 1. Rate Limiting Check (Mock)
    const today = new Date().toDateString();
    const userSpinsToday = this.history.filter(h => h.userId === userId && new Date(h.timestamp).toDateString() === today).length;
    
    if (userSpinsToday >= 3) {
      return { success: false, message: "Daily limit reached (3 spins/day).", rotationDegrees: 0, error: 'LIMIT_REACHED' };
    }

    // 2. Probability Selection
    const winner = calculateWeightedWinner(this.prizes);

    // 3. Atomically Update Quantity
    if (winner) {
      const prizeIdx = this.prizes.findIndex(p => p.id === winner.id);
      if (this.prizes[prizeIdx].remainingQuantity > 0) {
        this.prizes[prizeIdx].remainingQuantity -= 1;
      } else {
        // Edge case: out of stock right as we picked it
        return this.spin(userId, ip); // Recalculate
      }
    }

    // 4. Record History
    const record: SpinRecord = {
      id: Math.random().toString(36).substr(2, 9),
      prizeId: winner ? winner.id : null,
      prizeName: winner ? winner.name : 'No Prize',
      timestamp: Date.now(),
      ip: ip,
      userId: userId
    };
    this.history.push(record);
    this.persist();

    // 5. Calculate Rotation for Frontend Animation
    // We want the wheel to stop at the segment representing the winner.
    // If winner is null, we point to the "Try Again" segment or just random.
    // For this demo, let's assume the segments are in order.
    const segmentCount = this.prizes.length;
    const winnerIdx = winner ? this.prizes.findIndex(p => p.id === winner.id) : this.prizes.findIndex(p => p.name.includes('Try Again'));
    
    const segmentAngle = 360 / segmentCount;
    // We want the pointer (top middle, 0 deg) to land on the winner segment.
    // Winning segment is at index I.
    // Segment I spans from (I * segmentAngle) to ((I+1) * segmentAngle).
    // Center of segment I is at (I + 0.5) * segmentAngle.
    // The wheel rotates CLOCKWISE. So to bring segment I to the top (0 deg):
    // Rotation = 360 - (center of segment)
    const extraSpins = 5 + Math.floor(Math.random() * 5); // 5-10 full rotations
    const targetAngle = 360 - (winnerIdx * segmentAngle + segmentAngle / 2);
    const finalRotation = (extraSpins * 360) + targetAngle;

    return {
      success: true,
      prize: winner,
      message: winner ? `Congratulations! You won ${winner.name}!` : "Better luck next time!",
      rotationDegrees: finalRotation
    };
  }
}

export const prizeService = new PrizeService();
