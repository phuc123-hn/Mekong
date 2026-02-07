'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Search, Archive, Trash2 } from 'lucide-react';

interface Message {
  id: string;
  from: string;
  subject: string;
  preview: string;
  timestamp: number;
  read: boolean;
}

const mockMessages: Message[] = [
  {
    id: '1',
    from: 'Nông dân Tân Phú',
    subject: 'Thông báo xâm nhập mặn',
    preview: 'Nước mặn vào sâu hơn năm ngoài, cần hỗ trợ thoát nước...',
    timestamp: Date.now() - 3600000,
    read: false,
  },
  {
    id: '2',
    from: 'Trạm quan trắc An Phú',
    subject: 'Cập nhật chỉ số nhiệt độ hôm nay',
    preview: 'Nhiệt độ đạt 38°C, khuyến cáo nông dân tưới nước đầy đủ...',
    timestamp: Date.now() - 7200000,
    read: true,
  },
  {
    id: '3',
    from: 'Sở Nông Nghiệp Cà Mau',
    subject: 'Chính sách hỗ trợ nông dân bị lũ',
    preview: 'Thông báo mới về hỗ trợ tài chính cho nông dân bị ảnh hưởng lũ lụt...',
    timestamp: Date.now() - 86400000,
    read: true,
  },
];

export default function InboxPage() {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMessages = messages.filter(
    msg =>
      msg.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreadCount = messages.filter(m => !m.read).length;

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours === 0) return 'Vừa xong';
    if (hours < 24) return `${hours}h trước`;
    if (days < 7) return `${days}d trước`;
    return new Date(timestamp).toLocaleDateString('vi-VN');
  };

  return (
    <div className="h-full flex flex-col bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 p-6 bg-gradient-to-b from-slate-900 to-slate-950">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
            <Mail className="w-6 h-6 text-cyan-400" />
            Hộp Thư
          </h1>
          {unreadCount > 0 && (
            <p className="text-sm text-slate-400">
              <span className="text-cyan-400 font-semibold">{unreadCount}</span> tin nhắn chưa đọc
            </p>
          )}
        </motion.div>
      </div>

      {/* Search Bar */}
      <div className="border-b border-slate-800 p-4 bg-slate-900/50">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Tìm kiếm tin nhắn..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto">
        {filteredMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-500">
            <div className="text-center">
              <Mail className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Không có tin nhắn nào</p>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="divide-y divide-slate-800"
          >
            {filteredMessages.map((msg, idx) => (
              <motion.button
                key={msg.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setSelectedId(selectedId === msg.id ? null : msg.id)}
                className={`w-full p-4 text-left transition-all ${
                  selectedId === msg.id
                    ? 'bg-slate-800 border-l-4 border-cyan-500'
                    : 'bg-slate-900/50 hover:bg-slate-800 border-l-4 border-transparent'
                } ${!msg.read ? 'border-r-4 border-r-cyan-500' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-semibold ${!msg.read ? 'text-white' : 'text-slate-300'}`}>
                        {msg.from}
                      </h3>
                      <span className="text-xs text-slate-500">{formatTime(msg.timestamp)}</span>
                    </div>
                    <p className="text-sm font-medium text-slate-200 mb-1">{msg.subject}</p>
                    <p className="text-sm text-slate-400 truncate">{msg.preview}</p>
                  </div>
                  {!msg.read && <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0" />}
                </div>

                {/* Expanded View */}
                {selectedId === msg.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 pt-4 border-t border-slate-700 space-y-3"
                  >
                    <p className="text-sm text-slate-300 whitespace-pre-wrap">{msg.preview}</p>
                    <div className="flex gap-2">
                      <button className="flex items-center gap-2 px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded text-sm text-slate-300 transition">
                        <Archive className="w-4 h-4" />
                        Lưu trữ
                      </button>
                      <button className="flex items-center gap-2 px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded text-sm text-slate-300 transition">
                        <Trash2 className="w-4 h-4" />
                        Xóa
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
