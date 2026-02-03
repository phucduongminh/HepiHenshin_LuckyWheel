
export interface Prize {
  id: string;
  name: string;
  imageUrl: string;
  remainingQuantity: number;
  winProbability: number;
  isActive: boolean;
  color?: string; // Optional because theme handles it
}

export interface ThemeConfig {
  id: string;
  name: string;
  primary: string;   // e.g. Red
  secondary: string; // e.g. Gold
  accent: string;    // Light Gold/White
  bgClass: string;
  headerTitle: string;
  headerSubtitle: string;
  wheelColors: string[];
  pointerColor: string;
  buttonBg: string;
  buttonText: string;
}

export interface SpinRecord {
  id: string;
  prizeId: string | null;
  prizeName: string;
  timestamp: number;
  ip: string;
  userId: string;
}

export interface SpinResult {
  success: boolean;
  prize?: Prize | null;
  message: string;
  rotationDegrees: number;
  error?: string;
}

export interface UserStats {
  spinsToday: number;
  totalSpins: number;
}
