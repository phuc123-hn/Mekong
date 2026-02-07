'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export function ScrollHint() {
  return (
    <motion.div
      className="flex flex-col items-center gap-2 py-4"
      animate={{ y: [0, 8, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    >
      <p className="text-xs text-slate-500 font-medium tracking-widest uppercase">
        Cuộn để xem phân tích
      </p>
      <motion.div
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ChevronDown className="w-5 h-5 text-cyan-400" />
      </motion.div>
    </motion.div>
  );
}
