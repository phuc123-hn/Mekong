"use client";

import React, { useState, useMemo } from "react";
import { Layers, Activity, AlertTriangle, Droplets, Flame, Download, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLayerStore } from "@/store/layer-store";
import html2canvas from "html2canvas";
import { debounce } from "lodash-es";

export default function Sidebar() {
  // ✅ CHANGE: Use selectors instead of destructuring whole state
  const activeLayers = useLayerStore((state) => state.activeLayers);
  const toggleLayer = useLayerStore((state) => state.toggleLayer);
  const opacity = useLayerStore((state) => state.opacity);
  const setOpacity = useLayerStore((state) => state.setOpacity);
  const amplifyFactor = useLayerStore((state) => state.amplifyFactor);
  const setAmplify = useLayerStore((state) => state.setAmplify);

  // ✅ CHANGE: Create debounced versions (memoize to prevent recreation)
  const debouncedSetOpacity = useMemo(() => debounce(setOpacity, 150), [setOpacity]);
  const debouncedSetAmplify = useMemo(() => debounce(setAmplify, 150), [setAmplify]);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const canvas = await html2canvas(document.body, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#020617",
      });

      const link = document.createElement("a");
      link.download = `delta-stress-lens-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Export failed:", err);
      alert("Failed to export view.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-4 p-4 overflow-y-auto custom-scrollbar pointer-events-none">
      {/* Header Panel */}
      <div className="glass-panel p-6 rounded-xl pointer-events-auto shadow-2xl shadow-black/50 flex justify-between items-start flex-shrink-0">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Delta <span className="text-delta-500">Stress Lens</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">Compound Risk Analytics</p>
        </div>

        <button
          onClick={handleExport}
          disabled={isExporting}
          aria-label="Export Map View as PNG"
          className="p-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg transition-colors disabled:opacity-50"
          title="Export PNG"
        >
          {isExporting ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
        </button>
      </div>

      {/* Controls Panel */}
      <div className="glass-panel flex-1 rounded-xl p-5 pointer-events-auto overflow-y-auto space-y-8 custom-scrollbar">
        {/* Layer Toggles */}
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Layers size={12} /> Data Layers
          </h3>
          <div className="space-y-2">
            <LayerItem
              icon={<Droplets size={18} />}
              label="Salinity Intrusion"
              active={activeLayers.salinity}
              onClick={() => toggleLayer("salinity")}
              color="text-blue-400"
            />
            <LayerItem
              icon={<Flame size={18} />}
              label="Heat Stress"
              active={activeLayers.heat}
              onClick={() => toggleLayer("heat")}
              color="text-orange-400"
            />
            <LayerItem
              icon={<Activity size={18} />}
              label="Flood Risk"
              active={activeLayers.flood}
              onClick={() => toggleLayer("flood")}
              color="text-cyan-400"
            />
            <LayerItem
              icon={<AlertTriangle size={18} />}
              label="Pollution"
              active={activeLayers.pollution}
              onClick={() => toggleLayer("pollution")}
              color="text-purple-400"
            />
          </div>
        </div>

        {/* Global Adjustment Sliders */}
        <div className="space-y-6 border-t border-delta-800 pt-6">
          {/* Opacity Slider */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs font-semibold text-slate-400">Layer Opacity</label>
              <span className="text-xs text-delta-400 font-mono">{(opacity * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={opacity}
              onChange={(e) => debouncedSetOpacity(parseFloat(e.target.value))}
              aria-label="Adjust layer opacity"
              className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-delta-500"
            />
          </div>

          {/* Amplify Factor Slider */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs font-semibold text-slate-400">Amplify Factor</label>
              <span className="text-xs text-delta-400 font-mono">x{amplifyFactor.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={amplifyFactor}
              onChange={(e) => debouncedSetAmplify(parseFloat(e.target.value))}
              aria-label="Adjust risk amplification factor"
              className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
            <p className="text-[10px] text-slate-500 mt-2">*Simulates increased severity for compound events.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function LayerItem({ icon, label, active, onClick, color }: any) {
  return (
    <div
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
      tabIndex={0}
      role="checkbox"
      aria-checked={active}
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 border select-none group focus:outline-none focus:ring-2 focus:ring-delta-500/50",
        active
          ? "bg-delta-950/50 border-delta-500/30 shadow-[0_0_15px_-3px_rgba(6,182,212,0.2)]"
          : "bg-transparent border-transparent hover:bg-white/5"
      )}
    >
      <div
        className={cn(
          "transition-colors duration-300",
          active ? color : "text-slate-600 group-hover:text-slate-400"
        )}
      >
        {icon}
      </div>
      <span
        className={cn(
          "text-sm font-medium transition-colors",
          active ? "text-slate-100" : "text-slate-500 group-hover:text-slate-300"
        )}
      >
        {label}
      </span>
      {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-delta-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />}
    </div>
  );
}
