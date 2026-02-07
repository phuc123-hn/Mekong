"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useLayerStore } from "@/store/layer-store";
import { cn } from "@/lib/utils";

export default function DetailPanel() {
  const selectedProvince = useLayerStore((state) => state.selectedProvince);
  const setSelectedProvince = useLayerStore((state) => state.setSelectedProvince);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    console.log("📍 DetailPanel - selectedProvince changed:", selectedProvince);
  }, [selectedProvince]);

  const chartData = selectedProvince
    ? [
        { name: "Salinity", value: selectedProvince.salinity, color: "#22d3ee" },
        { name: "Heat", value: selectedProvince.heat, color: "#f97316" },
        { name: "Flood", value: selectedProvince.flood, color: "#06b6d4" },
        { name: "Pollution", value: selectedProvince.pollution, color: "#a855f7" },
      ]
    : [];

  const getRiskColor = (level: string = "low") => {
    switch (level) {
      case "extreme":
        return "bg-red-500/20 text-red-400 border-red-500/50";
      case "high":
        return "bg-orange-500/20 text-orange-400 border-orange-500/50";
      case "moderate":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      default:
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/50";
    }
  };

  const variants = isMobile
    ? {
        hidden: { y: "100%", opacity: 0 },
        visible: { y: 0, opacity: 1 },
        exit: { y: "100%", opacity: 0 },
      }
    : {
        hidden: { x: "100%", opacity: 0 },
        visible: { x: 0, opacity: 1 },
        exit: { x: "100%", opacity: 0 },
      };

  return (
    <AnimatePresence>
      {selectedProvince && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute md:right-4 md:top-4 md:bottom-4 md:w-96 left-0 right-0 bottom-0 h-[70vh] w-full rounded-t-2xl md:rounded-xl z-50 pointer-events-none flex flex-col"
        >
          <div className="glass-panel w-full h-full md:rounded-xl rounded-t-2xl flex flex-col pointer-events-auto overflow-hidden shadow-2xl shadow-black/80 border-l border-t border-white/10 pb-8 md:pb-0">
            {/* Mobile Drag Indicator */}
            <div className="md:hidden w-full flex justify-center pt-3 pb-1">
              <div className="w-12 h-1.5 bg-slate-600 rounded-full opacity-50"></div>
            </div>

            {/* Header */}
            <div className="p-6 border-b border-white/5 relative">
              <button
                onClick={() => setSelectedProvince(null)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-2xl font-bold text-white tracking-tight">{selectedProvince.name}</h2>
                <span
                  className={cn(
                    "px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider border rounded-full",
                    getRiskColor(selectedProvince.risk_level)
                  )}
                >
                  {selectedProvince.risk_level}
                </span>
              </div>

              <div className="flex items-end gap-2">
                <span className="text-4xl font-mono font-bold text-delta-400">
                  {selectedProvince.compound_index?.toFixed(2)}
                </span>
                <span className="text-sm text-slate-500 mb-1.5 font-medium">Compound Index</span>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              {/* Chart Section */}
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <TrendingUp size={14} /> Stress Breakdown
                </h3>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical" margin={{ left: -20 }}>
                      <XAxis type="number" domain={[0, 1]} hide />
                      <YAxis type="category" dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} width={70} />
                      <Tooltip
                        cursor={{ fill: "rgba(255,255,255,0.05)" }}
                        contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", color: "#f8fafc" }}
                      />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20} animationDuration={1000}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* AI Insight Section */}
              <div className="bg-gradient-to-br from-delta-900 to-slate-900 border border-delta-500/20 rounded-lg p-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-10">
                  <Sparkles size={48} />
                </div>

                <h3 className="text-xs font-bold text-delta-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Sparkles size={14} /> AI Analysis
                </h3>

                <p className="text-sm text-slate-300 leading-relaxed">
                  Compound stress đang ở mức <strong className="text-white">{selectedProvince.risk_level}</strong>. Yếu tố
                  đóng góp chính là <strong>Salinity ({selectedProvince.salinity})</strong> kết hợp với{" "}
                  <strong>Flood ({selectedProvince.flood})</strong>.
                </p>
                <div className="mt-3 pt-3 border-t border-white/5">
                  <p className="text-xs text-slate-400 italic">
                    &ldquo;Khuyến nghị: Cần theo dõi chặt chẽ xâm nhập mặn tại các cửa sông chính trong 2 tuần tới do hiệu ứng
                    khuếch đại (x1.15).&rdquo;
                  </p>
                </div>
              </div>

              {/* Metadata / Footer */}
              <div className="grid grid-cols-2 gap-4 text-xs text-slate-500 pb-10 md:pb-0">
                <div className="bg-white/5 p-3 rounded">
                  <span className="block mb-1">Station ID</span>
                  <code className="text-slate-300">{selectedProvince.id}-SEN2</code>
                </div>
                <div className="bg-white/5 p-3 rounded">
                  <span className="block mb-1">Last Updated</span>
                  <span className="text-slate-300">20 mins ago</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
