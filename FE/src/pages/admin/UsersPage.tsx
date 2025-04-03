import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Tooltip,
  Stack,
  Alert,
  Snackbar,
  SelectChangeEvent
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Refresh as RefreshIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';

// Định nghĩa loại người dùng (khác với loại User được định nghĩa toàn cục)
interface UserDisplay {
  id: number;
  username: string;
  fullName: string;
  email: string;
  role: 'admin' | 'staff' | 'user';
  status: 'active' | 'inactive';
  created: string;
  avatar: string;
}

// Định nghĩa loại form người dùng
interface UserFormData {
  id?: number;
  username: string;
  fullName: string;
  email: string;
  password: string;
  role: 'admin' | 'staff' | 'user';
  status: 'active' | 'inactive';
}

// Giả định dữ liệu người dùng
const userData: UserDisplay[] = [
  { 
    id: 1, 
    username: 'admin1', 
    fullName: 'Nguyễn Văn Admin', 
    email: 'admin1@nhahang.com', 
    role: 'admin', 
    status: 'active', 
    created: '10/05/2023',
    avatar: ''
  },
  { 
    id: 2, 
    username: 'admin2', 
    fullName: 'Trần Thị Admin', 
    email: 'admin2@nhahang.com', 
    role: 'admin', 
    status: 'active', 
    created: '15/05/2023',
    avatar: ''
  },
  { 
    id: 3, 
    username: 'staff1', 
    fullName: 'Lê Văn Staff', 
    email: 'staff1@nhahang.com', 
    role: 'staff', 
    status: 'active', 
    created: '20/05/2023',
    avatar: ''
  },
  { 
    id: 4, 
    username: 'staff2', 
    fullName: 'Phạm Thị Staff', 
    email: 'staff2@nhahang.com', 
    role: 'staff', 
    status: 'inactive', 
    created: '21/05/2023',
    avatar: ''
  },
  { 
    id: 5, 
    username: 'user1', 
    fullName: 'Hoàng Văn User', 
    email: 'user1@gmail.com', 
    role: 'user', 
    status: 'active', 
    created: '25/05/2023',
    avatar: ''
  },
  { 
    id: 6, 
    username: 'user2', 
    fullName: 'Ngô Thị User', 
    email: 'user2@gmail.com', 
    role: 'user', 
    status: 'active', 
    created: '26/05/2023',
    avatar: ''
  },
  { 
    id: 7, 
    username: 'user3', 
    fullName: 'Đỗ Văn User', 
    email: 'user3@gmail.com', 
    role: 'user', 
    status: 'inactive', 
    created: '27/05/2023',
    avatar: ''
  },
  { 
    id: 8, 
    username: 'user4', 
    fullName: 'Vũ Thị User', 
    email: 'user4@gmail.com', 
    role: 'user', 
    status: 'active', 
    created: '28/05/2023',
    avatar: ''
  },
  { 
    id: 9, 
    username: 'user5', 
    fullName: 'Nguyễn Hoàng User', 
    email: 'user5@gmail.com', 
    role: 'user', 
    status: 'inactive', 
    created: '29/05/2023',
    avatar: ''
  },
  { 
    id: 10, 
    username: 'user6', 
    fullName: 'Trần Văn User', 
    email: 'user6@gmail.com', 
    role: 'user', 
    status: 'active', 
    created: '30/05/2023',
    avatar: ''
  },
];

const UsersPage = () => {
  // State cho dữ liệu và tìm kiếm
  const [users, setUsers] = useState<UserDisplay[]>(userData);
  const [filteredUsers, setFilteredUsers] = useState<UserDisplay[]>(userData);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // State cho phân trang
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  
  // State cho modal
  const [openModal, setOpenModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserFormData>({
    username: '',
    fullName: '',
    email: '',
    password: '',
    role: 'user',
    status: 'active'
  });
  const [isEditMode, setIsEditMode] = useState(false);
  
  // State cho modal xóa
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserDisplay | null>(null);

  // State cho snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  });

  // Xử lý thay đổi trang
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Xử lý thay đổi số hàng trên mỗi trang
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Xử lý tìm kiếm
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    filterUsers(value, roleFilter, statusFilter);
  };

  // Xử lý lọc theo vai trò
  const handleRoleFilterChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    setRoleFilter(value);
    filterUsers(searchTerm, value, statusFilter);
  };

  // Xử lý lọc theo trạng thái
  const handleStatusFilterChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    setStatusFilter(value);
    filterUsers(searchTerm, roleFilter, value);
  };

  // Hàm lọc người dùng
  const filterUsers = (search: string, role: string, status: string) => {
    let filtered = users;
    
    // Lọc theo từ khóa tìm kiếm
    if (search) {
      filtered = filtered.filter(user => 
        user.username.toLowerCase().includes(search.toLowerCase()) ||
        user.fullName.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Lọc theo vai trò
    if (role !== 'all') {
      filtered = filtered.filter(user => user.role === role);
    }
    
    // Lọc theo trạng thái
    if (status !== 'all') {
      filtered = filtered.filter(user => user.status === status);
    }
    
    setFilteredUsers(filtered);
  };

  // Xử lý mở modal thêm/sửa người dùng
  const handleOpenModal = (user?: UserDisplay) => {
    if (user) {
      setCurrentUser({
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        password: '',
        role: user.role,
        status: user.status
      });
      setIsEditMode(true);
    } else {
      setCurrentUser({
        username: '',
        fullName: '',
        email: '',
        password: '',
        role: 'user',
        status: 'active'
      });
      setIsEditMode(false);
    }
    setOpenModal(true);
  };

  // Xử lý đóng modal
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // Xử lý thay đổi input trong form
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCurrentUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Xử lý thay đổi select trong form
  const handleSelectChange = (event: SelectChangeEvent) => {
    const name = event.target.name as string;
    const value = event.target.value;
    setCurrentUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Xử lý lưu người dùng
  const handleSaveUser = () => {
    // Kiểm tra dữ liệu đầu vào
    if (!currentUser.username || !currentUser.fullName || !currentUser.email || 
        (!isEditMode && !currentUser.password)) {
      setSnackbar({
        open: true,
        message: 'Vui lòng điền đầy đủ thông tin!',
        severity: 'error'
      });
      return;
    }

    if (isEditMode) {
      // Cập nhật người dùng
      const updatedUsers = users.map(user => 
        user.id === currentUser.id 
          ? {
              ...user,
              username: currentUser.username,
              fullName: currentUser.fullName,
              email: currentUser.email,
              role: currentUser.role,
              status: currentUser.status
            }
          : user
      );
      setUsers(updatedUsers);
      setFilteredUsers(
        filteredUsers.map(user => 
          user.id === currentUser.id 
            ? {
                ...user,
                username: currentUser.username,
                fullName: currentUser.fullName,
                email: currentUser.email,
                role: currentUser.role,
                status: currentUser.status
              }
            : user
        )
      );
      setSnackbar({
        open: true,
        message: 'Cập nhật người dùng thành công!',
        severity: 'success'
      });
    } else {
      // Thêm người dùng mới
      const newUser: UserDisplay = {
        id: users.length + 1,
        username: currentUser.username,
        fullName: currentUser.fullName,
        email: currentUser.email,
        role: currentUser.role,
        status: currentUser.status,
        created: new Date().toLocaleDateString('vi-VN'),
        avatar: ''
      };
      
      setUsers([...users, newUser]);
      setFilteredUsers([...filteredUsers, newUser]);
      setSnackbar({
        open: true,
        message: 'Thêm người dùng thành công!',
        severity: 'success'
      });
    }
    
    // Đóng modal sau khi lưu
    setOpenModal(false);
  };

  // Xử lý mở modal xác nhận xóa
  const handleOpenDeleteModal = (user: UserDisplay) => {
    setUserToDelete(user);
    setOpenDeleteModal(true);
  };

  // Xử lý đóng modal xác nhận xóa
  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setUserToDelete(null);
  };

  // Xử lý xóa người dùng
  const handleDeleteUser = () => {
    if (userToDelete) {
      const updatedUsers = users.filter(user => user.id !== userToDelete.id);
      setUsers(updatedUsers);
      setFilteredUsers(filteredUsers.filter(user => user.id !== userToDelete.id));
      
      setSnackbar({
        open: true,
        message: 'Xóa người dùng thành công!',
        severity: 'success'
      });
      
      // Đóng modal xác nhận xóa
      handleCloseDeleteModal();
    }
  };

  // Xử lý thay đổi trạng thái người dùng
  const handleToggleStatus = (user: UserDisplay) => {
    const newStatus = user.status === 'active' ? 'inactive' as const : 'active' as const;
    const updatedUsers = users.map(u => 
      u.id === user.id ? { ...u, status: newStatus } : u
    );
    
    setUsers(updatedUsers);
    setFilteredUsers(
      filteredUsers.map(u => 
        u.id === user.id ? { ...u, status: newStatus } : u
      )
    );
    
    setSnackbar({
      open: true,
      message: `Người dùng đã được ${newStatus === 'active' ? 'kích hoạt' : 'vô hiệu hóa'}!`,
      severity: 'success'
    });
  };

  // Xử lý đóng snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Quản lý người dùng
      </Typography>

      {/* Thanh công cụ */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2 }}>
          {/* Tìm kiếm */}
          <TextField
            label="Tìm kiếm"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearch}
            sx={{ flexGrow: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          
          {/* Lọc theo vai trò */}
          <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="role-filter-label">Vai trò</InputLabel>
            <Select
              labelId="role-filter-label"
              id="role-filter"
              value={roleFilter}
              onChange={handleRoleFilterChange}
              label="Vai trò"
              startAdornment={<FilterListIcon sx={{ mr: 0.5 }} />}
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="staff">Nhân viên</MenuItem>
              <MenuItem value="user">Người dùng</MenuItem>
            </Select>
          </FormControl>
          
          {/* Lọc theo trạng thái */}
          <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="status-filter-label">Trạng thái</InputLabel>
            <Select
              labelId="status-filter-label"
              id="status-filter"
              value={statusFilter}
              onChange={handleStatusFilterChange}
              label="Trạng thái"
              startAdornment={<FilterListIcon sx={{ mr: 0.5 }} />}
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="active">Hoạt động</MenuItem>
              <MenuItem value="inactive">Vô hiệu</MenuItem>
            </Select>
          </FormControl>
          
          {/* Nút làm mới */}
          <Tooltip title="Làm mới danh sách">
            <IconButton onClick={() => {
              setSearchTerm('');
              setRoleFilter('all');
              setStatusFilter('all');
              setFilteredUsers(users);
            }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          
          {/* Nút thêm người dùng */}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenModal()}
          >
            Thêm người dùng
          </Button>
        </Box>
      </Paper>

      {/* Bảng người dùng */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Tên đăng nhập</TableCell>
                <TableCell>Tên đầy đủ</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Vai trò</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          sx={{ width: 30, height: 30, mr: 1, bgcolor: 
                            user.role === 'admin' 
                              ? 'primary.main' 
                              : user.role === 'staff' 
                                ? 'success.main' 
                                : 'grey.500' 
                          }}
                        >
                          {user.fullName.charAt(0)}
                        </Avatar>
                        {user.username}
                      </Box>
                    </TableCell>
                    <TableCell>{user.fullName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip 
                        label={
                          user.role === 'admin' 
                            ? 'Admin' 
                            : user.role === 'staff' 
                              ? 'Nhân viên' 
                              : 'Người dùng'
                        } 
                        size="small"
                        color={
                          user.role === 'admin' 
                            ? 'primary' 
                            : user.role === 'staff' 
                              ? 'success' 
                              : 'default'
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={user.status === 'active' ? 'Hoạt động' : 'Vô hiệu'} 
                        size="small"
                        color={user.status === 'active' ? 'success' : 'error'}
                      />
                    </TableCell>
                    <TableCell>{user.created}</TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Tooltip title="Chỉnh sửa">
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleOpenModal(user)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={user.status === 'active' ? 'Vô hiệu hóa' : 'Kích hoạt'}>
                          <IconButton 
                            size="small" 
                            color={user.status === 'active' ? 'error' : 'success'}
                            onClick={() => handleToggleStatus(user)}
                          >
                            {user.status === 'active' 
                              ? <BlockIcon fontSize="small" /> 
                              : <CheckCircleIcon fontSize="small" />
                            }
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa">
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleOpenDeleteModal(user)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    Không tìm thấy người dùng nào
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số hàng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} của ${count}`}
        />
      </Paper>

      {/* Modal thêm/sửa người dùng */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>
          {isEditMode ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              margin="dense"
              label="Tên đăng nhập"
              name="username"
              fullWidth
              variant="outlined"
              value={currentUser.username}
              onChange={handleInputChange}
              required
            />
            <TextField
              margin="dense"
              label="Tên đầy đủ"
              name="fullName"
              fullWidth
              variant="outlined"
              value={currentUser.fullName}
              onChange={handleInputChange}
              required
            />
            <TextField
              margin="dense"
              label="Email"
              name="email"
              type="email"
              fullWidth
              variant="outlined"
              value={currentUser.email}
              onChange={handleInputChange}
              required
            />
            {!isEditMode && (
              <TextField
                margin="dense"
                label="Mật khẩu"
                name="password"
                type="password"
                fullWidth
                variant="outlined"
                value={currentUser.password}
                onChange={handleInputChange}
                required
              />
            )}
            <FormControl fullWidth margin="dense">
              <InputLabel id="role-label">Vai trò</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                name="role"
                value={currentUser.role}
                label="Vai trò"
                onChange={handleSelectChange}
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="staff">Nhân viên</MenuItem>
                <MenuItem value="user">Người dùng</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense">
              <InputLabel id="status-label">Trạng thái</InputLabel>
              <Select
                labelId="status-label"
                id="status"
                name="status"
                value={currentUser.status}
                label="Trạng thái"
                onChange={handleSelectChange}
              >
                <MenuItem value="active">Hoạt động</MenuItem>
                <MenuItem value="inactive">Vô hiệu</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Hủy</Button>
          <Button 
            onClick={handleSaveUser} 
            variant="contained" 
            color="primary"
          >
            {isEditMode ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal xác nhận xóa */}
      <Dialog open={openDeleteModal} onClose={handleCloseDeleteModal}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa người dùng 
            <Typography component="span" fontWeight="bold" color="error">
              {" "}{userToDelete?.username}{" "}
            </Typography>
            không? Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteModal}>Hủy</Button>
          <Button 
            onClick={handleDeleteUser} 
            variant="contained" 
            color="error"
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar thông báo */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UsersPage; 