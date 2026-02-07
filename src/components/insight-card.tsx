'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface InsightCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  impact: string;
  status: 'low' | 'medium' | 'high';
  delay?: number;
}

const statusConfig = {
  low: {
    borderColor: 'border-green-500/30',
    bgColor: 'bg-green-500/5',
    badgeColor: 'bg-green-500/10 text-green-300',
    badge: '✓ Bình thường',
  },
  medium: {
    borderColor: 'border-yellow-500/30',
    bgColor: 'bg-yellow-500/5',
    badgeColor: 'bg-yellow-500/10 text-yellow-300',
    badge: '⚠️ Cảnh báo',
  },
  high: {
    borderColor: 'border-red-500/30',
    bgColor: 'bg-red-500/5',
    badgeColor: 'bg-red-500/10 text-red-300',
    badge: '🚨 Nguy hiểm',
  },
};

export function InsightCard({
  icon,
  title,
  description,
  impact,
  status,
  delay = 0,
}: InsightCardProps) {
  const config = statusConfig[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
      className={`
        relative p-6 rounded-xl border transition-all duration-300
        ${config.borderColor} ${config.bgColor}
        backdrop-blur-sm hover:shadow-xl cursor-pointer
        group
      `}
    >
      {/* Icon + Title */}
      <div className="flex items-start gap-3 mb-3">
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="text-3xl flex-shrink-0 mt-1"
        >
          {icon}
        </motion.div>
        <div>
          <h3 className="text-lg font-bold text-slate-100">{title}</h3>
          <span className={`inline-block text-xs font-medium rounded-full px-2 py-1 mt-1 ${config.badgeColor}`}>
            {config.badge}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-300 mb-4 leading-relaxed">
        {description}
      </p>

      {/* Impact */}
      <div className="pt-3 border-t border-slate-700/50">
        <p className="text-xs text-slate-400 mb-1 font-medium uppercase tracking-wide">
          Tác động chính:
        </p>
        <p className="text-sm text-cyan-300 font-medium">{impact}</p>
      </div>

      {/* Gradient Accent */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-cyan-500/10 to-transparent rounded-full -z-10" />
    </motion.div>
  );
}
