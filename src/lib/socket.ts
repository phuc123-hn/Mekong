'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useAuthStore } from '@/store/auth-store';

export interface SocketEvents {
  'data_update': (data: any) => void;
  'forecast_alert': (alert: any) => void;
  'new_message': (message: any) => void;
  'message_replied': (data: any) => void;
}

class SocketManager {
  private socket: any = null;
  private listeners: Map<string, Set<Function>> = new Map();
  private isConnected = false;

  constructor(token?: string) {
    if (typeof window === 'undefined') return;

    // For development, use simple polling instead of Socket.io
    // In production, you would use: import { io } from 'socket.io-client'
    console.log('🔌 Socket client initialized (using polling mode)');
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);
  }

  off(event: string, callback: Function) {
    this.listeners.get(event)?.delete(callback);
  }

  emit(event: string, data: any) {
    this.listeners.get(event)?.forEach(callback => callback(data));
  }

  isConnectedStatus() {
    return this.isConnected;
  }
}

// Global socket instance
let socketInstance: SocketManager | null = null;

export function getSocketInstance(token?: string): SocketManager {
  if (!socketInstance) {
    socketInstance = new SocketManager(token);
  }
  return socketInstance;
}

export function useSocket(events: Partial<SocketEvents> = {}) {
  const { token } = useAuthStore();
  const socketRef = useRef<SocketManager | null>(null);

  useEffect(() => {
    if (!token) return;

    socketRef.current = getSocketInstance(token);
    const socket = socketRef.current;

    // Register event listeners
    Object.entries(events).forEach(([event, callback]) => {
      if (callback) {
        socket.on(event, callback);
      }
    });

    return () => {
      // Cleanup
      Object.keys(events).forEach(event => {
        socket.off(event, (events as any)[event]);
      });
    };
  }, [token, events]);

  return socketRef.current || getSocketInstance(token || '');
}

export function useRealtimeData() {
  const socket = useSocket({
    'data_update': (data: any) => {
      console.log('📊 Data updated:', data);
      // Trigger Zustand store update or refetch
    },
    'forecast_alert': (alert: any) => {
      console.log('⚠️ Forecast alert:', alert);
      // Show notification
    },
    'new_message': (message: any) => {
      console.log('📧 New message:', message);
      // Update inbox
    },
  });

  return socket;
}
