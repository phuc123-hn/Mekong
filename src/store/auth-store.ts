'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';

export interface User {
  userId?: string;
  id?: string;
  phone?: string;
  fullName?: string;
  role: 'FARMER' | 'GOVERNMENT';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
  login: (phone: string, password: string) => Promise<void>;
  register: (data: { phone: string; password: string; role: 'FARMER' | 'GOVERNMENT'; fullName: string }) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setUser: (user: User) => set({ user, isAuthenticated: true }),

      setToken: (token: string) => {
        set({ token });
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', token);
        }
      },

      setAuth: (token: string, user: User) => {
        set({ token, user, isAuthenticated: true, error: null });
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false, error: null });
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/auth';
        }
      },

      // ✅ LOGIN: GỌI API THẬT TẠI ĐÂY
      login: async (phone: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          console.log('🔐 Logging in with phone:', phone);
          
          const response = await api.post('/auth/login', { 
            phone, 
            password 
          });
          
          const { token, user } = response.data;
          
          console.log('✅ Login successful:', user);

          // Lưu vào state
          set({ 
            token, 
            user, 
            isAuthenticated: true, 
            isLoading: false,
            error: null
          });

          // Lưu token vào localStorage (để axios interceptor dùng)
          if (typeof window !== 'undefined') {
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
          }
          
        } catch (err: any) {
          const errorMessage = err.response?.data?.message || err.message || 'Đăng nhập thất bại';
          console.error('❌ Login failed:', errorMessage);
          
          set({ 
            error: errorMessage, 
            isLoading: false,
            isAuthenticated: false,
            user: null,
            token: null
          });
          
          throw new Error(errorMessage);
        }
      },

      // ✅ REGISTER: GỌI API THẬT
      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          console.log('📝 Registering with phone:', data.phone);
          
          const response = await api.post('/auth/register', {
            phone: data.phone,
            password: data.password,
            fullName: data.fullName,
            role: data.role,
          });
          
          const { token, user } = response.data;
          
          console.log('✅ Register successful:', user);

          set({ 
            token, 
            user, 
            isAuthenticated: true, 
            isLoading: false,
            error: null
          });

          if (typeof window !== 'undefined') {
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
          }
          
        } catch (err: any) {
          const errorMessage = err.response?.data?.message || err.message || 'Đăng ký thất bại';
          console.error('❌ Register failed:', errorMessage);
          
          set({ 
            error: errorMessage, 
            isLoading: false
          });
          
          throw new Error(errorMessage);
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
