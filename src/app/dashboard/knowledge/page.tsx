'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { motion, AnimatePresence } from 'framer-motion';

const KNOWLEDGE_SECTIONS = [
  {
    id: 'techniques',
    title: 'Kỹ Thuật Canh Tác & Sản Xuất Thông Minh',
    icon: '🌾',
    items: [
      {
        title: 'Quản Lý Dịch Hại Tích Hợp (IPM)',
        content: `• Nhận biết dịch hại bằng phương pháp khoa học
• Phương pháp sinh học: côn trùng có ích, kẻ ăn thịt
• Phương pháp canh tác: luân canh, giống chống chịu
• Phương pháp vật lý: bẫy, rào chắn
• Chỉ sử dụng hóa chất khi là biện pháp cuối cùng
• Có thể giảm sử dụng thuốc trừ sâu 30-50%`
      },
      {
        title: 'Ứng Dụng Công Nghệ Cao',
        content: `• Tưới Tiêu Tự Động: Hệ thống điều khiển qua điện thoại để tưới chính xác
• Phun Muỗng Máy Bay Không Người: Phân bố thuốc/phân bón đều
• Công Nghệ Nhà Kính: Kiểm soát nhiệt độ/độ ẩm, đèn LED trồng
• Cảm Biến Đất: Theo dõi độ ẩm, pH, chất dinh dưỡng thời gian thực`
      },
      {
        title: 'Thích Ứng Với Biến Đổi Khí Hậu',
        content: `• Dự Báo Thời Tiết: Lên kế hoạch gieo trồng/thu hoạch dựa trên dự báo
• Giống Chịu Mặn: Giống lúa dành cho đất mặn
• Loài Chịu Hạn: Xoài, dừa cho mùa khô
• Canh Tác Thấp Phát Thải: Giảm khí mê-tan trong cánh đồng lúa`
      },
    ]
  },
  {
    id: 'inputs',
    title: 'Sử Dụng An Toàn Các Nguồn Cung Cấp Nông Nghiệp',
    icon: '⚗️',
    items: [
      {
        title: 'Phân Bón: 3 Điều Đúng',
        content: `• Loại Đúng: Phù hợp nhu cầu cây trồng (N cho rau lá, P/K cho quả)
• Liều Đúng: Tuân theo khuyến cáo từ kiểm tra đất
• Thời Gian Đúng: Áp dụng trong các giai đoạn sinh trưởng quan trọng
• Phương Pháp Đúng: Phun cơ bản, chia lô, hoặc tưới qua hệ thống
• Tùy Chọn Hữu Cơ: Compost, phân chuồng, vi sinh vật cho sức khỏe đất`
      },
      {
        title: 'Thuốc Trừ Sâu: 4 Điều Đúng',
        content: `• Sản Phẩm Đúng: Chọn cho dịch hại/bệnh cụ thể
• Liều Đúng: Không quá liều; đọc hướng dẫn sử dụng cẩn thận
• Thời Gian Đúng: Phun khi thiệt hại dịch hại đạt ngưỡng
• Phương Pháp Đúng: Phun, rải bột, hoặc tưới đất như chỉ định
• Trang Bị Bảo Vệ: Găng tay, khẩu trang, kính bảo vệ bắt buộc
• Bảo Quản: Nơi mát, khô ráo, tránh xa trẻ em/vật nuôi`
      },
    ]
  },
  {
    id: 'economics',
    title: 'Kinh Tế & Quản Lý Nông Trại',
    icon: '💰',
    items: [
      {
        title: 'Tư Duy Canh Tác Chuyên Nghiệp',
        content: `• Chuyển từ sản xuất tự tiêu sang hướng thị trường
• Ghi Chép Bản Ghi: Theo dõi đầu vào, năng suất, chi phí để phân tích
• Phân Tích Chi Phí-Lợi Ích: So sánh các phương pháp sản xuất
• Khả Năng Truy Xuất: Gắn nhãn sản phẩm của bạn, bán giá cao hơn
• Tiêu Chuẩn Chất Lượng: Đáp ứng các yêu cầu của người mua liên tục`
      },
      {
        title: 'Kết Nối Thị Trường',
        content: `• Chuỗi Giá Trị: Quan hệ trực tiếp với người mua và nhà phân phối
• Xu Hướng Giá: Theo dõi thị trường qua ứng dụng, radio, hiệp hội
• Chương Trình Nhà Khoa Học-Nông Dân: Tiếp cận nghiên cứu & dịch vụ mở rộng
• Hợp Tác Xã: Sức mua hàng loạt, kênh bán hàng tập thể
• Nền Tảng Kỹ Thuật Số: Thị trường trực tuyến bán trực tiếp cho người tiêu dùng`
      },
    ]
  },
  {
    id: 'animals',
    title: 'Chăn Nuôi & Thú Y',
    icon: '🐄',
    items: [
      {
        title: 'Phòng Chống Bệnh Tật',
        content: `• Lịch Tiêm Chủng: Tuân theo lịch sức khỏe chăn nuôi
• Vệ Sinh Chuồng: Thực hành làm sạch và khử trùng hàng ngày
• Sinh Học An Toàn: Cách ly vật nuôi mới, kiểm soát truy cập khách
• Kiểm Tra Mẫu: Xét nghiệm máu/phân cho bệnh (lao, viêm não xương)
• Bệnh Phổ Biến: Cúm gia cầm, bệnh ngoài da, bệnh Newcastle
• Hỗ Trợ Thú Y: Xây dựng mối quan hệ với bác sĩ thú y địa phương`
      },
    ]
  },
];

export default function KnowledgePage() {
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggleSection = (id: string) => {
    setExpanded(expanded === id ? null : id);
  };

  return (
    <ProtectedRoute requiredRole="FARMER">
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-center mb-2 text-neon-cyan">📚 Trang Kiến Thức</h1>
            <p className="text-center text-gray-400">Tài liệu giáo dục cho nông nghiệp bền vững và có lợi nhuận</p>
          </motion.div>

          {/* Sections */}
          <div className="space-y-3">
            <AnimatePresence>
              {KNOWLEDGE_SECTIONS.map((section) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="border border-neon-purple/30 rounded-lg overflow-hidden"
                >
                  {/* Header Button */}
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full bg-gray-800 hover:bg-gray-700 p-4 flex items-center justify-between transition text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{section.icon}</span>
                      <h2 className="text-lg font-bold text-neon-cyan">{section.title}</h2>
                    </div>
                    <motion.span
                      animate={{ rotate: expanded === section.id ? 180 : 0 }}
                      className="text-neon-purple"
                    >
                      ▼
                    </motion.span>
                  </button>

                  {/* Content */}
                  <AnimatePresence>
                    {expanded === section.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="bg-gray-900 p-4 space-y-3 border-t border-gray-700">
                          {section.items.map((item, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className="border-l-2 border-neon-cyan pl-4 py-2"
                            >
                              <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                              <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans leading-relaxed">
                                {item.content}
                              </pre>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Footer Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 p-4 bg-gray-800/50 border border-gray-700 rounded-lg text-center text-sm text-gray-400"
          >
            💡 <span className="text-neon-cyan">Mẹo:</span> Nhấp vào bất kỳ phần nào để mở rộng và tìm hiểu thêm về các hoạt động canh tác bền vững.
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
