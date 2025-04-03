const multer = require('multer');
const path = require('path');
const fs = require('fs');
const responseHandler = require('../utils/responseHandler');

// Tạo thư mục uploads nếu chưa tồn tại
const createUploadDir = (dir) => {
  const uploadPath = path.join(__dirname, '..', process.env.UPLOAD_PATH || 'uploads', dir);
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }
  return uploadPath;
};

// Cấu hình lưu trữ
const storage = (directory) => multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = createUploadDir(directory);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Tạo tên file duy nhất: thời gian + tên gốc
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extname = path.extname(file.originalname);
    cb(null, uniqueSuffix + extname);
  }
});

// Bộ lọc tập tin
const fileFilter = (allowedTypes) => {
  return (req, file, cb) => {
    // Kiểm tra loại file dựa trên mimetype
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Loại tập tin không được hỗ trợ!'), false);
    }
  };
};

// Tạo middleware upload cho hình ảnh
exports.uploadImage = (directory = 'images', fieldName = 'image') => {
  const upload = multer({
    storage: storage(directory),
    limits: {
      fileSize: 5 * 1024 * 1024 // 5MB
    },
    fileFilter: fileFilter([
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp'
    ])
  });

  // Middleware để xử lý tải lên một hình ảnh
  return (req, res, next) => {
    upload.single(fieldName)(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          // Lỗi multer
          if (err.code === 'LIMIT_FILE_SIZE') {
            return responseHandler.badRequest(res, 'Tập tin quá lớn. Kích thước tối đa là 5MB.');
          }
          return responseHandler.badRequest(res, err.message);
        }
        // Lỗi khác
        return responseHandler.badRequest(res, err.message);
      }
      next();
    });
  };
};

// Tạo middleware upload nhiều hình ảnh
exports.uploadImages = (directory = 'images', fieldName = 'images', maxCount = 5) => {
  const upload = multer({
    storage: storage(directory),
    limits: {
      fileSize: 5 * 1024 * 1024 // 5MB
    },
    fileFilter: fileFilter([
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp'
    ])
  });

  // Middleware để xử lý tải lên nhiều hình ảnh
  return (req, res, next) => {
    upload.array(fieldName, maxCount)(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          // Lỗi multer
          if (err.code === 'LIMIT_FILE_SIZE') {
            return responseHandler.badRequest(res, 'Tập tin quá lớn. Kích thước tối đa là 5MB.');
          }
          if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return responseHandler.badRequest(res, `Vượt quá số lượng tập tin tối đa (${maxCount}).`);
          }
          return responseHandler.badRequest(res, err.message);
        }
        // Lỗi khác
        return responseHandler.badRequest(res, err.message);
      }
      next();
    });
  };
}; 