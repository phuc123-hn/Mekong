'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export function ScrollProgressBar() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);

  // Chỉ hiển thị ở landing page (/)
  const shouldShow = pathname === '/';

  useEffect(() => {
    if (!shouldShow) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [shouldShow]);

  if (!shouldShow) return null;

  return (
    <div
      className="fixed top-0 left-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 z-50 transition-all duration-300 ease-out"
      style={{
        width: `${progress}%`,
        opacity: 0.75,
      }}
      aria-hidden="true"
    />
  );
}
