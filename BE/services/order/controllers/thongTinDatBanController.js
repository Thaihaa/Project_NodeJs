const ThongTinDatBan = require('../models/ThongTinDatBan');
const logger = require('../../../utils/logger');
const axios = require('axios');
const config = require('../../../config');

// Lấy danh sách đặt bàn với phân trang
exports.getAllThongTinDatBan = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Tạo filter
    const filter = {};
    
    // Lọc theo trạng thái
    if (req.query.trangThai && ['Chờ xác nhận', 'Đã xác nhận', 'Đã hủy', 'Hoàn thành'].includes(req.query.trangThai)) {
      filter.trangThai = req.query.trangThai;
    }
    
    // Lọc theo nhà hàng
    if (req.query.nhaHang) {
      filter.nhaHang = req.query.nhaHang;
    }
    
    // Lọc theo người đặt (nếu là user thường)
    if (req.user && req.user.role === 'user') {
      filter.nguoiDat = req.user.id;
    }
    
    // Lọc theo ngày
    if (req.query.ngayDat) {
      const startDate = new Date(req.query.ngayDat);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(req.query.ngayDat);
      endDate.setHours(23, 59, 59, 999);
      
      filter.ngayDat = {
        $gte: startDate,
        $lte: endDate
      };
    }

    // Thực hiện truy vấn
    const thongTinDatBans = await ThongTinDatBan.find(filter)
      .populate('nguoiDat', 'username fullName')
      .populate('ban', 'maBan viTri soLuongKhachToiDa')
      .skip(skip)
      .limit(limit)
      .sort({ ngayDat: -1, createdAt: -1 });

    const totalDatBan = await ThongTinDatBan.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: thongTinDatBans,
      page,
      totalPages: Math.ceil(totalDatBan / limit),
      totalItems: totalDatBan
    });
  } catch (error) {
    logger.error(`Lỗi lấy danh sách đặt bàn: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy danh sách đặt bàn',
      error: error.message
    });
  }
};

// Lấy chi tiết đặt bàn
exports.getThongTinDatBanById = async (req, res) => {
  try {
    const thongTinDatBan = await ThongTinDatBan.findById(req.params.id)
      .populate('nguoiDat', 'username fullName phoneNumber email')
      .populate('ban', 'maBan viTri soLuongKhachToiDa')
      .populate({
        path: 'monAnDat.monAn',
        select: 'tenMon gia hinhAnh'
      });
    
    if (!thongTinDatBan) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông tin đặt bàn'
      });
    }

    // Kiểm tra quyền truy cập (chỉ admin, staff hoặc chủ đơn có thể xem)
    if (req.user.role === 'user' && (!thongTinDatBan.nguoiDat || thongTinDatBan.nguoiDat._id.toString() !== req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền xem thông tin đặt bàn này'
      });
    }

    res.status(200).json({
      success: true,
      data: thongTinDatBan
    });
  } catch (error) {
    logger.error(`Lỗi lấy chi tiết đặt bàn: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy chi tiết đặt bàn',
      error: error.message
    });
  }
};

// Lấy danh sách bàn có sẵn
exports.getAvailableBans = async (req, res) => {
  try {
    const { nhaHang, ngayDat, gioDat, soLuongKhach } = req.query;
    
    if (!nhaHang || !ngayDat || !gioDat || !soLuongKhach) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp đầy đủ thông tin nhà hàng, ngày, giờ và số lượng khách'
      });
    }

    try {
      // Gọi API kiểm tra bàn có sẵn từ restaurant service
      const response = await axios.get(`${config.serviceUrls.restaurant}/api/ban/check-availability`, {
        params: {
          nhaHang,
          ngayDat,
          gioDat,
          soLuongKhach
        }
      });
      
      return res.status(200).json(response.data);
    } catch (error) {
      logger.error(`Lỗi gọi API bàn có sẵn: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: 'Không thể kiểm tra bàn có sẵn',
        error: error.message
      });
    }
  } catch (error) {
    logger.error(`Lỗi kiểm tra bàn có sẵn: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Lỗi kiểm tra bàn có sẵn',
      error: error.message
    });
  }
};

// Tạo đặt bàn mới
exports.createThongTinDatBan = async (req, res) => {
  try {
    // Log thông tin đầu vào để debug
    console.log("Request body:", JSON.stringify(req.body));

    const {
      hoTen,
      soDienThoai,
      email,
      nhaHang,
      ban,
      ngayDat,
      gioDat,
      soLuongKhach,
      ghiChu,
      monAnDat
    } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!hoTen || !soDienThoai || !nhaHang || !ngayDat || !gioDat || !soLuongKhach) {
      console.log("Thiếu thông tin bắt buộc:", {
        hoTen, soDienThoai, nhaHang, ngayDat, gioDat, soLuongKhach
      });
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp đầy đủ thông tin đặt bàn'
      });
    }

    // Format lại ngày tháng nếu cần
    const parsedDate = new Date(ngayDat);
    if (isNaN(parsedDate.getTime())) {
      console.log("Ngày không hợp lệ:", ngayDat);
      return res.status(400).json({
        success: false,
        message: 'Ngày đặt không hợp lệ'
      });
    }

    // Tính tổng tiền
    let tongTien = 0;
    if (monAnDat && monAnDat.length > 0) {
      monAnDat.forEach(item => {
        tongTien += item.gia * item.soLuong;
      });
    }

    // Lưu thông tin người đặt nếu đã đăng nhập
    const nguoiDat = req.user ? req.user.id : null;
    console.log("User info:", nguoiDat);

    console.log("Chuẩn bị tạo đặt bàn với thông tin:", {
      hoTen, soDienThoai, email, nhaHang, ban, ngayDat, 
      gioDat, soLuongKhach, tongTien, nguoiDat
    });

    const thongTinDatBan = await ThongTinDatBan.create({
      hoTen,
      soDienThoai,
      email,
      nhaHang,
      ban,
      ngayDat: parsedDate,
      gioDat,
      soLuongKhach,
      ghiChu,
      monAnDat,
      tongTien,
      nguoiDat
    });

    console.log("Đã tạo đặt bàn thành công, ID:", thongTinDatBan._id);

    // Cập nhật trạng thái bàn nếu có chọn bàn
    if (ban) {
      try {
        const headers = req.headers.authorization ? { Authorization: req.headers.authorization } : {};
        console.log("Cập nhật trạng thái bàn:", ban);
        
        await axios.put(`${config.serviceUrls.restaurant}/api/ban/${ban}`, {
          trangThai: 'Đang sử dụng'
        }, {
          headers
        });
        console.log("Đã cập nhật trạng thái bàn thành công");
      } catch (error) {
        console.log("Lỗi cập nhật bàn:", error.message);
        logger.error(`Lỗi cập nhật trạng thái bàn: ${error.message}`);
        // Không ảnh hưởng đến việc đặt bàn thành công
      }
    }

    res.status(201).json({
      success: true,
      message: 'Đặt bàn thành công',
      data: thongTinDatBan
    });
  } catch (error) {
    // Log chi tiết lỗi
    console.error("Chi tiết lỗi đặt bàn:", error);
    logger.error(`Lỗi tạo đặt bàn: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Lỗi tạo đặt bàn: ' + error.message,
      error: error.message
    });
  }
};

// Cập nhật trạng thái đặt bàn
exports.updateTrangThaiDatBan = async (req, res) => {
  try {
    const { trangThai } = req.body;

    if (!trangThai || !['Chờ xác nhận', 'Đã xác nhận', 'Đã hủy', 'Hoàn thành'].includes(trangThai)) {
      return res.status(400).json({
        success: false,
        message: 'Trạng thái không hợp lệ'
      });
    }

    const thongTinDatBan = await ThongTinDatBan.findById(req.params.id);
    
    if (!thongTinDatBan) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông tin đặt bàn'
      });
    }

    // Chỉ cho phép admin hoặc staff cập nhật trạng thái, người dùng chỉ được hủy đơn của mình
    if (req.user.role === 'user') {
      if (thongTinDatBan.nguoiDat && thongTinDatBan.nguoiDat.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Bạn không có quyền cập nhật đơn đặt bàn này'
        });
      }
      
      if (trangThai !== 'Đã hủy') {
        return res.status(403).json({
          success: false,
          message: 'Bạn chỉ có quyền hủy đơn đặt bàn'
        });
      }
      
      if (['Đã xác nhận', 'Hoàn thành', 'Đã hủy'].includes(thongTinDatBan.trangThai)) {
        return res.status(400).json({
          success: false,
          message: `Không thể hủy đơn đã ${thongTinDatBan.trangThai}`
        });
      }
    }

    const oldTrangThai = thongTinDatBan.trangThai;
    thongTinDatBan.trangThai = trangThai;
    const updatedThongTinDatBan = await thongTinDatBan.save();

    // Cập nhật trạng thái bàn nếu có bàn và trạng thái thay đổi
    if (thongTinDatBan.ban) {
      try {
        let banTrangThai = 'Có sẵn';
        
        if (trangThai === 'Đã xác nhận') {
          banTrangThai = 'Đang sử dụng';
        } else if (trangThai === 'Hoàn thành' || trangThai === 'Đã hủy') {
          banTrangThai = 'Có sẵn';
        }
        
        if ((oldTrangThai !== trangThai) && 
            ((oldTrangThai === 'Đã xác nhận' && ['Hoàn thành', 'Đã hủy'].includes(trangThai)) || 
             (oldTrangThai !== 'Đã xác nhận' && trangThai === 'Đã xác nhận'))) {
          await axios.put(`${config.serviceUrls.restaurant}/api/ban/${thongTinDatBan.ban}`, {
            trangThai: banTrangThai
          }, {
            headers: {
              Authorization: req.headers.authorization
            }
          });
        }
      } catch (error) {
        logger.error(`Lỗi cập nhật trạng thái bàn: ${error.message}`);
        // Không ảnh hưởng đến việc cập nhật trạng thái đặt bàn
      }
    }

    res.status(200).json({
      success: true,
      message: `Đã cập nhật trạng thái đặt bàn thành ${trangThai}`,
      data: updatedThongTinDatBan
    });
  } catch (error) {
    logger.error(`Lỗi cập nhật trạng thái đặt bàn: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Lỗi cập nhật trạng thái đặt bàn',
      error: error.message
    });
  }
};

// Cập nhật thông tin đặt bàn
exports.updateThongTinDatBan = async (req, res) => {
  try {
    const {
      hoTen,
      soDienThoai,
      email,
      ngayDat,
      gioDat,
      soLuongKhach,
      ghiChu,
      monAnDat,
      ban
    } = req.body;

    const thongTinDatBan = await ThongTinDatBan.findById(req.params.id);
    
    if (!thongTinDatBan) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông tin đặt bàn'
      });
    }

    // Kiểm tra quyền - chỉ admin hoặc chủ đơn có thể cập nhật
    if (req.user.role === 'user') {
      if (!thongTinDatBan.nguoiDat || thongTinDatBan.nguoiDat.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Bạn không có quyền cập nhật đơn đặt bàn này'
        });
      }
      
      if (thongTinDatBan.trangThai !== 'Chờ xác nhận') {
        return res.status(400).json({
          success: false,
          message: 'Chỉ có thể cập nhật đơn chờ xác nhận'
        });
      }
    }

    // Cập nhật thông tin
    if (hoTen) thongTinDatBan.hoTen = hoTen;
    if (soDienThoai) thongTinDatBan.soDienThoai = soDienThoai;
    if (email) thongTinDatBan.email = email;
    if (ngayDat) thongTinDatBan.ngayDat = ngayDat;
    if (gioDat) thongTinDatBan.gioDat = gioDat;
    if (soLuongKhach) thongTinDatBan.soLuongKhach = soLuongKhach;
    if (ghiChu !== undefined) thongTinDatBan.ghiChu = ghiChu;
    
    // Cập nhật bàn
    const oldBan = thongTinDatBan.ban;
    if (ban !== undefined) {
      thongTinDatBan.ban = ban;
    }
    
    // Cập nhật món ăn đặt
    if (monAnDat && monAnDat.length > 0) {
      thongTinDatBan.monAnDat = monAnDat;
      
      // Tính lại tổng tiền
      let tongTien = 0;
      monAnDat.forEach(item => {
        tongTien += item.gia * item.soLuong;
      });
      thongTinDatBan.tongTien = tongTien;
    }

    const updatedThongTinDatBan = await thongTinDatBan.save();

    // Cập nhật trạng thái bàn nếu có thay đổi bàn
    if (oldBan && oldBan.toString() !== ban && oldBan.toString() !== 'null' && oldBan.toString() !== 'undefined') {
      try {
        // Trả lại trạng thái "Có sẵn" cho bàn cũ
        await axios.put(`${config.serviceUrls.restaurant}/api/ban/${oldBan}`, {
          trangThai: 'Có sẵn'
        }, {
          headers: {
            Authorization: req.headers.authorization
          }
        });
      } catch (error) {
        logger.error(`Lỗi cập nhật trạng thái bàn cũ: ${error.message}`);
      }
    }

    // Cập nhật trạng thái cho bàn mới nếu có
    if (ban && ban !== oldBan && ban !== 'null' && ban !== 'undefined') {
      try {
        await axios.put(`${config.serviceUrls.restaurant}/api/ban/${ban}`, {
          trangThai: thongTinDatBan.trangThai === 'Đã xác nhận' ? 'Đang sử dụng' : 'Có sẵn'
        }, {
          headers: {
            Authorization: req.headers.authorization
          }
        });
      } catch (error) {
        logger.error(`Lỗi cập nhật trạng thái bàn mới: ${error.message}`);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Cập nhật đặt bàn thành công',
      data: updatedThongTinDatBan
    });
  } catch (error) {
    logger.error(`Lỗi cập nhật thông tin đặt bàn: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Lỗi cập nhật thông tin đặt bàn',
      error: error.message
    });
  }
};

// Xóa đặt bàn (chỉ admin)
exports.deleteThongTinDatBan = async (req, res) => {
  try {
    const thongTinDatBan = await ThongTinDatBan.findById(req.params.id);
    
    if (!thongTinDatBan) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông tin đặt bàn'
      });
    }

    // Cập nhật trạng thái bàn thành "Có sẵn" nếu có bàn
    if (thongTinDatBan.ban) {
      try {
        await axios.put(`${config.serviceUrls.restaurant}/api/ban/${thongTinDatBan.ban}`, {
          trangThai: 'Có sẵn'
        }, {
          headers: {
            Authorization: req.headers.authorization
          }
        });
      } catch (error) {
        logger.error(`Lỗi cập nhật trạng thái bàn khi xóa: ${error.message}`);
      }
    }

    await thongTinDatBan.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Xóa thông tin đặt bàn thành công'
    });
  } catch (error) {
    logger.error(`Lỗi xóa thông tin đặt bàn: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Lỗi xóa thông tin đặt bàn',
      error: error.message
    });
  }
}; 