'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

const CitizenScienceMap = dynamic(() => import('@/components/citizen-science-map').then(m => m.CitizenScienceMap), {
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-slate-900">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400">Đang tải bản đồ báo cáo...</p>
      </div>
    </div>
  ),
  ssr: false
});

export default function ObservationsPage() {
  return (
    <div className="h-full flex flex-col bg-slate-950 relative">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 left-4 z-40 bg-slate-900/90 backdrop-blur-sm p-4 rounded-xl border border-white/10"
      >
        <h1 className="text-lg font-bold text-white flex items-center gap-2">
          📍 Khoa Học Công Dân
        </h1>
        <p className="text-xs text-slate-400 mt-1">Báo cáo hiện trường & ghim lên bản đồ cộng đồng</p>
      </motion.div>

      {/* Map Component */}
      <CitizenScienceMap />

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0"
      >
        <div className="text-center text-slate-500 text-sm">
          <p>👇 Bấm nút <span className="text-cyan-400 font-bold">(+)</span> để báo cáo</p>
        </div>
      </motion.div>
    </div>
  );
}
