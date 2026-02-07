'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TimelineSliderProps {
  onDayChange?: (day: number) => void;
  maxDays?: number;
}

export function TimelineSlider({ onDayChange, maxDays = 7 }: TimelineSliderProps) {
  const [day, setDay] = useState(0);

  const handleChange = useCallback((newDay: number) => {
    setDay(newDay);
    onDayChange?.(newDay);
  }, [onDayChange]);

  const getDateLabel = (d: number): string => {
    const date = new Date();
    date.setDate(date.getDate() + d);
    if (d === 0) return 'Hôm nay';
    if (d === 1) return 'Ngày mai';
    return date.toLocaleDateString('vi-VN', { month: 'numeric', day: 'numeric' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 to-slate-900/80 border-t border-white/10 p-6 backdrop-blur-sm z-40"
    >
      <div className="max-w-4xl mx-auto">
        {/* Label Row */}
        <div className="flex justify-between items-center mb-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">📅 Dự báo 7 ngày</div>
          <div className="text-white font-bold text-lg">
            {day === 0 ? '🔵 Hiện tại' : `📍 +${day} ngày`}
          </div>
        </div>

        {/* Slider Container */}
        <div className="flex items-center gap-4">
          {/* Left Arrow */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleChange(Math.max(0, day - 1))}
            disabled={day === 0}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft size={20} className="text-white" />
          </motion.button>

          {/* Slider */}
          <div className="flex-1">
            <input
              type="range"
              min="0"
              max={maxDays}
              step="1"
              value={day}
              onChange={(e) => handleChange(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400 transition"
              style={{
                background: `linear-gradient(to right, rgb(6, 182, 212) 0%, rgb(6, 182, 212) ${
                  (day / maxDays) * 100
                }%, rgb(51, 65, 85) ${(day / maxDays) * 100}%, rgb(51, 65, 85) 100%)`
              }}
            />
          </div>

          {/* Right Arrow */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleChange(Math.min(maxDays, day + 1))}
            disabled={day === maxDays}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            <ChevronRight size={20} className="text-white" />
          </motion.button>
        </div>

        {/* Day Labels */}
        <div className="flex justify-between text-xs text-slate-500 mt-3 px-2">
          {Array.from({ length: maxDays + 1 }).map((_, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.1 }}
              onClick={() => handleChange(i)}
              className={`font-bold transition ${
                day === i ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-400'
              }`}
            >
              {i === 0 ? '0' : `+${i}`}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
