'use client';

import { useState, useEffect, useCallback } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuthStore } from '@/store/auth-store';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: number;
  from_user_id: number;
  name?: string;
  phone: string;
  subject?: string;
  content: string;
  created_at: string;
  status: string;
  response_content?: string;
}

export default function GovernmentInbox() {
  const { token } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMsg, setSelectedMsg] = useState<Message | null>(null);
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState('');

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:3001/api/messages/gov-inbox', {
        headers: { 'Authorization': `Bearer ${token}` }
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
    fetchMessages();
    const interval = setInterval(fetchMessages, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, [fetchMessages]);

  const handleReply = async () => {
    if (!selectedMsg || !reply.trim()) {
      setNotification('⚠️ Please enter a reply');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/messages/reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message_id: selectedMsg.id,
          response_content: reply
        })
      });

      if (res.ok) {
        setNotification('✅ Reply sent successfully!');
        setReply('');
        setSelectedMsg(null);
        await fetchMessages();
        setTimeout(() => setNotification(''), 3000);
      } else {
        throw new Error('Failed to send reply');
      }
    } catch (err) {
      setNotification('❌ Failed to send reply');
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
            <h1 className="text-3xl font-bold mb-2 text-neon-purple">📬 Farmer Messages Inbox</h1>
            <p className="text-gray-400">Manage and respond to farmer submissions</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid lg:grid-cols-3 gap-6 h-[600px]"
          >
            {/* LEFT: Message List */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1 bg-gray-800 rounded-lg border border-gray-700 overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-700 sticky top-0 bg-gray-800 z-10">
                <h2 className="font-bold text-neon-cyan">
                  📧 Messages ({messages.length})
                </h2>
              </div>

              {/* Messages List */}
              <div className="flex-1 overflow-y-auto divide-y divide-gray-700">
                {loading ? (
                  <div className="flex items-center justify-center p-4 text-gray-400">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-neon-purple"></div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="p-4 text-gray-400 text-center">No messages</div>
                ) : (
                  messages.map((msg) => (
                    <motion.button
                      key={msg.id}
                      onClick={() => setSelectedMsg(msg)}
                      whileHover={{ backgroundColor: 'rgba(75, 85, 99, 0.5)' }}
                      className={`w-full text-left p-3 hover:bg-gray-700 transition ${
                        selectedMsg?.id === msg.id ? 'bg-gray-700 border-l-2 border-neon-purple' : ''
                      }`}
                    >
                      <p className="font-semibold text-sm text-neon-cyan truncate">{msg.name || msg.phone}</p>
                      <p className="text-xs text-gray-400 mt-1 truncate line-clamp-2">{msg.content}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-xs px-2 py-1 rounded font-semibold ${
                          msg.status === 'RESPONDED' 
                            ? 'bg-green-600/30 text-green-400' 
                            : msg.status === 'READ'
                            ? 'bg-blue-600/30 text-blue-400'
                            : 'bg-yellow-600/30 text-yellow-400'
                        }`}>
                          {msg.status}
                        </span>
                        <span className="text-xs text-gray-500">{new Date(msg.created_at).toLocaleDateString()}</span>
                      </div>
                    </motion.button>
                  ))
                )}
              </div>
            </motion.div>

            {/* RIGHT: Message Detail & Reply */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 bg-gray-800 rounded-lg border border-gray-700 flex flex-col"
            >
              <AnimatePresence mode="wait">
                {selectedMsg ? (
                  <motion.div
                    key={selectedMsg.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col h-full"
                  >
                    {/* Header */}
                    <div className="p-4 border-b border-gray-700 bg-gray-900">
                      <h3 className="font-bold text-lg text-neon-cyan">{selectedMsg.name || selectedMsg.phone}</h3>
                      <p className="text-xs text-gray-400 mt-1">📞 {selectedMsg.phone}</p>
                      <p className="text-xs text-gray-500 mt-1">{new Date(selectedMsg.created_at).toLocaleString()}</p>
                    </div>

                    {/* Message Content */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      <div className="bg-gray-700 p-4 rounded border-l-2 border-neon-cyan">
                        <p className="text-sm text-gray-200">{selectedMsg.content}</p>
                      </div>

                      {selectedMsg.response_content && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-neon-purple/20 p-4 rounded border-l-2 border-neon-purple"
                        >
                          <p className="text-xs text-gray-400 mb-2 font-semibold">YOUR REPLY:</p>
                          <p className="text-white text-sm">{selectedMsg.response_content}</p>
                        </motion.div>
                      )}
                    </div>

                    {/* Reply Input */}
                    {!selectedMsg.response_content && (
                      <div className="p-4 border-t border-gray-700 bg-gray-900">
                        <textarea
                          value={reply}
                          onChange={(e) => setReply(e.target.value)}
                          placeholder="Type your response..."
                          className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white min-h-24 resize-none focus:border-neon-purple focus:outline-none transition"
                        />
                        <button
                          onClick={handleReply}
                          disabled={loading || !reply.trim()}
                          className="w-full mt-3 bg-neon-purple hover:bg-purple-700 disabled:bg-gray-600 text-white font-bold py-2 rounded transition"
                        >
                          {loading ? '⏳ Sending...' : '📤 Send Reply'}
                        </button>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center h-full text-gray-400"
                  >
                    <div className="text-center">
                      <p className="text-lg">👈 Select a message to view details</p>
                      <p className="text-sm mt-2">({messages.length} messages waiting)</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>

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
