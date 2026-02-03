
import { Prize } from '../types';

/**
 * Weighted Random Algorithm Explanation:
 * 
 * 1. Precision Handling: To avoid floating-point issues (e.g., 0.1 + 0.2 !== 0.3), 
 *    we multiply percentages by a large factor (1,000,000) to convert them to integers.
 * 
 * 2. Unbiased Selection: We map each item to a range proportional to its probability.
 *    Total range = 100 * Precision.
 *    If Prize A has 1%, it occupies a sub-range of 10,000 units.
 * 
 * 3. Selection Process: We pick a random integer within the total range. We then 
 *    iterate through candidate prizes. If the random number falls within a prize's 
 *    mapped range, that prize is selected.
 * 
 * 4. Fallback: If the total allocated probability is < 100%, the remainder of the 
 *    range defaults to "No Prize".
 */

const PRECISION_FACTOR = 1_000_000;
const TOTAL_PROBABILITY_RANGE = 100 * PRECISION_FACTOR;

export const calculateWeightedWinner = (prizes: Prize[]): Prize | null => {
  const activePrizes = prizes.filter(p => p.isActive && p.remainingQuantity > 0);
  
  // 1. Generate a random point in the 0 - 100% space
  const randomPoint = Math.floor(Math.random() * TOTAL_PROBABILITY_RANGE);
  
  let currentCumulative = 0;

  for (const prize of activePrizes) {
    // Convert float percentage to high-precision integer range
    const prizeRange = Math.round(prize.winProbability * PRECISION_FACTOR);
    const prizeEnd = currentCumulative + prizeRange;

    if (randomPoint >= currentCumulative && randomPoint < prizeEnd) {
      return prize;
    }
    
    currentCumulative = prizeEnd;
  }

  // If we reach here, either the random point fell into the "No Prize" gap 
  // or all items were skipped.
  return null;
};
