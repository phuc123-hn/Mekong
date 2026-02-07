'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useSidebarUIStore } from '@/store/sidebar-ui-store';
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  MessageSquare, 
  BookOpen, 
  Database, 
  Users, 
  LogOut,
  Moon,
  Sun,
} from 'lucide-react';

// Định nghĩa menu theo role
const MENU_ITEMS = [
  {
    role: 'FARMER',
    items: [
      { icon: LayoutDashboard, label: 'Tổng quan', href: '/dashboard' },
      { icon: MapIcon, label: 'Bản đồ Stress', href: '/dashboard/stress-map' },
      { icon: MessageSquare, label: 'Hộp thư', href: '/dashboard/inbox' },
      { icon: BookOpen, label: 'Kiến thức', href: '/dashboard/knowledge' },
    ]
  },
  {
    role: 'GOVERNMENT',
    items: [
      { icon: LayoutDashboard, label: 'Tổng quan', href: '/dashboard' },
      { icon: Database, label: 'Nhập liệu', href: '/gov/input' },
      { icon: MessageSquare, label: 'Tin nhắn', href: '/dashboard/inbox' },
      { icon: Users, label: 'Quản lý', href: '/gov/users' },
    ]
  }
];

interface NavigationSidebarProps {
  userRole?: 'FARMER' | 'GOVERNMENT';
}

export function NavigationSidebar({ userRole = 'FARMER' }: NavigationSidebarProps) {
  const pathname = usePathname();
  const { sidebarTheme, toggleSidebarTheme } = useSidebarUIStore();

  // Lấy menu theo role
  const currentMenu = MENU_ITEMS.find(m => m.role === userRole)?.items || [];

  const toggleTheme = () => {
    toggleSidebarTheme();
  };

  return (
    <aside className="flex flex-col h-screen w-64 bg-card border-r border-border p-4 text-card-foreground shadow-lg">
      {/* Logo Area */}
      <div className="mb-8 px-2 flex items-center gap-2 font-bold text-lg text-primary">
        <MapIcon className="w-7 h-7" />
        <span>Mekong</span>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 space-y-1">
        {currentMenu.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200",
                "text-sm font-medium",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Divider */}
      <div className="border-t border-border my-4" />

      {/* Footer Actions */}
      <div className="space-y-2">
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className={cn(
            "flex w-full items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200",
            "text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          )}
          title={sidebarTheme === 'dark' ? 'Chế độ sáng' : 'Chế độ tối'}
        >
          {sidebarTheme === 'dark' ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
          <span>
            {sidebarTheme === 'dark' ? 'Sáng' : 'Tối'}
          </span>
        </button>

        {/* Logout */}
        <button 
          className={cn(
            "flex w-full items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200",
            "text-sm font-medium text-destructive hover:bg-destructive/10",
            "mt-2"
          )}
        >
          <LogOut className="w-5 h-5" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
}
