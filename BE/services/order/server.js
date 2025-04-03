const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { notFound, errorHandler } = require('../../middlewares/errorHandler');
const thongTinDatBanRoutes = require('./routes/thongTinDatBanRoutes');
const config = require('../../config');
const logger = require('../../utils/logger');
const path = require('path');

// Tải biến môi trường
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Khởi tạo app
const app = express();

// Thiết lập middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: config.cors.origin
}));
app.use(helmet());

// Logging
if (config.env === 'development') {
  app.use(morgan('dev'));
}

// Thêm middleware để log chi tiết request
app.use((req, res, next) => {
  if (req.method === 'POST') {
    console.log('Received request:', req.method, req.originalUrl);
    console.log('Headers:', JSON.stringify(req.headers));
    console.log('Body:', JSON.stringify(req.body));
  }
  next();
});

// Routes - sửa route để phù hợp với yêu cầu từ Gateway
app.use('/api/dat-ban', thongTinDatBanRoutes);

// Kiểm tra kết nối
app.get('/api/order/health', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'Order Service',
    time: new Date().toISOString()
  });
});

// Middleware xử lý lỗi
app.use(notFound);
app.use(errorHandler);

// Kết nối đến MongoDB
mongoose.connect(config.mongodb.uri)
  .then(() => {
    logger.info('Kết nối MongoDB thành công (Order Service)');
    
    // Khởi động server
    const PORT = config.servicePorts.order || 5004;
    app.listen(PORT, () => {
      logger.info(`Order Service đang chạy trên cổng ${PORT}`);
    });
  })
  .catch((error) => {
    logger.error(`Lỗi kết nối MongoDB (Order Service): ${error.message}`);
    process.exit(1);
  }); 