'use client';

import { useAppUIStore } from '@/store/app-ui-store';
import { useEffect } from 'react';

export function ThemeToggle() {
  const { appTheme, toggleAppTheme } = useAppUIStore();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', appTheme === 'dark');
  }, [appTheme]);

  return (
    <button
      onClick={toggleAppTheme}
      className="p-2 hover:bg-slate-700/50 rounded transition text-slate-300 hover:text-slate-100"
      title={`Chuyển sang chế độ ${appTheme === 'dark' ? 'sáng' : 'tối'}`}
    >
      {appTheme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}
