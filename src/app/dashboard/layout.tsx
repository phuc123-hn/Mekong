'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import { NavigationSidebar } from '@/components/navigation-sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated) {
      router.push('/auth/page');
    }
  }, [isAuthenticated, router]);

  if (!mounted || !isAuthenticated || !user) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="animate-spin text-cyan-500" size={40} />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-slate-950 overflow-hidden">
      {/* 1. Navigation Sidebar - Role-based Menu */}
      <NavigationSidebar userRole={user.role} />

      {/* 2. Main Content Area: Navbar + Content */}
      <div className="flex-1 flex flex-col relative">
        <Navbar />
        
        <main className="flex-1 relative overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

