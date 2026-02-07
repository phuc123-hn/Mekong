'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, MapPin, AlertCircle, CheckCircle, X, Loader } from 'lucide-react';

export type RiskType = 'salinity' | 'dead_crops' | 'flooding' | 'pollution';

export interface FieldReport {
  id: string;
  type: RiskType;
  latitude: number;
  longitude: number;
  image?: string;
  description: string;
  timestamp: number;
  status: 'pending' | 'uploaded';
}

const RISK_TYPES: Record<RiskType, { icon: string; label: string; color: string }> = {
  salinity: { icon: '💧', label: 'Xâm nhập mặn', color: 'from-blue-500 to-blue-600' },
  dead_crops: { icon: '🌾', label: 'Lúa chết', color: 'from-orange-500 to-orange-600' },
  flooding: { icon: '💦', label: 'Ngập lụt', color: 'from-cyan-500 to-cyan-600' },
  pollution: { icon: '⚠️', label: 'Ô nhiễm', color: 'from-red-500 to-red-600' },
};

export function CitizenScience({ onReportAdded }: { onReportAdded?: (report: FieldReport) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<RiskType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'compressing' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const cameraRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const handleReportClick = () => {
    setIsOpen(true);
    setSelectedType(null);
    setUploadStatus('idle');
  };

  const handleTypeSelect = (type: RiskType) => {
    setSelectedType(type);
  };

  const handleCameraCapture = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setUploadStatus('compressing');

    try {
      // Get current location
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;

      // Compress image
      const options = {
        maxSizeMB: 0.2, // 200KB max
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };

      let compressedFile = file;
      try {
        const imageCompression = await import('browser-image-compression');
        compressedFile = await imageCompression.default(file, options);
      } catch (e) {
        console.warn('Image compression unavailable, using original:', e);
      }

      // Read compressed image
      const reader = new FileReader();
      reader.onload = async (e) => {
        setUploadStatus('uploading');

        // Create optimistic report
        const reportId = Date.now().toString();
        const optimisticReport: FieldReport = {
          id: reportId,
          type: selectedType!,
          latitude,
          longitude,
          image: e.target?.result as string,
          description: descriptionRef.current?.value || '',
          timestamp: Date.now(),
          status: 'pending',
        };

        // Show success immediately (Optimistic UI)
        setUploadStatus('success');
        onReportAdded?.(optimisticReport);

        // Background upload (simulate)
        setTimeout(() => {
          setIsOpen(false);
          setIsLoading(false);
          setUploadStatus('idle');
          if (cameraRef.current) cameraRef.current.value = '';
          if (descriptionRef.current) descriptionRef.current.value = '';
        }, 1500);

        // In real scenario, here you would upload to API
        // await fetch('/api/reports', { method: 'POST', body: formData })
      };

      reader.readAsDataURL(compressedFile);
    } catch (error) {
      setUploadStatus('error');
      setErrorMessage(
        error instanceof GeolocationPositionError
          ? 'Không thể lấy vị trí. Vui lòng cấp quyền truy cập GPS.'
          : 'Lỗi xử lý ảnh. Vui lòng thử lại.'
      );
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        onClick={handleReportClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-8 right-8 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg hover:shadow-cyan-500/50 flex items-center justify-center text-white font-bold text-2xl"
      >
        <span>+</span>
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isLoading && setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <AlertCircle size={24} /> Báo cáo hiện trường
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  disabled={isLoading}
                  className="text-white hover:bg-white/20 rounded-lg p-1 transition disabled:opacity-50"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {!selectedType ? (
                  // Step 1: Select Risk Type
                  <>
                    <p className="text-slate-300 text-sm">Chọn loại rủi ro:</p>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(RISK_TYPES).map(([key, { icon, label, color }]) => (
                        <motion.button
                          key={key}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleTypeSelect(key as RiskType)}
                          className={`p-4 rounded-xl border-2 transition flex flex-col items-center gap-2 bg-gradient-to-br ${color} bg-opacity-10 border-white/20 hover:border-white/40`}
                        >
                          <span className="text-3xl">{icon}</span>
                          <span className="text-xs font-bold text-white text-center">{label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </>
                ) : (
                  // Step 2: Capture & Upload
                  <>
                    <div className="text-center">
                      <div className="text-5xl mb-2">{RISK_TYPES[selectedType].icon}</div>
                      <h3 className="text-lg font-bold text-white">{RISK_TYPES[selectedType].label}</h3>
                      <p className="text-slate-400 text-xs mt-1">Vị trí: <MapPin className="inline w-3 h-3" /> Tự động phát hiện</p>
                    </div>

                    {/* Description */}
                    <textarea
                      ref={descriptionRef}
                      placeholder="Mô tả chi tiết (tùy chọn)..."
                      className="w-full bg-slate-800 border border-white/10 rounded-lg p-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500/50 resize-none h-20"
                    />

                    {/* Camera Input */}
                    <div className="relative">
                      <input
                        ref={cameraRef}
                        type="file"
                        accept="image/*"
                        onChange={handleCameraCapture}
                        disabled={isLoading}
                        className="hidden"
                      />
                      <motion.button
                        whileHover={{ scale: isLoading ? 1 : 1.02 }}
                        whileTap={{ scale: isLoading ? 1 : 0.98 }}
                        onClick={() => cameraRef.current?.click()}
                        disabled={isLoading}
                        className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold flex items-center justify-center gap-2 hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <>
                            <Loader className="animate-spin" size={18} />
                            {uploadStatus === 'compressing' && 'Đang nén ảnh...'}
                            {uploadStatus === 'uploading' && 'Đang gửi...'}
                          </>
                        ) : (
                          <>
                            <Camera size={18} /> Chụp ảnh & Gửi
                          </>
                        )}
                      </motion.button>
                    </div>

                    {/* Status Messages */}
                    <AnimatePresence>
                      {uploadStatus === 'success' && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="bg-green-500/20 border border-green-500/50 rounded-lg p-3 flex items-center gap-2 text-green-400"
                        >
                          <CheckCircle size={18} />
                          <div>
                            <p className="font-bold text-sm">Cảm ơn báo cáo!</p>
                            <p className="text-xs">Dữ liệu của bạn giúp cộng đồng</p>
                          </div>
                        </motion.div>
                      )}

                      {uploadStatus === 'error' && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 flex items-center gap-2 text-red-400"
                        >
                          <AlertCircle size={18} />
                          <div>
                            <p className="font-bold text-sm">Lỗi</p>
                            <p className="text-xs">{errorMessage}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Back Button */}
                    <button
                      onClick={() => setSelectedType(null)}
                      disabled={isLoading}
                      className="w-full text-slate-400 hover:text-white text-sm font-bold transition disabled:opacity-50"
                    >
                      ← Chọn loại khác
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
