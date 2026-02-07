import Link from "next/link";
import { ArrowRight, ShieldAlert, Activity, Droplets, Wind, Zap, Eye } from "lucide-react";
import { FadeInUp, HoverCard, HorizontalScroll } from "@/components/animations";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-cyan-500 selection:text-white overflow-x-hidden">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10 backdrop-blur-md sticky top-0 z-50 bg-slate-950/80">
        <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          🌊 Delta Stress Lens
        </div>
        <div className="flex gap-4">
          <Link href="/auth" className="px-4 py-2 text-sm font-medium hover:text-cyan-400 transition">
            Đăng nhập
          </Link>
          <Link 
            href="/dashboard" 
            className="px-5 py-2 text-sm font-bold bg-cyan-600 hover:bg-cyan-500 rounded-full transition flex items-center gap-2"
          >
            Vào Dashboard <ArrowRight size={16} />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center text-center px-4 pt-32 pb-20">
        <FadeInUp>
          <div className="mb-6 px-3 py-1 inline-block rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-medium uppercase tracking-wider">
            Giải pháp giám sát môi trường thông minh
          </div>
        </FadeInUp>

        <FadeInUp delay={0.2}>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl mx-auto">
            Thấu kính rủi ro cho <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-green-400 to-blue-600">
              Đồng Bằng Sông Cửu Long
            </span>
          </h1>
        </FadeInUp>

        <FadeInUp delay={0.3}>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
            Hệ thống cảnh báo sớm tích hợp dữ liệu đa tầng: Mặn, Nhiệt, Lũ và Ô nhiễm.
            Giúp nông dân và nhà quản lý đưa ra quyết định chính xác trước biến đổi khí hậu.
          </p>
        </FadeInUp>
        
        <FadeInUp delay={0.4}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard" className="px-8 py-4 bg-white text-slate-950 rounded-lg font-bold text-lg hover:bg-slate-200 transition shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              Khám phá Bản đồ ngay
            </Link>
            <Link href="#features" className="px-8 py-4 border border-white/20 rounded-lg font-medium text-lg hover:bg-white/5 transition">
              Tìm hiểu thêm
            </Link>
          </div>
        </FadeInUp>
      </main>

      {/* Features Section with Hover Effects */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto border-t border-white/10">
        <FadeInUp>
          <h2 className="text-3xl font-bold text-center mb-12">4 Chỉ số Giám sát Chính</h2>
        </FadeInUp>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Droplets, title: "Xâm nhập mặn", desc: "Giám sát độ mặn theo thời gian thực tại các cửa sông." },
            { icon: Activity, title: "Stress Nhiệt", desc: "Chỉ số nhiệt độ nước ảnh hưởng đến cây trồng." },
            { icon: Zap, title: "Rủi ro Lũ", desc: "Khả năng ngập lụt theo mùa mưa." },
            { icon: Eye, title: "Ô nhiễm", desc: "Chất lượng nước và độ ô nhiễm hữu cơ." }
          ].map((f, i) => (
            <FadeInUp key={i} delay={i * 0.1}>
              <HoverCard>
                <div className="p-6 rounded-2xl bg-slate-900 border border-white/5 h-full flex flex-col">
                  <f.icon className="w-10 h-10 text-cyan-500 mb-4" />
                  <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                  <p className="text-slate-400 flex-1">{f.desc}</p>
                </div>
              </HoverCard>
            </FadeInUp>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10 text-center">
          {[
            { number: "3", label: "Tỉnh được giám sát" },
            { number: "4", label: "Chỉ số dữ liệu" },
            { number: "24/7", label: "Cảnh báo sớm" }
          ].map((stat, i) => (
            <FadeInUp key={i} delay={i * 0.15}>
              <div>
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <p className="text-slate-400">{stat.label}</p>
              </div>
            </FadeInUp>
          ))}
        </div>
      </section>

      {/* News Section with Horizontal Scroll */}
      <section className="py-20 bg-slate-900/50 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <FadeInUp>
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <Wind className="text-cyan-400" /> Tin tức & Cảnh báo
            </h2>
          </FadeInUp>
          
          {/* Horizontal Scroll Slider */}
          <HorizontalScroll>
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="snap-center shrink-0 w-[300px] md:w-[400px]">
                <HoverCard>
                  <div className="rounded-xl overflow-hidden bg-slate-800 border border-white/10 h-full flex flex-col">
                    <div className="h-48 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 relative flex items-center justify-center">
                      <div className="text-6xl opacity-20">
                        {item === 1 && "🌊"}
                        {item === 2 && "🌡️"}
                        {item === 3 && "💧"}
                        {item === 4 && "⚠️"}
                        {item === 5 && "📡"}
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded text-xs">Cập nhật mới</div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="text-cyan-400 text-xs font-bold mb-2">
                        {["MẶN", "NHIỆT", "LŨ", "CẢNH BÁO", "DỮ LIỆU"][item - 1]}
                      </div>
                      <h3 className="font-bold text-lg mb-2">
                        {[
                          "Dự báo mặn tăng cao tại Cửa Đại",
                          "Stress nhiệt tăng ở khu vực An Giang",
                          "Rủi ro lũ cao tuần tới",
                          "Cảnh báo khẩn cấp: Ô nhiễm nước",
                          "Cập nhật dữ liệu vệ tinh mới"
                        ][item - 1]}
                      </h3>
                      <p className="text-slate-400 text-sm flex-1">
                        {[
                          "Nồng độ mặn dự kiến vượt mức 4‰, bà con cần đóng cống ngay lập tức.",
                          "Nhiệt độ nước cao hơn bình thường 3-5°C, ảnh hưởng đến cây trồng.",
                          "Mùa mưa đang tới, mực nước sông dự báo tăng đột ngột.",
                          "Phát hiện các chất gây ô nhiễm cao ở khu vực Cà Mau.",
                          "Dữ liệu vệ tinh ngày hôm nay đã được cập nhật vào hệ thống."
                        ][item - 1]}
                      </p>
                      <button className="mt-4 text-cyan-400 text-sm font-bold hover:text-cyan-300 transition">
                        Xem chi tiết →
                      </button>
                    </div>
                  </div>
                </HoverCard>
              </div>
            ))}
          </HorizontalScroll>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 border-t border-white/10">
        <FadeInUp>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Bạn đã sẵn sàng để bảo vệ mùa vụ của mình?</h2>
            <p className="text-slate-400 mb-8 text-lg">
              Hãy bắt đầu hôm nay và nhận cảnh báo sớm trước các rủi ro môi trường.
            </p>
            <Link href="/dashboard" className="inline-block px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 font-bold text-lg rounded-lg hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition">
              Truy cập Dashboard ngay →
            </Link>
          </div>
        </FadeInUp>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6 text-center text-slate-500 text-sm">
        <p>© 2026 Delta Stress Lens. Công cụ hỗ trợ quyết định cho Đồng Bằng Sông Cửu Long.</p>
      </footer>
    </div>
  );
}

