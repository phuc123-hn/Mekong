import axios from 'axios';

// Backend URL PHẢI được set trong Vercel Environment Variables
// NEXT_PUBLIC_BACKEND_URL = https://mekong-production.up.railway.app/api
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

if (!API_URL) {
  console.error('❌ NEXT_PUBLIC_BACKEND_URL is not set in environment variables');
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Interceptor: Tự động gắn Token vào mỗi request nếu có
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Interceptor: Xử lý lỗi
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Token hết hạn hoặc không hợp lệ -> Auto logout
    if (error.response?.status === 401) {
      console.warn('Unauthorized - Logging out');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login nếu không phải là login page
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth')) {
        window.location.href = '/auth';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
