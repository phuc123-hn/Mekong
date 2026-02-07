'use client';

import { motion } from 'framer-motion';

// 1. Hiệu ứng Scroll Trigger (Cuộn tới đâu hiện tới đó)
export const FadeInUp = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }} // Ban đầu: Ẩn và nằm thấp hơn 50px
      whileInView={{ opacity: 1, y: 0 }} // Khi lọt vào màn hình: Hiện rõ và bay lên vị trí gốc
      viewport={{ once: true, margin: "-100px" }} // once: true -> Chỉ chạy 1 lần (không bị lặp lại gây rối mắt)
      transition={{ duration: 0.6, delay: delay, type: "spring", stiffness: 50 }}
    >
      {children}
    </motion.div>
  );
};

// 2. Hiệu ứng Hover Floating (Lơ lửng khi di chuột)
export const HoverCard = ({ children, onClick }: { children: React.ReactNode, onClick?: () => void }) => {
  return (
    <motion.div
      whileHover={{ 
        y: -10, // Bay lên 10px
        boxShadow: "0px 20px 40px rgba(6, 182, 212, 0.2)" // Đổ bóng màu Cyan
      }}
      whileTap={{ scale: 0.98 }} // Hiệu ứng nhấn nút (nhỏ lại xíu)
      transition={{ type: "spring", stiffness: 300 }}
      onClick={onClick}
      className="cursor-pointer h-full"
    >
      {children}
    </motion.div>
  );
};

// 3. Slider mượt mà (Dùng CSS Scroll Snap + Tailwind cho nhẹ, không cần JS nặng)
export const HorizontalScroll = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scrollbar-hide">
      {/* scrollbar-hide: Cần thêm plugin hoặc custom CSS để ẩn thanh cuộn cho đẹp */}
      {children}
    </div>
  );
};
