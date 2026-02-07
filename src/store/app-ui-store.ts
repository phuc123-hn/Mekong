'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'vi' | 'en';
export type Theme = 'light' | 'dark';

export interface AppUIState {
  // App Language (Top bar + Main content)
  appLang: Language;
  setAppLang: (lang: Language) => void;
  
  // App Theme (Top bar + Main content)
  appTheme: Theme;
  toggleAppTheme: () => void;
  setAppTheme: (theme: Theme) => void;
}

export const useAppUIStore = create<AppUIState>()(
  persist(
    (set, get) => ({
      appLang: 'vi',
      setAppLang: (lang: Language) => {
        set({ appLang: lang });
      },

      appTheme: 'dark',
      toggleAppTheme: () => {
        const current = get().appTheme;
        const newTheme: Theme = current === 'dark' ? 'light' : 'dark';
        set({ appTheme: newTheme });
        
        // Update next-themes untuk HTML element
        if (typeof document !== 'undefined') {
          if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      },
      setAppTheme: (theme: Theme) => {
        set({ appTheme: theme });
        if (typeof document !== 'undefined') {
          if (theme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      },
    }),
    {
      name: 'app-ui-store',
    }
  )
);
