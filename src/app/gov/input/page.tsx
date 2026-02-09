'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuthStore } from '@/store/auth-store';
import { motion } from 'framer-motion';

const PROVINCES = [
  { id: 'CT', name: 'Cần Thơ' },
  { id: 'AG', name: 'An Giang' },
  { id: 'CM', name: 'Cà Mau' },
  { id: 'TV', name: 'Tiền Giang' },
  { id: 'BT', name: 'Bến Tre' },
];

export default function DataInputPage() {
  const { token } = useAuthStore();
  const [formData, setFormData] = useState({
    province_id: '',
    salinity_level: 0,
    heat_index: 0,
    flood_depth: 0,
    pollution_index: 0,
  });
  const [forecast, setForecast] = useState({
    time_horizon: 'SHORT',
    phenomenon: 'RAIN',
    risk_level: 'LOW',
    details: {},
  });
  const [notification, setNotification] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdateData = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.province_id) {
      setNotification('⚠️ Please select a province');
      return;
    }
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/data/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setNotification('✅ Risk data updated successfully!');
        setTimeout(() => setNotification(''), 3000);
      } else {
        throw new Error('Failed to update');
      }
    } catch (err) {
      setNotification('❌ Failed to update data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBroadcastAlert = async () => {
    if (!forecast.phenomenon) return;
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/forecasts/broadcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify(forecast)
      });

      if (res.ok) {
        setNotification(`🚨 Alert broadcasted: ${forecast.phenomenon}`);
        setTimeout(() => setNotification(''), 3000);
      } else {
        throw new Error('Failed to broadcast');
      }
    } catch (err) {
      setNotification('❌ Failed to broadcast alert');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute requiredRole="GOVERNMENT">
      <div className="min-h-screen bg-gray-900 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold mb-2 text-neon-cyan">📊 Data Input & Forecasting</h1>
            <p className="text-gray-400">Update environmental data and broadcast weather alerts to farmers</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {/* LEFT: RISK DATA INPUT */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-800 p-6 rounded-lg border border-neon-cyan/30"
            >
              <h2 className="text-xl font-bold mb-6 text-neon-cyan">📍 Update Risk Data</h2>

              <form onSubmit={handleUpdateData} className="space-y-4">
                {/* Province Select */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-300">Province *</label>
                  <select
                    value={formData.province_id}
                    onChange={(e) => setFormData({...formData, province_id: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:border-neon-cyan focus:outline-none transition"
                    required
                  >
                    <option value="">Select province...</option>
                    {PROVINCES.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                {/* Sliders */}
                {[
                  { key: 'salinity_level', label: 'Salinity Level', icon: '🧂' },
                  { key: 'heat_index', label: 'Heat Index', icon: '🌡️' },
                  { key: 'flood_depth', label: 'Flood Depth (mm)', icon: '💧' },
                  { key: 'pollution_index', label: 'Pollution Index', icon: '💨' }
                ].map(({ key, label, icon }) => (
                  <div key={key}>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-semibold text-gray-300">{icon} {label}</label>
                      <span className="text-neon-purple font-bold">{formData[key as keyof typeof formData]}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={formData[key as keyof typeof formData]}
                      onChange={(e) => setFormData({...formData, [key]: parseFloat(e.target.value)})}
                      className="w-full accent-neon-purple cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Low</span>
                      <span>High</span>
                    </div>
                  </div>
                ))}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-neon-cyan hover:bg-cyan-400 disabled:bg-gray-600 text-black font-bold py-3 rounded transition mt-6"
                >
                  {loading ? '⏳ Updating...' : '💾 Update Risk Data'}
                </button>
              </form>
            </motion.div>

            {/* RIGHT: FORECAST & ALERTS */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-800 p-6 rounded-lg border border-neon-purple/30"
            >
              <h2 className="text-xl font-bold mb-6 text-neon-purple">🚨 Broadcast Alert</h2>

              <div className="space-y-4">
                {/* Time Horizon */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-300">Time Horizon</label>
                  <select
                    value={forecast.time_horizon}
                    onChange={(e) => setForecast({...forecast, time_horizon: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:border-neon-purple focus:outline-none transition"
                  >
                    <option value="ULTRA_SHORT">⚡ Ultra-Short (0-6h)</option>
                    <option value="SHORT">☁️ Short-Term (0-3d)</option>
                    <option value="MEDIUM">📈 Medium-Term (3-10d)</option>
                    <option value="LONG">📊 Long-Term (10-30d)</option>
                  </select>
                </div>

                {/* Phenomenon */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-300">Weather Phenomenon</label>
                  <select
                    value={forecast.phenomenon}
                    onChange={(e) => setForecast({...forecast, phenomenon: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:border-neon-purple focus:outline-none transition"
                  >
                    <option value="RAIN">🌧️ Heavy Rain</option>
                    <option value="STORM">⛈️ Storm / Tropical Depression</option>
                    <option value="MONSOON">🌀 Northeast Monsoon</option>
                    <option value="POLLUTION">💨 Pollution Event</option>
                    <option value="OTHER">❓ Other</option>
                  </select>
                </div>

                {/* Risk Level */}
                <div>
                  <label className="block text-sm font-semibold mb-3 text-gray-300">Risk Level</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { level: 'LOW', color: 'bg-green-600', emoji: '🟢' },
                      { level: 'MEDIUM', color: 'bg-yellow-600', emoji: '🟡' },
                      { level: 'HIGH', color: 'bg-orange-600', emoji: '🟠' },
                      { level: 'CRITICAL', color: 'bg-red-600', emoji: '🔴' }
                    ].map(({ level, color, emoji }) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setForecast({...forecast, risk_level: level})}
                        className={`py-2 rounded text-sm font-bold transition ${
                          forecast.risk_level === level
                            ? `${color} text-white shadow-lg scale-105`
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {emoji} {level}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Broadcast Button */}
                <button
                  type="button"
                  onClick={handleBroadcastAlert}
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-bold py-4 rounded transition uppercase tracking-wider text-lg mt-6"
                >
                  🚨 BROADCAST ALERT TO ALL FARMERS
                </button>
              </div>

              {/* Info Box */}
              <div className="mt-6 p-3 bg-gray-900 border border-yellow-600/30 rounded text-xs text-yellow-500">
                ⚠️ <span className="font-semibold">Important:</span> Alerts will be sent to all connected farmers in real-time. Use responsibly.
              </div>
            </motion.div>
          </div>

          {/* Notification Toast */}
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="fixed top-4 right-4 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg max-w-xs"
            >
              {notification}
            </motion.div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
