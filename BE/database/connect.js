const mongoose = require('mongoose');
const logger = require('../utils/logger');

// Hàm kết nối đến MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    logger.info(`MongoDB đã kết nối: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    logger.error(`Lỗi kết nối MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB; 