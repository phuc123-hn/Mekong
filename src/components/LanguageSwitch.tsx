'use client';

import { useAppUIStore } from '@/store/app-ui-store';

export function LanguageSwitch() {
  const { appLang, setAppLang } = useAppUIStore();

  return (
    <div className="flex gap-1 bg-slate-700/50 rounded-lg p-1">
      <button
        onClick={() => setAppLang('vi')}
        className={`px-3 py-1 rounded text-sm font-medium transition-all ${
          appLang === 'vi'
            ? 'bg-cyan-500/80 text-white'
            : 'text-slate-300 hover:text-slate-100'
        }`}
        title="Tiếng Việt"
      >
        VN
      </button>
      <button
        onClick={() => setAppLang('en')}
        className={`px-3 py-1 rounded text-sm font-medium transition-all ${
          appLang === 'en'
            ? 'bg-cyan-500/80 text-white'
            : 'text-slate-300 hover:text-slate-100'
        }`}
        title="English"
      >
        EN
      </button>
    </div>
  );
}
