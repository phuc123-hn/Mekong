"use client";

import React from "react";
import { motion } from "framer-motion";

export default function Legend() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.8 }}
      className="fixed bottom-8 right-4 z-20 pointer-events-none hidden sm:block"
    >
      <div className="glass-panel p-4 rounded-lg pointer-events-auto space-y-2 border border-white/10 shadow-2xl">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
          Compound Risk Index
        </h4>

        {/* Gradient Bar */}
        <div className="relative h-3 w-48 rounded-full bg-gradient-to-r from-[#10b981] via-[#f59e0b] to-[#ef4444] mb-1 shadow-inner">
          <div className="absolute left-[25%] top-0 bottom-0 w-px bg-black/20 mix-blend-overlay"></div>
          <div className="absolute left-[50%] top-0 bottom-0 w-px bg-black/20 mix-blend-overlay"></div>
          <div className="absolute left-[75%] top-0 bottom-0 w-px bg-black/20 mix-blend-overlay"></div>
        </div>

        {/* Labels */}
        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
          <span>0.0</span>
          <span>0.5</span>
          <span>1.0</span>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-4 gap-1 text-[9px] font-bold text-center mt-2 tracking-tight">
          <span className="text-emerald-500">LOW</span>
          <span className="text-yellow-500">MODERATE</span>
          <span className="text-orange-500">HIGH</span>
          <span className="text-red-500">EXTREME</span>
        </div>
      </div>
    </motion.div>
  );
}
