'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'vi' | 'en';
export type Theme = 'light' | 'dark';

export interface SidebarUIState {
  // Sidebar Language
  sidebarLang: Language;
  setSidebarLang: (lang: Language) => void;
  
  // Sidebar Theme
  sidebarTheme: Theme;
  toggleSidebarTheme: () => void;
  setSidebarTheme: (theme: Theme) => void;
}

export const useSidebarUIStore = create<SidebarUIState>()(
  persist(
    (set, get) => ({
      sidebarLang: 'vi',
      setSidebarLang: (lang: Language) => {
        set({ sidebarLang: lang });
      },

      sidebarTheme: 'dark',
      toggleSidebarTheme: () => {
        const current = get().sidebarTheme;
        const newTheme: Theme = current === 'dark' ? 'light' : 'dark';
        set({ sidebarTheme: newTheme });
      },
      setSidebarTheme: (theme: Theme) => {
        set({ sidebarTheme: theme });
      },
    }),
    {
      name: 'sidebar-ui-store',
    }
  )
);
