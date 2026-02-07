'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LanguageToggle() {
  const { i18n, t } = useTranslation(['common']);
  const [isOpen, setIsOpen] = React.useState(false);

  const currentLang = i18n.language || 'vi';
  const languages = [
    { code: 'vi', label: t('common:vietnamese'), flag: '🇻🇳' },
    { code: 'en', label: t('common:english'), flag: '🇺🇸' },
  ];

  const handleChangeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/30 hover:border-slate-600/60 transition-all text-sm text-slate-300 hover:text-slate-200"
        title={t('common:language')}
      >
        <Globe size={16} />
        <span className="flex-1 text-left">
          {languages.find(l => l.code === currentLang)?.flag} {languages.find(l => l.code === currentLang)?.code.toUpperCase()}
        </span>
        <span className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-lg overflow-hidden z-50 shadow-lg"
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleChangeLanguage(lang.code)}
              className={`w-full px-3 py-2 text-sm text-left transition-colors flex items-center gap-2 ${
                currentLang === lang.code
                  ? 'bg-cyan-600/20 text-cyan-300 border-l-2 border-l-cyan-400'
                  : 'text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
              {currentLang === lang.code && (
                <span className="ml-auto text-cyan-400">✓</span>
              )}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
}
