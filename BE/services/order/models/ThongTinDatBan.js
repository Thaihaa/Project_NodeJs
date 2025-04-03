const mongoose = require('mongoose');

const thongTinDatBanSchema = new mongoose.Schema(
  {
    nguoiDat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    hoTen: {
      type: String,
      required: [true, 'Họ tên người đặt là bắt buộc'],
      trim: true
    },
    soDienThoai: {
      type: String,
      required: [true, 'Số điện thoại là bắt buộc'],
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    nhaHang: {
      type: String,
      required: [true, 'Nhà hàng là bắt buộc']
    },
    ban: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ban'
    },
    ngayDat: {
      type: Date,
      required: [true, 'Ngày đặt bàn là bắt buộc']
    },
    gioDat: {
      type: String,
      required: [true, 'Giờ đặt bàn là bắt buộc']
    },
    soLuongKhach: {
      type: Number,
      required: [true, 'Số lượng khách là bắt buộc'],
      min: 1
    },
    ghiChu: {
      type: String
    },
    trangThai: {
      type: String,
      enum: ['Chờ xác nhận', 'Đã xác nhận', 'Đã hủy', 'Hoàn thành'],
      default: 'Chờ xác nhận'
    },
    monAnDat: [
      {
        monAn: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'MonAn'
        },
        soLuong: {
          type: Number,
          required: true,
          min: 1
        },
        gia: {
          type: Number,
          required: true
        },
        ghiChu: String
      }
    ],
    tongTien: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

const ThongTinDatBan = mongoose.model('ThongTinDatBan', thongTinDatBanSchema);

module.exports = ThongTinDatBan; 