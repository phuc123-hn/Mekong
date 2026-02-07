'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, TrendingUp, Clock } from 'lucide-react';
import { MEKONG_GEOJSON } from '@/data/mock-geo';
import { calculateCompoundIndex } from '@/lib/stress-calc';

export function OperationalTable() {
  const [data, setData] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState<'score' | 'name'>('score');

  useEffect(() => {
    // Tính toán dữ liệu từ mock
    const activeLayers = { salinity: true, heat: true, flood: true, pollution: true };
    const amplifyFactor = 1.0;

    const provinceData = MEKONG_GEOJSON.features.map((feature) => {
      const props = feature.properties;
      const result = calculateCompoundIndex(props, activeLayers, amplifyFactor);
      return {
        id: props.id,
        name: props.name,
        score: result.score,
        risk_level: result.risk_level,
        salinity: props.salinity,
        heat: props.heat,
        flood: props.flood,
        pollution: props.pollution,
      };
    });

    // Sắp xếp
    if (sortBy === 'score') {
      provinceData.sort((a, b) => b.score - a.score);
    } else {
      provinceData.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
    }

    setData(provinceData);
  }, [sortBy]);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'extreme': return { bg: 'bg-red-500/20', border: 'border-red-500/50', text: 'text-red-400', badge: 'bg-red-500' };
      case 'high': return { bg: 'bg-orange-500/20', border: 'border-orange-500/50', text: 'text-orange-400', badge: 'bg-orange-500' };
      case 'moderate': return { bg: 'bg-yellow-500/20', border: 'border-yellow-500/50', text: 'text-yellow-400', badge: 'bg-yellow-500' };
      default: return { bg: 'bg-green-500/20', border: 'border-green-500/50', text: 'text-green-400', badge: 'bg-green-500' };
    }
  };

  const getActionText = (level: string) => {
    switch (level) {
      case 'extreme': return '🚨 Hành động ngay';
      case 'high': return '⚡ Theo dõi sát';
      case 'moderate': return '👀 Cảnh báo';
      default: return '✅ Bình thường';
    }
  };

  return (
    <div className="h-full overflow-y-auto flex flex-col bg-slate-950 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <TrendingUp className="text-cyan-400" /> Bảng Rủi ro Tỉnh
          </h2>
          <p className="text-slate-400 text-sm mt-1">Cập nhật lúc: <Clock className="inline w-4 h-4" /> {new Date().toLocaleTimeString('vi-VN')}</p>
        </div>

        {/* Sort Buttons */}
        <div className="flex gap-2 bg-slate-900 p-1 rounded-lg border border-white/10">
          <button
            onClick={() => setSortBy('score')}
            className={`px-4 py-2 rounded text-sm font-bold transition ${
              sortBy === 'score' 
                ? 'bg-cyan-600 text-white' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Rủi ro cao
          </button>
          <button
            onClick={() => setSortBy('name')}
            className={`px-4 py-2 rounded text-sm font-bold transition ${
              sortBy === 'name' 
                ? 'bg-cyan-600 text-white' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Theo tên
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto rounded-xl border border-white/10 bg-slate-900/50 backdrop-blur-sm">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-slate-800/80 border-b border-white/10">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase">Tỉnh</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase">Chỉ số tổng hợp</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase">Mặn</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase">Nhiệt</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase">Lũ</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase">Ô nhiễm</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase">Khuyến nghị</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.map((row, i) => {
              const colors = getRiskColor(row.risk_level);
              return (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`hover:bg-white/5 transition group ${colors.bg} border-l-4 ${colors.border.replace('border-', 'border-l-')}`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${colors.badge}`}>
                        {row.name.substring(0, 1)}
                      </div>
                      <span className="font-bold text-white">{row.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${row.score * 100}%` }}
                          transition={{ duration: 0.8, type: 'spring' }}
                          className={`h-full ${colors.badge}`}
                        />
                      </div>
                      <span className={`font-bold ${colors.text}`}>{(row.score * 100).toFixed(0)}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="inline-block px-2 py-1 rounded bg-blue-500/20 text-blue-300 text-xs font-bold">
                      {(row.salinity * 100).toFixed(0)}%
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="inline-block px-2 py-1 rounded bg-orange-500/20 text-orange-300 text-xs font-bold">
                      {(row.heat * 100).toFixed(0)}%
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="inline-block px-2 py-1 rounded bg-purple-500/20 text-purple-300 text-xs font-bold">
                      {(row.flood * 100).toFixed(0)}%
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="inline-block px-2 py-1 rounded bg-green-500/20 text-green-300 text-xs font-bold">
                      {(row.pollution * 100).toFixed(0)}%
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${colors.text} bg-white/5 border-white/10 group-hover:bg-white/10 transition`}>
                      {getActionText(row.risk_level)}
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="mt-4 text-xs text-slate-500 flex gap-4">
        <div>📊 Tổng cộng: {data.length} tỉnh</div>
        <div>🔴 Nguy hiểm: {data.filter(d => d.risk_level === 'extreme').length}</div>
        <div>🟠 Cao: {data.filter(d => d.risk_level === 'high').length}</div>
      </div>
    </div>
  );
}
