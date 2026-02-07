'use client';

import { InsightCard } from './insight-card';

const INSIGHTS = [
  {
    icon: '🧂',
    title: 'Xâm nhập mặn',
    description:
      'Độ mặn đang tăng cao ở vùng ven biển và cửa sông, vượt ngưỡng an toàn. Nguy cơ ảnh hưởng tới lúa và cây ăn trái trong 7–14 ngày tới.',
    impact: 'Lúa, Trái cây, Chăn nuôi',
    status: 'high' as const,
  },
  {
    icon: '🌡️',
    title: 'Stress nhiệt',
    description:
      'Nhiệt độ trung bình cao hơn 2–3°C so với ngưỡng sinh trưởng tối ưu. Có thể gây stress nhiệt, giảm năng suất cây trồng nếu kéo dài.',
    impact: 'Lúa, Rau quả, Thủy sản',
    status: 'medium' as const,
  },
  {
    icon: '🌊',
    title: 'Mực nước tăng',
    description:
      'Mực nước có xu hướng tăng nhanh tại các nhánh sông chính. Một số khu vực trũng thấp cần theo dõi sát để tránh ngập úng bất ngờ.',
    impact: 'Vùng trũng, Đê điều, Chăn nuôi',
    status: 'medium' as const,
  },
  {
    icon: '☣️',
    title: 'Ô nhiễm nước',
    description:
      'Chỉ số ô nhiễm nước tại một số điểm vượt ngưỡng cho phép. Cần kiểm tra và xử lý nguồn xả thải để bảo vệ sức khỏe vật nuôi và cây trồng.',
    impact: 'Thủy sản, Nước tưới, Nông dân',
    status: 'high' as const,
  },
];

export function InsightsSection() {
  return (
    <section className="py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-100 mb-2">
          📋 Nhật ký Giám sát
        </h2>
        <p className="text-sm text-slate-400">
          Các chỉ số chính ảnh hưởng tới sản xuất nông nghiệp Đông Bắc Sông Cửu Long
        </p>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {INSIGHTS.map((insight, index) => (
          <InsightCard
            key={insight.title}
            {...insight}
            delay={index * 0.1}
          />
        ))}
      </div>
    </section>
  );
}
