
import { ThemeConfig } from './types';

export const THEMES: Record<string, ThemeConfig> = {
  tet: {
    id: 'tet',
    name: 'Tết Nguyên Đán',
    primary: '#B91C1C', // red-700
    secondary: '#F59E0B', // amber-500 (Gold)
    accent: '#FEF3C7', // amber-100
    bgClass: 'theme-tet',
    headerTitle: 'VÒNG QUAY MAY MẮN',
    headerSubtitle: 'Khai Xuân Phú Quý - Tài Lộc Quá Lớn Cùng HepiHenshin',
    wheelColors: ['#B91C1C', '#F59E0B'], // Alternating Red & Gold
    pointerColor: '#FBBF24',
    buttonBg: '#F59E0B',
    buttonText: '#7F1D1D',
  },
  summer: {
    id: 'summer',
    name: 'Summer Vibes',
    primary: '#0EA5E9',
    secondary: '#FACC15',
    accent: '#F0F9FF',
    bgClass: 'bg-sky-500',
    headerTitle: 'SUMMER SPIN',
    headerSubtitle: 'Cool Down with Amazing Rewards',
    wheelColors: ['#0EA5E9', '#FACC15'],
    pointerColor: '#F43F5E',
    buttonBg: '#FACC15',
    buttonText: '#0C4A6E',
  },
  blackFriday: {
    id: 'black-friday',
    name: 'Black Friday',
    primary: '#111827',
    secondary: '#D1D5DB',
    accent: '#6366F1',
    bgClass: 'bg-black',
    headerTitle: 'BLACK FRIDAY WHEEL',
    headerSubtitle: 'Exclusive Deals Just One Spin Away',
    wheelColors: ['#111827', '#6366F1'],
    pointerColor: '#FFFFFF',
    buttonBg: '#6366F1',
    buttonText: '#FFFFFF',
  }
};
