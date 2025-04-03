import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Cấu hình Axios đơn giản
const api = axios.create({
  baseURL: apiUrl,
  timeout: 30000,
  headers: { 
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Thêm token vào request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Xử lý lỗi cơ bản
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Xử lý lỗi xác thực 401
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api; 