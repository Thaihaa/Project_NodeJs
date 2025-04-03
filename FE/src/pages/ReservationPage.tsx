import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Snackbar,
  Alert,
  Paper,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { vi } from 'date-fns/locale';
import { getManwahLocations } from '../services/restaurantService';
import { createReservation } from '../services/reservationService';

const ReservationPage: React.FC = () => {
  const locations = getManwahLocations();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [formState, setFormState] = useState({
    hoTen: '',
    soDienThoai: '',
    email: '',
    nhaHang: '',
    soLuongKhach: 2,
    ghiChu: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formState.hoTen.trim()) {
      newErrors.hoTen = 'Vui lòng nhập họ tên';
    }
    
    if (!formState.soDienThoai.trim()) {
      newErrors.soDienThoai = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10}$/.test(formState.soDienThoai)) {
      newErrors.soDienThoai = 'Số điện thoại không hợp lệ';
    }
    
    if (formState.email && !/^\S+@\S+\.\S+$/.test(formState.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    if (!formState.nhaHang) {
      newErrors.nhaHang = 'Vui lòng chọn nhà hàng';
    }
    
    if (!selectedDate) {
      newErrors.ngayDat = 'Vui lòng chọn ngày đặt bàn';
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.ngayDat = 'Ngày đặt bàn phải từ hôm nay trở đi';
      }
    }
    
    if (!selectedTime) {
      newErrors.gioDat = 'Vui lòng chọn giờ đặt bàn';
    }
    
    if (formState.soLuongKhach < 1) {
      newErrors.soLuongKhach = 'Số lượng khách phải lớn hơn 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      // Format date and time
      const ngayDat = selectedDate!.toISOString().split('T')[0];
      const hours = selectedTime!.getHours().toString().padStart(2, '0');
      const minutes = selectedTime!.getMinutes().toString().padStart(2, '0');
      const gioDat = `${hours}:${minutes}`;
      
      // Prepare data
      const data = {
        ...formState,
        ngayDat,
        gioDat,
        trangThai: 'Chờ xác nhận',
      };
      
      // Call API
      await createReservation(data as any);
      
      // Show success message
      setSnackbar({
        open: true,
        message: 'Đặt bàn thành công! Chúng tôi sẽ liên hệ với bạn để xác nhận.',
        severity: 'success',
      });
      
      // Reset form
      setFormState({
        hoTen: '',
        soDienThoai: '',
        email: '',
        nhaHang: '',
        soLuongKhach: 2,
        ghiChu: '',
      });
      setSelectedDate(null);
      setSelectedTime(null);
    } catch (error) {
      // Show error message
      setSnackbar({
        open: true,
        message: 'Đã xảy ra lỗi khi đặt bàn. Vui lòng thử lại sau.',
        severity: 'error',
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ py: 6, bgcolor: '#f9f9f9' }}>
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          align="center"
          sx={{ fontWeight: 'bold', color: '#d32f2f', mb: 4 }}
        >
          Đặt bàn
        </Typography>

        <Grid container spacing={4}>
          {/* Form */}
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 4, borderRadius: '8px' }}>
              <Typography variant="h6" gutterBottom>
                Thông tin đặt bàn
              </Typography>
              
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Họ tên *"
                      name="hoTen"
                      value={formState.hoTen}
                      onChange={handleChange}
                      error={!!errors.hoTen}
                      helperText={errors.hoTen}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Số điện thoại *"
                      name="soDienThoai"
                      value={formState.soDienThoai}
                      onChange={handleChange}
                      error={!!errors.soDienThoai}
                      helperText={errors.soDienThoai}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={formState.email}
                      onChange={handleChange}
                      error={!!errors.email}
                      helperText={errors.email}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <FormControl fullWidth error={!!errors.nhaHang}>
                      <InputLabel>Chọn nhà hàng *</InputLabel>
                      <Select
                        name="nhaHang"
                        value={formState.nhaHang}
                        label="Chọn nhà hàng *"
                        onChange={handleSelectChange}
                      >
                        {locations.map((location) => (
                          <MenuItem key={location.id} value={location.id}>
                            {location.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.nhaHang && (
                        <Typography variant="caption" color="error">
                          {errors.nhaHang}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Ngày đặt bàn *"
                        value={selectedDate}
                        onChange={(newValue) => setSelectedDate(newValue)}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!errors.ngayDat,
                            helperText: errors.ngayDat
                          }
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <TimePicker
                        label="Giờ đặt bàn *"
                        value={selectedTime}
                        onChange={(newValue) => setSelectedTime(newValue)}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!errors.gioDat,
                            helperText: errors.gioDat
                          }
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Số lượng khách *"
                      name="soLuongKhach"
                      type="number"
                      InputProps={{ inputProps: { min: 1 } }}
                      value={formState.soLuongKhach}
                      onChange={handleChange}
                      error={!!errors.soLuongKhach}
                      helperText={errors.soLuongKhach}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Ghi chú"
                      name="ghiChu"
                      multiline
                      rows={4}
                      value={formState.ghiChu}
                      onChange={handleChange}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                      fullWidth
                      sx={{ 
                        py: 1.5,
                        fontSize: '1rem',
                        textTransform: 'none'
                      }}
                    >
                      Đặt bàn
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
          
          {/* Info */}
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 4, borderRadius: '8px', height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Hướng dẫn đặt bàn
              </Typography>
              
              <Typography variant="body1" paragraph>
                Để đặt bàn tại nhà hàng Manwah, vui lòng điền đầy đủ thông tin vào form bên cạnh. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận.
              </Typography>
              
              <Typography variant="body1" paragraph>
                <strong>Lưu ý:</strong>
              </Typography>
              
              <ul>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Vui lòng đặt bàn trước ít nhất 2 giờ
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Đối với nhóm trên 10 người, khuyến khích đặt trước 1 ngày
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Thời gian giữ bàn là 15 phút kể từ giờ đã đặt
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Nếu có thay đổi hoặc hủy đặt, vui lòng thông báo trước ít nhất 1 giờ
                </Typography>
              </ul>
              
              <Box sx={{ mt: 3 }}>
                <Typography variant="body1" gutterBottom>
                  <strong>Liên hệ hỗ trợ:</strong>
                </Typography>
                <Typography variant="body2">
                  Hotline: 1900 1234
                </Typography>
                <Typography variant="body2">
                  Email: info@manwah.vn
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
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

export default ReservationPage; 