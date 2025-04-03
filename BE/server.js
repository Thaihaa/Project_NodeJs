const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');
const fetch = require('node-fetch');
const config = require('./config');
const logger = require('./utils/logger');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const jwt = require('jsonwebtoken');

// Tải biến môi trường
dotenv.config();

// Khởi tạo app
const app = express();

// Thiết lập middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(cors({
  origin: config.cors.origin || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(helmet({
  contentSecurityPolicy: false
}));

// Logging
if (config.env === 'development') {
  app.use(morgan('dev'));
}

// Middleware Proxy cho các service
// Auth Service
app.use('/api/auth', createProxyMiddleware({
  target: `http://localhost:${config.servicePorts.auth}`,
  changeOrigin: true,
  pathRewrite: { '^/api/auth': '/api/auth' },
  timeout: 60000,
  proxyTimeout: 60000,
  onError: (err, req, res) => {
    logger.error(`Proxy error (Auth): ${err.message}`);
    
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: 'Lỗi kết nối dịch vụ xác thực, vui lòng thử lại sau'
      });
    }
  },
  onProxyReq: (proxyReq, req, res) => {
    if (req.body && req.method === 'POST') {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  }
}));

app.use('/api/users', createProxyMiddleware({
  target: `http://localhost:${config.servicePorts.auth}`,
  changeOrigin: true,
  timeout: 30000,
  proxyTimeout: 30000,
  ws: false,
  secure: false,
  followRedirects: false,
  onError: (err, req, res) => {
    logger.error(`Proxy error (Users): ${err.message}`);
    if (!res.headersSent) {
      res.writeHead(500, {
        'Content-Type': 'application/json'
      });
      res.end(JSON.stringify({
        success: false,
        message: 'Lỗi kết nối dịch vụ, vui lòng thử lại sau',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      }));
    }
  }
}));

// Roles Service
app.use('/api/roles', createProxyMiddleware({
  target: `http://localhost:${config.servicePorts.auth}`,
  changeOrigin: true,
  timeout: 30000,
  proxyTimeout: 30000,
  ws: false,
  secure: false,
  followRedirects: false,
  onError: (err, req, res) => {
    logger.error(`Proxy error (Roles): ${err.message}`);
    if (!res.headersSent) {
      res.writeHead(500, {
        'Content-Type': 'application/json'
      });
      res.end(JSON.stringify({
        success: false,
        message: 'Lỗi kết nối dịch vụ vai trò, vui lòng thử lại sau',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      }));
    }
  }
}));

// Restaurant Service
app.use('/api/nha-hang', createProxyMiddleware({
  target: `http://localhost:${config.servicePorts.restaurant}`,
  changeOrigin: true
}));

// Bàn Service
app.use('/api/ban', createProxyMiddleware({
  target: `http://localhost:${config.servicePorts.restaurant}`,
  changeOrigin: true
}));

// Menu Service
app.use('/api/loai-mon-an', createProxyMiddleware({
  target: `http://localhost:${config.servicePorts.menu}`,
  changeOrigin: true
}));

app.use('/api/mon-an', createProxyMiddleware({
  target: `http://localhost:${config.servicePorts.menu}`,
  changeOrigin: true
}));

// Order Service
app.use('/api/dat-ban', createProxyMiddleware({
  target: `http://localhost:${config.servicePorts.order}`,
  changeOrigin: true,
  timeout: 30000,
  proxyTimeout: 30000,
  ws: false,
  secure: false,
  followRedirects: false,
  onError: (err, req, res) => {
    logger.error(`Proxy error (Order - Đặt bàn): ${err.message}`);
    if (!res.headersSent) {
      res.writeHead(500, {
        'Content-Type': 'application/json'
      });
      res.end(JSON.stringify({
        success: false,
        message: 'Lỗi kết nối dịch vụ đặt bàn, vui lòng thử lại sau',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      }));
    }
  },
  onProxyReq: (proxyReq, req, res) => {
    if (req.method === 'POST') {
      console.log('Gateway API receiving POST to /api/dat-ban');
      console.log('Req body:', req.body);
      
      // Nếu body là JSON, chuyển đổi nó sang đúng định dạng
      if (req.body && typeof req.body === 'object') {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    }
  }
}));

// Review Service
app.use('/api/danh-gia', createProxyMiddleware({
  target: `http://localhost:${config.servicePorts.review}`,
  changeOrigin: true
}));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'API Gateway',
    time: new Date().toISOString(),
    message: 'API Gateway đang hoạt động bình thường'
  });
});

// Kiểm tra kết nối đến Auth Service
app.get('/api/auth-check', async (req, res) => {
  try {
    const response = await fetch(`http://localhost:${config.servicePorts.auth}/api/auth/health`);
    const data = await response.json();
    res.status(200).json({
      success: true,
      message: 'Auth Service hoạt động bình thường',
      serviceResponse: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Không thể kết nối đến Auth Service',
      error: error.message
    });
  }
});

// API kiểm tra vai trò Admin
app.get('/api/check-admin', async (req, res) => {
  try {
    // Lấy token từ headers
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Không có token xác thực'
      });
    }

    // Giải mã token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || config.jwt.secret);
    
    // Truy vấn thông tin người dùng từ Auth Service
    const response = await fetch(`http://localhost:${config.servicePorts.auth}/api/auth/current`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      return res.status(403).json({
        success: false,
        message: 'Token không hợp lệ hoặc người dùng không tồn tại'
      });
    }
    
    const userData = await response.json();
    
    // Kiểm tra vai trò
    if (userData.user && userData.user.role === 'admin') {
      return res.status(200).json({
        success: true,
        isAdmin: true,
        message: 'Người dùng có quyền Admin'
      });
    } else {
      return res.status(403).json({
        success: false,
        isAdmin: false,
        message: 'Người dùng không có quyền Admin'
      });
    }
  } catch (error) {
    console.error('Lỗi kiểm tra quyền Admin:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi hệ thống khi kiểm tra quyền Admin',
      error: error.message
    });
  }
});

// Tạo tài khoản Admin đầu tiên
app.post('/api/create-first-admin', async (req, res) => {
  res.status(400).json({
    success: false,
    message: 'Tính năng này đã bị vô hiệu hóa'
  });
});

// Middleware xử lý lỗi
app.use(notFound);
app.use(errorHandler);

// Khởi động server
const PORT = config.port || 5000;
app.listen(PORT, () => {
  logger.info(`API Gateway đang chạy trên cổng ${PORT}`);
  logger.info(`Môi trường: ${config.env}`);
}); 