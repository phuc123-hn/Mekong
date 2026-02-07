'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function ActionableLegend() {
  const items = [
    { 
      color: 'bg-red-500', 
      textColor: 'text-red-400',
      label: 'NGUY HIỂM (>0.8)', 
      action: '⚠️ Đóng cống, ngưng lấy nước',
      icon: '🚨'
    },
    { 
      color: 'bg-orange-500', 
      textColor: 'text-orange-400',
      label: 'CAO (0.6-0.8)', 
      action: '⏱️ Kiểm tra 2h/lần, sẵn sàng',
      icon: '⚡'
    },
    { 
      color: 'bg-yellow-500', 
      textColor: 'text-yellow-400',
      label: 'TRUNG BÌNH (0.4-0.6)', 
      action: '👀 Theo dõi hàng ngày',
      icon: '👁️'
    },
    { 
      color: 'bg-emerald-500', 
      textColor: 'text-emerald-400',
      label: 'AN TOÀN (<0.4)', 
      action: '✅ Sinh hoạt bình thường',
      icon: '✓'
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="bg-slate-900/95 backdrop-blur-sm p-5 rounded-xl border border-cyan-500/30 shadow-2xl w-80 pointer-events-auto"
    >
      <h3 className="text-xs font-bold text-cyan-400 uppercase mb-4 tracking-widest flex items-center gap-2">
        <span>📋</span> Khuyến nghị hành động
      </h3>
      
      <div className="space-y-3">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + i * 0.1 }}
            className="flex gap-3 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition border border-white/5 hover:border-white/10 group"
          >
            {/* Color Indicator */}
            <div className={`w-4 h-4 rounded-full ${item.color} mt-0.5 shrink-0 shadow-lg group-hover:scale-110 transition-transform`} />
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className={`text-xs font-bold ${item.textColor}`}>{item.label}</div>
              <div className="text-xs text-slate-300 mt-1 leading-snug">{item.action}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer Note */}
      <div className="mt-4 pt-3 border-t border-white/10 text-[10px] text-slate-500">
        <p>💡 Cập nhật chỉ số mỗi 30 phút</p>
      </div>
    </motion.div>
  );
}
