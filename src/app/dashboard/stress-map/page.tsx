'use client';

import dynamic from 'next/dynamic';
import { useState, Suspense } from 'react';
import { LayoutList, Map as MapIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { ActionableLegend } from '@/components/actionable-legend';
import { OperationalTable } from '@/components/operational-table';

const MapView = dynamic(() => import('@/components/map-view'), { 
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-slate-900">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400">Đang tải bản đồ...</p>
      </div>
    </div>
  ),
  ssr: false 
});

const DetailPanel = dynamic(() => import('@/components/detail-panel'), { ssr: false });

export default function StressMapPage() {
  const [viewMode, setViewMode] = useState<'map' | 'table'>('map');

  return (
    <div className="relative w-full h-full bg-slate-950">
      {/* Toggle Switch Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 left-4 z-50 flex bg-slate-900/90 backdrop-blur-sm p-1 rounded-lg border border-white/10 shadow-xl"
      >
        <button 
          onClick={() => setViewMode('map')}
          className={`px-4 py-2 rounded flex items-center gap-2 text-sm font-bold transition ${
            viewMode === 'map' 
              ? 'bg-cyan-600 text-white shadow-lg' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <MapIcon size={16} /> Bản đồ
        </button>
        <button 
          onClick={() => setViewMode('table')}
          className={`px-4 py-2 rounded flex items-center gap-2 text-sm font-bold transition ${
            viewMode === 'table' 
              ? 'bg-cyan-600 text-white shadow-lg' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <LayoutList size={16} /> Số liệu
        </button>
      </motion.div>

      {/* Main Content */}
      {viewMode === 'map' ? (
        // Map View
        <div className="relative w-full h-full">
          <Suspense fallback={<div className="bg-slate-800 animate-pulse h-full" />}>
            <MapView />
          </Suspense>

          {/* Actionable Legend */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute bottom-6 left-6 z-40 pointer-events-auto"
          >
            <ActionableLegend />
          </motion.div>

          {/* Detail Panel */}
          <div className="absolute top-0 right-0 h-full z-50 pointer-events-none">
            <div className="pointer-events-auto h-full">
              <DetailPanel />
            </div>
          </div>
        </div>
      ) : (
        // Table View
        <OperationalTable />
      )}
    </div>
  );
}
