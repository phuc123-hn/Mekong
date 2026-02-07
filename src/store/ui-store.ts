'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UIState {
  theme: 'dark' | 'light';
  language: 'vi' | 'en';
  sidebarExpanded: boolean;
  toggleTheme: () => void;
  setLanguage: (lang: 'vi' | 'en') => void;
  toggleSidebar: () => void;
  setSidebarExpanded: (expanded: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'dark',
      language: 'vi',
      sidebarExpanded: false,

      toggleTheme: () => set(state => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),

      setLanguage: (lang: 'vi' | 'en') => set({ language: lang }),

      toggleSidebar: () => set(state => ({ sidebarExpanded: !state.sidebarExpanded })),

      setSidebarExpanded: (expanded: boolean) => set({ sidebarExpanded: expanded }),
    }),
    {
      name: 'ui-store',
      storage: 
        typeof window !== 'undefined' && typeof localStorage !== 'undefined'
          ? {
              getItem: (name: string) => {
                const item = localStorage.getItem(name);
                return item ? JSON.parse(item) : null;
              },
              setItem: (name: string, value: any) => {
                localStorage.setItem(name, JSON.stringify(value));
              },
              removeItem: (name: string) => {
                localStorage.removeItem(name);
              },
            }
          : undefined,
    }
  )
);
