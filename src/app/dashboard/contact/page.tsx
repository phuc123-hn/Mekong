'use client';

import { useState, useEffect, useCallback } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuthStore } from '@/store/auth-store';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContactPage() {
  const { user, token } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'form' | 'inbox'>('form');
  const [formData, setFormData] = useState({ name: '', phone: user?.phone || '', issue: '' });
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState('');

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/messages/inbox', {
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        credentials: 'include'
      });
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (activeTab === 'inbox') {
      fetchMessages();
      const interval = setInterval(fetchMessages, 30000); // Poll every 30s
      return () => clearInterval(interval);
    }
  }, [activeTab, fetchMessages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
const res = await fetch('http://localhost:5000/api/messages/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include',
        body: JSON.stringify({
          name: formData.name || user?.phone,
          phone: formData.phone,
          content: formData.issue,
          toRole: 'GOVERNMENT'
        })
      });

      if (res.ok) {
        setNotification('✅ Message sent successfully!');
        setFormData({ name: '', phone: user?.phone || '', issue: '' });
        setTimeout(() => setNotification(''), 3000);
      } else {
        throw new Error('Failed to send');
      }
    } catch (err) {
      setNotification('❌ Failed to send message');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute requiredRole="FARMER">
      <div className="min-h-screen bg-gray-900 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold mb-2 text-neon-cyan">📞 Liên Hệ & Hỗ Trợ</h1>
            <p className="text-gray-400">Gửi tin nhắn đến chính phủ và kiểm tra phản hồi</p>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-4 mb-6 border-b border-gray-700"
          >
            {(['form', 'inbox'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 font-semibold transition relative ${
                  activeTab === tab ? 'text-neon-cyan' : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                {tab === 'form' ? '✉️ Gửi Tin Nhắn' : '📬 Hộp Thư'}
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-neon-cyan"
                  />
                )}
              </button>
            ))}
          </motion.div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'form' ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-gray-800 p-6 rounded-lg border border-neon-purple/30"
              >
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-gray-300">Tên (Tùy Chọn)</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:border-neon-cyan focus:outline-none transition"
                      placeholder="Tên của bạn"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1 text-gray-300">Số Điện Thoại *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:border-neon-cyan focus:outline-none transition"
                      placeholder="0123456789"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1 text-gray-300">Vấn Đề / Câu Hỏi *</label>
                    <textarea
                      required
                      value={formData.issue}
                      onChange={(e) => setFormData({...formData, issue: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white min-h-32 focus:border-neon-cyan focus:outline-none transition resize-none"
                      placeholder="Mô tả vấn đề của bạn..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-neon-purple hover:bg-purple-700 disabled:bg-gray-600 text-white font-bold py-3 rounded transition"
                  >
                    {loading ? 'Đang Gửi...' : '📤 Gửi Tin Nhắn'}
                  </button>
                </form>

                {/* Direct Contacts */}
                <div className="mt-8 pt-6 border-t border-gray-700">
                  <h3 className="font-semibold text-neon-cyan mb-3">📍 Liên Hệ Trực Tiếp:</h3>
                  <div className="space-y-2 text-sm">
                    <p>📱 Điện Thoại: <span className="text-neon-cyan font-semibold">1900-XXXX</span></p>
                    <p>✉️ Email: <span className="text-neon-cyan font-semibold">contact@deltastress.gov.vn</span></p>
                    <p>📘 Facebook: <span className="text-neon-cyan font-semibold">@DeltaStressLens</span></p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="inbox"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {loading && (
                  <div className="text-center text-gray-400 py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-neon-purple mx-auto mb-2"></div>
                    Đang Tải Tin Nhắn...
                  </div>
                )}
                {!loading && messages.length === 0 && (
                  <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center text-gray-400">
                    Chưa có tin nhắn. Liên hệ với chính phủ để được hỗ trợ.
                  </div>
                )}
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-neon-cyan/50 transition"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-semibold text-neon-cyan">{msg.subject || 'Phản Hồi từ Chính Phủ'}</p>
                      <span className="text-xs text-gray-500">{new Date(msg.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-300 text-sm">{msg.response_content || msg.content}</p>
                    <span className={`inline-block mt-2 text-xs px-2 py-1 rounded ${
                      msg.status === 'RESPONDED' ? 'bg-green-600 text-white' : 'bg-yellow-600 text-white'
                    }`}>
                      {msg.status}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Notification Toast */}
          <AnimatePresence>
            {notification && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed top-4 right-4 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg"
              >
                {notification}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </ProtectedRoute>
  );
}
