import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeType = 'day' | 'night';

interface ThemeState {
  theme: ThemeType;
  isAutoTheme: boolean;
  setTheme: (theme: ThemeType) => void;
  setAutoTheme: (isAuto: boolean) => void;
  autoSetTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'night',
      isAutoTheme: true, // Varsayılan olarak saate göre değişsin
      setTheme: (theme) => set({ theme, isAutoTheme: false }), // Kullanıcı elle seçerse otoyu kapat
      setAutoTheme: (isAuto) => set({ isAutoTheme: isAuto }),
      autoSetTheme: () => {
        if (!get().isAutoTheme) return; // Kullanıcı otoyu kapattıysa karışma
        const hour = new Date().getHours();
        const isDay = hour >= 7 && hour < 18;
        set({ theme: isDay ? 'day' : 'night' });
      }
    }),
    {
      name: 'wobbi-theme-storage', // AsyncStorage içindeki anahtar
      storage: createJSONStorage(() => AsyncStorage), 
    }
  )
);
