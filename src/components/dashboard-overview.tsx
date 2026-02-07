'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, AlertCircle, Map, Droplets, Activity, Send, BookOpen, Database, Mail, MapPin } from 'lucide-react';
import Link from 'next/link';
import { MEKONG_GEOJSON } from '@/data/mock-geo';
import { calculateCompoundIndex } from '@/lib/stress-calc';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/auth-store';
import { InsightsSection } from './insights-section';
import { ScrollHint } from './scroll-hint';

export default function DashboardOverview() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<any[]>([]);

  useEffect(() => {
    // 1. Tính toán thống kê từ mock data
    const activeLayers = { salinity: true, heat: true, flood: true, pollution: true };
    const amplifyFactor = 1.0;

    const provinceStats = MEKONG_GEOJSON.features.map((feature) => {
      const props = feature.properties;
      const result = calculateCompoundIndex(props, activeLayers, amplifyFactor);
      return {
        name: props.name,
        id: props.id,
        score: result.score,
        risk_level: result.risk_level,
      };
    });

    // 2. Sắp xếp: Rủi ro cao lên đầu
    provinceStats.sort((a, b) => b.score - a.score);
    setStats(provinceStats);
  }, []);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'extreme': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'high': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      case 'moderate': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      default: return 'text-green-400 bg-green-500/10 border-green-500/20';
    }
  };

  return (
    <div className="p-6 md:p-8 pb-20 overflow-y-auto min-h-screen bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Xin chào, {user?.fullName || 'Bạn'} 👋</h1>
          <p className="text-slate-400">
            Bạn đang xem giao diện dành cho: <span className="text-cyan-400 font-bold">{user?.role === 'FARMER' ? 'Nông dân' : 'Chính quyền'}</span>
          </p>
        </div>

        {/* 1. Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Map, label: 'Tỉnh giám sát', value: '3', color: 'from-blue-500 to-cyan-500' },
            { icon: AlertCircle, label: 'Cảnh báo cao', value: stats.filter(s => s.risk_level === 'high' || s.risk_level === 'extreme').length, color: 'from-red-500 to-orange-500' },
            { icon: TrendingUp, label: 'Rủi ro TB', value: stats.length > 0 ? ((stats.reduce((sum, s) => sum + s.score, 0) / stats.length) * 100).toFixed(0) + '%' : '0%', color: 'from-purple-500 to-pink-500' },
            { icon: Droplets, label: 'Chỉ số đo', value: '4', color: 'from-green-500 to-emerald-500' },
          ].map((stat, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-900 border border-white/5 shadow-lg relative overflow-hidden group">
              <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition duration-500`}>
                <stat.icon className="w-16 h-16" />
              </div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">{stat.label}</p>
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.color} p-2 shadow-lg`}>
                  <stat.icon className="w-full h-full text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold text-white mt-2">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* SCROLL HINT - Dẫn hướng cuộn */}
        <div className="flex justify-center">
          <ScrollHint />
        </div>

        {/* INSIGHTS SECTION - Giải thích 4 chỉ số */}
        <InsightsSection />

        {/* Main Content Split */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* 2. Provinces Risk Table (Chiếm 2/3) */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Activity className="text-cyan-500" /> Bảng xếp hạng rủi ro
            </h2>
            <div className="rounded-xl bg-slate-900 border border-white/5 overflow-hidden shadow-lg">
              <div className="divide-y divide-white/5">
                {stats.length === 0 ? (
                  <div className="p-8 text-center text-slate-500">Đang tải dữ liệu...</div>
                ) : (
                  stats.map((province) => (
                    <div key={province.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition group cursor-default">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold group-hover:text-white group-hover:bg-cyan-600 transition">
                          {province.name.substring(0, 1)}
                        </div>
                        <div>
                          <p className="font-medium text-white">{province.name}</p>
                          <div className="h-1.5 w-24 bg-slate-800 rounded-full mt-1 overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${province.score * 100}%` }}
                              className="h-full bg-cyan-500" 
                            />
                          </div>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getRiskColor(province.risk_level)}`}>
                        {province.risk_level.toUpperCase()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* 3. Role-Based Navigation (Chiếm 1/3) */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              🚀 Truy cập nhanh
            </h2>
            
            <div className="grid gap-3">
              {/* Menu điều hướng dựa trên Role */}
              {user?.role === 'FARMER' ? (
                <>
                  <NavCard
                    title="Bản đồ Ứng suất"
                    icon={<Map className="w-6 h-6" />}
                    href="/dashboard/map"
                    description="Xem rủi ro môi trường & dự báo"
                    color="border-cyan-500/30 hover:bg-cyan-950/20"
                  />
                  <NavCard
                    title="Khoa Học Công Dân"
                    icon={<MapPin className="w-6 h-6" />}
                    href="/dashboard/observations"
                    description="Báo cáo hiện trường, chụp ảnh"
                    color="border-yellow-500/30 hover:bg-yellow-950/20"
                  />
                  <NavCard
                    title="Hộp thư & Cảnh báo"
                    icon={<Mail className="w-6 h-6" />}
                    href="/dashboard/inbox"
                    description="Nhận tin nhắn từ chuyên gia"
                    color="border-blue-500/30 hover:bg-blue-950/20"
                  />
                  <NavCard
                    title="Kiến thức nhà nông"
                    icon={<BookOpen className="w-6 h-6" />}
                    href="/dashboard/knowledge"
                    description="Kỹ thuật canh tác bền vững"
                    color="border-purple-500/30 hover:bg-purple-950/20"
                  />
                </>
              ) : (
                <>
                  <NavCard
                    title="Nhập dữ liệu Môi trường"
                    icon={<Database className="w-6 h-6" />}
                    href="/gov/input"
                    description="Cập nhật chỉ số salinity, flood..."
                    color="border-green-500/30 hover:bg-green-950/20"
                  />
                  <NavCard
                    title="Quản lý tin nhắn"
                    icon={<Send className="w-6 h-6" />}
                    href="/gov/inbox"
                    description="Gửi cảnh báo đến nông dân"
                    color="border-orange-500/30 hover:bg-orange-950/20"
                  />
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// --- Component phụ (Đã hợp nhất thành 1 phiên bản duy nhất) ---
function NavCard({ title, icon, href, description, color }: any) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.02, x: 5 }}
        whileTap={{ scale: 0.98 }}
        className={`p-4 rounded-xl bg-slate-900 border ${color || 'border-white/10'} transition cursor-pointer flex items-center gap-4 group h-full shadow-md hover:shadow-cyan-500/10`}
      >
        <div className="p-3 rounded-lg bg-slate-800 text-slate-200 group-hover:bg-slate-700 group-hover:text-white transition">
          {icon}
        </div>
        <div>
          <h3 className="font-bold text-white group-hover:text-cyan-400 transition">{title}</h3>
          <p className="text-xs text-slate-400">{description}</p>
        </div>
      </motion.div>
    </Link>
  );
}
