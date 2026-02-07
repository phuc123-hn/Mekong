'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { CitizenScience, type FieldReport } from '@/components/citizen-science';
import { motion } from 'framer-motion';
import { TrendingUp, MessageSquare } from 'lucide-react';
import L from 'leaflet';

const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(m => m.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(m => m.Popup), { ssr: false });

const RISK_ICONS = {
  salinity: '💧',
  dead_crops: '🌾',
  flooding: '💦',
  pollution: '⚠️',
};

export function CitizenScienceMap() {
  const [reports, setReports] = useState<FieldReport[]>([]);

  const handleReportAdded = useCallback((report: FieldReport) => {
    setReports(prev => [report, ...prev]);
  }, []);

  const handleReportClick = (report: FieldReport) => {
    console.log('View report details:', report);
  };

  return (
    <div className="h-full relative bg-slate-950">
      {/* Map */}
      <MapContainer center={[10.0, 105.5]} zoom={8} className="h-full w-full">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap'
        />

        {/* Report Pins */}
        {reports.map((report) => (
          <Marker
            key={report.id}
            position={[report.latitude, report.longitude]}
            title={`${RISK_ICONS[report.type]} ${report.description || 'Báo cáo'}`}
          >
            <Popup>
              <div className="text-sm space-y-2">
                <div className="text-2xl">{RISK_ICONS[report.type]}</div>
                <p className="font-bold">{report.description || '(Không có mô tả)'}</p>
                <p className="text-xs text-slate-500">
                  {new Date(report.timestamp).toLocaleString('vi-VN')}
                </p>
                {report.image && (
                  <Image src={report.image} alt="Report" width={128} height={96} className="object-cover rounded" />
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Stats Panel */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 right-4 z-40 bg-slate-900/90 backdrop-blur-sm border border-white/10 rounded-xl p-4 shadow-xl"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-cyan-600 flex items-center justify-center">
            <MessageSquare className="text-white" size={18} />
          </div>
          <div>
            <p className="text-slate-400 text-xs uppercase font-bold">Báo cáo cộng đồng</p>
            <p className="text-2xl font-bold text-white">{reports.length}</p>
          </div>
        </div>
      </motion.div>

      {/* Info Panel */}
      {reports.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute bottom-6 right-6 z-40 bg-slate-900/90 backdrop-blur-sm border border-white/10 rounded-xl p-4 shadow-xl max-w-xs max-h-48 overflow-y-auto"
        >
          <h3 className="text-xs font-bold text-cyan-400 mb-3 uppercase">Báo cáo gần đây</h3>
          <div className="space-y-2">
            {reports.slice(0, 5).map((report) => (
              <motion.button
                key={report.id}
                whileHover={{ x: 4 }}
                onClick={() => handleReportClick(report)}
                className="w-full text-left p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition text-xs group"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{RISK_ICONS[report.type]}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white truncate">{report.description || '(Chưa có mô tả)'}</p>
                    <p className="text-slate-500 text-[10px]">
                      {new Date(report.timestamp).toLocaleTimeString('vi-VN')}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Citizen Science FAB */}
      <CitizenScience onReportAdded={handleReportAdded} />
    </div>
  );
}
