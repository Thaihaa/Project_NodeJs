const User = require('../models/User');
const logger = require('../../../utils/logger');
const bcrypt = require('bcrypt');

// Lấy danh sách người dùng
exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const keyword = req.query.keyword
      ? {
          $or: [
            { username: { $regex: req.query.keyword, $options: 'i' } },
            { email: { $regex: req.query.keyword, $options: 'i' } },
            { fullName: { $regex: req.query.keyword, $options: 'i' } }
          ]
        }
      : {};

    const users = await User.find(keyword)
      .select('-password -refreshToken')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalUsers = await User.countDocuments(keyword);

    res.status(200).json({
      success: true,
      users,
      page,
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers
    });
  } catch (error) {
    logger.error(`Lỗi lấy danh sách người dùng: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy danh sách người dùng',
      error: error.message
    });
  }
};

// Lấy thông tin người dùng theo ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -refreshToken');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    logger.error(`Lỗi lấy thông tin người dùng: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy thông tin người dùng',
      error: error.message
    });
  }
};

// Cập nhật thông tin người dùng
exports.updateUser = async (req, res) => {
  try {
    const { fullName, phoneNumber, address, avatar } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    // Kiểm tra quyền - chỉ admin hoặc chính người dùng đó mới có thể cập nhật
    if (req.user.id !== user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền cập nhật thông tin người dùng này'
      });
    }

    // Cập nhật thông tin
    user.fullName = fullName || user.fullName;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.address = address || user.address;
    user.avatar = avatar || user.avatar;

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'Cập nhật thông tin thành công',
      user: {
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        phoneNumber: updatedUser.phoneNumber,
        address: updatedUser.address,
        avatar: updatedUser.avatar,
        role: updatedUser.role
      }
    });
  } catch (error) {
    logger.error(`Lỗi cập nhật thông tin người dùng: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Lỗi cập nhật thông tin người dùng',
      error: error.message
    });
  }
};

// Thay đổi mật khẩu
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp mật khẩu hiện tại và mật khẩu mới'
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    // Kiểm tra quyền - chỉ chính người dùng đó mới có thể đổi mật khẩu
    if (req.user.id !== user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền thay đổi mật khẩu người dùng này'
      });
    }

    // Kiểm tra mật khẩu hiện tại
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu hiện tại không chính xác'
      });
    }

    // Cập nhật mật khẩu mới
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Đổi mật khẩu thành công'
    });
  } catch (error) {
    logger.error(`Lỗi đổi mật khẩu: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Lỗi đổi mật khẩu',
      error: error.message
    });
  }
};

// Vô hiệu hóa tài khoản (chỉ admin)
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    // Đảo ngược trạng thái
    user.isActive = !user.isActive;
    await user.save();

    const statusMessage = user.isActive ? 'kích hoạt' : 'vô hiệu hóa';

    res.status(200).json({
      success: true,
      message: `Tài khoản đã được ${statusMessage}`,
      isActive: user.isActive
    });
  } catch (error) {
    logger.error(`Lỗi thay đổi trạng thái người dùng: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Lỗi thay đổi trạng thái người dùng',
      error: error.message
    });
  }
};

// Cập nhật vai trò người dùng (chỉ admin)
exports.updateRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!role || !['user', 'staff', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Vai trò không hợp lệ'
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Cập nhật vai trò thành công',
      role: user.role
    });
  } catch (error) {
    logger.error(`Lỗi cập nhật vai trò: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Lỗi cập nhật vai trò',
      error: error.message
    });
  }
};

// Nâng cấp quyền người dùng (chỉ dành cho Admin)
exports.setUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;

    // Validate dữ liệu
    if (!userId || !role) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu ID người dùng hoặc vai trò'
      });
    }

    // Kiểm tra role hợp lệ
    if (!['user', 'staff', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Vai trò không hợp lệ. Vai trò hợp lệ: user, staff, admin'
      });
    }

    // Tìm người dùng
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    // Cập nhật vai trò người dùng
    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: `Đã cập nhật vai trò của ${user.username} thành ${role}`,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật vai trò người dùng',
      error: error.message
    });
  }
};

// Tạo tài khoản Admin mới (dành cho Super Admin)
exports.createAdmin = async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body;

    // Kiểm tra xem user đã tồn tại chưa
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email hoặc tên đăng nhập đã tồn tại'
      });
    }

    // Tạo admin mới
    const newAdmin = new User({
      username,
      email,
      password,
      fullName,
      role: 'admin'
    });

    await newAdmin.save();

    res.status(201).json({
      success: true,
      message: 'Tạo tài khoản Admin thành công',
      user: {
        _id: newAdmin._id,
        username: newAdmin.username,
        email: newAdmin.email,
        fullName: newAdmin.fullName,
        role: newAdmin.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo tài khoản Admin',
      error: error.message
    });
  }
}; 