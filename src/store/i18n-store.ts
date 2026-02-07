'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'vi' | 'en';

const translations = {
  vi: {
    nav: {
      dashboard: 'Dashboard',
      stressMap: '🗺️ Bản đồ Ứng suất',
      inbox: '📬 Hộp thư',
      knowledge: 'Kiến thức',
      contact: 'Liên hệ',
      input: 'Nhập dữ liệu',
      logout: 'Đăng xuất',
    },
    auth: {
      title: 'DELTA STRESS',
      subtitle: 'Platform Phân tích Rủi ro Tổng hợp',
      login: 'Đăng nhập',
      register: 'Đăng ký',
      phone: 'Số điện thoại',
      password: 'Mật khẩu',
      fullName: 'Họ tên',
      accountType: 'Loại tài khoản',
      farmer: 'Nông dân',
      government: 'Chính phủ',
      demo: 'Demo: phone: 0909123456, password: 12345678',
    },
    pages: {
      stressMap: 'Bản đồ Ứng suất',
      inbox: 'Hộp thư',
      noMessages: 'Không có tin nhắn',
    },
  },
  en: {
    nav: {
      dashboard: 'Dashboard',
      stressMap: '🗺️ Stress Map',
      inbox: '📬 Inbox',
      knowledge: 'Knowledge',
      contact: 'Contact',
      input: 'Data Input',
      logout: 'Logout',
    },
    auth: {
      title: 'DELTA STRESS',
      subtitle: 'Compound Risk Analytics Platform',
      login: 'Login',
      register: 'Register',
      phone: 'Phone Number',
      password: 'Password',
      fullName: 'Full Name',
      accountType: 'Account Type',
      farmer: 'Farmer',
      government: 'Government',
      demo: 'Demo: phone: 0909123456, password: 12345678',
    },
    pages: {
      stressMap: 'Stress Map',
      inbox: 'Inbox',
      noMessages: 'No messages',
    },
  },
};

export interface I18nState {
  language: Language;
  t: (key: string) => string;
  setLanguage: (lang: Language) => void;
}

export const useI18nStore = create<I18nState>()(
  persist(
    (set, get) => ({
      language: 'vi',
      t: (key: string) => {
        const lang = get().language;
        const keys = key.split('.');
        let value: any = translations[lang];
        for (const k of keys) {
          value = value?.[k];
        }
        return value || key;
      },
      setLanguage: (lang: Language) => set({ language: lang }),
    }),
    {
      name: 'i18n-store',
    }
  )
);
