'use client';

import { useAuthStore } from '@/store/auth-store';
import { useAppUIStore } from '@/store/app-ui-store';
import { ThemeToggle } from './ThemeToggle';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { appLang, appTheme } = useAppUIStore();
  const pathname = usePathname();

  if (!user) return null;

  // Xác định title dựa trên route
  const getPageTitle = () => {
    if (pathname === '/dashboard') return '📊 Tổng quan';
    if (pathname === '/dashboard/map') return '🗺️ Bản đồ Rủi ro';
    if (pathname === '/dashboard/stress-map') return '🗺️ Bản đồ Stress';
    if (pathname === '/dashboard/inbox') return '📬 Hộp thư';
    if (pathname === '/dashboard/observations') return '📍 Khoa Học Công Dân';
    if (pathname === '/dashboard/knowledge') return '📚 Kiến thức';
    if (pathname === '/dashboard/contact') return '📞 Liên hệ';
    return '🌊 DELTA STRESS';
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900/80 backdrop-blur border-b border-white/5 sticky top-0 z-50"
    >
      <div className="px-6 py-3 flex items-center justify-between">
        {/* Left: Logo + Title */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent hover:opacity-80 transition">
            🌊 Delta Stress Lens
          </Link>
          <div className="hidden md:block text-sm text-slate-400">
            {getPageTitle()}
          </div>
        </div>

        {/* Center: Nav Links (only for authenticated users) */}
        <div className="hidden lg:flex gap-6">
          {user.role === 'FARMER' ? (
            <>
              <Link href="/dashboard" className="text-sm text-slate-400 hover:text-cyan-400 transition">
                Tổng quan
              </Link>
              <Link href="/dashboard/stress-map" className="text-sm text-slate-400 hover:text-cyan-400 transition">
                Bản đồ
              </Link>
              <Link href="/dashboard/observations" className="text-sm text-slate-400 hover:text-cyan-400 transition">
                Báo cáo
              </Link>
              <Link href="/dashboard/knowledge" className="text-sm text-slate-400 hover:text-cyan-400 transition">
                Kiến thức
              </Link>
              <Link href="/dashboard/inbox" className="text-sm text-slate-400 hover:text-cyan-400 transition">
                Tin nhắn
              </Link>
            </>
          ) : (
            <>
              <Link href="/dashboard" className="text-sm text-slate-400 hover:text-cyan-400 transition">
                Tổng quan
              </Link>
              <Link href="/gov/input" className="text-sm text-slate-400 hover:text-cyan-400 transition">
                Nhập liệu
              </Link>
              <Link href="/gov/inbox" className="text-sm text-slate-400 hover:text-cyan-400 transition">
                Báo cáo
              </Link>
            </>
          )}
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Info & Logout */}
          <div className="flex items-center gap-3 pl-4 border-l border-white/5">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-slate-400">
                {user.role === 'FARMER' ? '🌾 Nông dân' : '🏛️ Chính phủ'}
              </p>
              <p className="text-xs text-cyan-400 truncate font-medium">{user.phone}</p>
            </div>
            <button
              onClick={logout}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
