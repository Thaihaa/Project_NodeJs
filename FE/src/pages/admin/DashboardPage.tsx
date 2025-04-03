import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Paper,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  LinearProgress,
  useTheme
} from '@mui/material';
import {
  PeopleAlt as PeopleAltIcon,
  Restaurant as RestaurantIcon,
  ShoppingCart as ShoppingCartIcon,
  TableRestaurant as TableRestaurantIcon,
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon,
  EventAvailable as EventAvailableIcon
} from '@mui/icons-material';

const DashboardPage: React.FC = () => {
  const theme = useTheme();

  // Thống kê đơn giản
  const statsData = [
    {
      title: 'Người dùng',
      value: '1,254',
      icon: <PeopleAltIcon />,
      color: theme.palette.primary.main,
      increase: '+5.3%'
    },
    {
      title: 'Đơn hàng',
      value: '432',
      icon: <ShoppingCartIcon />,
      color: theme.palette.success.main,
      increase: '+10.2%'
    },
    {
      title: 'Đặt bàn',
      value: '89',
      icon: <TableRestaurantIcon />,
      color: theme.palette.warning.main,
      increase: '+2.5%'
    },
    {
      title: 'Doanh thu',
      value: '64.5M VNĐ',
      icon: <TrendingUpIcon />,
      color: theme.palette.error.main,
      increase: '+15.7%'
    }
  ];

  // Dữ liệu đơn hàng gần đây
  const recentOrders = [
    { id: 'ORD-1234', customer: 'Nguyễn Văn A', time: '10:30 AM', total: '250.000đ', status: 'Hoàn thành' },
    { id: 'ORD-1235', customer: 'Trần Thị B', time: '11:15 AM', total: '320.000đ', status: 'Đang xử lý' },
    { id: 'ORD-1236', customer: 'Lê Văn C', time: '12:45 PM', total: '180.000đ', status: 'Hoàn thành' },
    { id: 'ORD-1237', customer: 'Phạm Thị D', time: '2:30 PM', total: '420.000đ', status: 'Chờ thanh toán' }
  ];

  // Dữ liệu đặt bàn gần đây
  const recentReservations = [
    { id: 'RES-1234', customer: 'Nguyễn Văn E', time: '17:30', date: '10/06/2023', guests: 4, status: 'Xác nhận' },
    { id: 'RES-1235', customer: 'Trần Thị F', time: '19:00', date: '10/06/2023', guests: 2, status: 'Chờ xác nhận' },
    { id: 'RES-1236', customer: 'Lê Văn G', time: '18:15', date: '11/06/2023', guests: 6, status: 'Xác nhận' },
    { id: 'RES-1237', customer: 'Phạm Thị H', time: '20:30', date: '11/06/2023', guests: 3, status: 'Hủy' }
  ];

  // Dữ liệu phổ biến món ăn
  const popularItems = [
    { name: 'Bún chả', count: 45, percent: 90 },
    { name: 'Phở bò', count: 38, percent: 76 },
    { name: 'Cơm tấm sườn', count: 32, percent: 64 },
    { name: 'Bánh mì thịt', count: 29, percent: 58 },
    { name: 'Gỏi cuốn', count: 25, percent: 50 }
  ];

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Tổng quan hệ thống
      </Typography>

      {/* Thống kê đơn giản */}
      <Grid container spacing={3} mb={4}>
        {statsData.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              sx={{
                height: '100%',
                display: 'flex',
                position: 'relative',
                overflow: 'hidden',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  height: '100%',
                  width: '5px',
                  backgroundColor: stat.color
                }
              }}
            >
              <CardContent sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      {stat.increase}
                    </Typography>
                  </Box>
                  <Avatar
                    sx={{
                      backgroundColor: `${stat.color}20`,
                      color: stat.color,
                      width: 56,
                      height: 56
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Đơn hàng gần đây */}
        <Grid item xs={12} md={6} mb={4}>
          <Paper sx={{ height: '100%', p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ShoppingCartIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
              <Typography variant="h6" fontWeight="bold">
                Đơn hàng gần đây
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List sx={{ width: '100%' }}>
              {recentOrders.map((order, index) => (
                <React.Fragment key={order.id}>
                  <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ backgroundColor: theme.palette.primary.light }}>
                        <AssignmentIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {order.id}
                          </Typography>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {order.total}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <React.Fragment>
                          <Typography variant="body2" component="span">
                            {order.customer}
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                            <Typography variant="caption" color="text.secondary">
                              {order.time}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                color: order.status === 'Hoàn thành' 
                                  ? 'success.main' 
                                  : order.status === 'Đang xử lý' 
                                    ? 'info.main' 
                                    : 'warning.main'
                              }}
                            >
                              {order.status}
                            </Typography>
                          </Box>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                  {index < recentOrders.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Đặt bàn gần đây */}
        <Grid item xs={12} md={6} mb={4}>
          <Paper sx={{ height: '100%', p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TableRestaurantIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
              <Typography variant="h6" fontWeight="bold">
                Đặt bàn gần đây
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List sx={{ width: '100%' }}>
              {recentReservations.map((reservation, index) => (
                <React.Fragment key={reservation.id}>
                  <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ backgroundColor: theme.palette.warning.light }}>
                        <EventAvailableIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {reservation.id}
                          </Typography>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {reservation.guests} khách
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <React.Fragment>
                          <Typography variant="body2" component="span">
                            {reservation.customer}
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                            <Typography variant="caption" color="text.secondary">
                              {reservation.date}, {reservation.time}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                color: reservation.status === 'Xác nhận' 
                                  ? 'success.main' 
                                  : reservation.status === 'Chờ xác nhận' 
                                    ? 'info.main' 
                                    : 'error.main'
                              }}
                            >
                              {reservation.status}
                            </Typography>
                          </Box>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                  {index < recentReservations.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Món ăn phổ biến */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <RestaurantIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
              <Typography variant="h6" fontWeight="bold">
                Món ăn phổ biến
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={2}>
              {popularItems.map((item) => (
                <Grid item xs={12} md={6} key={item.name}>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body1" fontWeight="medium">
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.count} đơn hàng
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={item.percent} 
                      sx={{ height: 8, borderRadius: 5 }} 
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage; 