import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Button,
  useTheme,
  Avatar
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SettingsIcon from '@mui/icons-material/Settings';
import { useAuth } from '../contexts/AuthContext';

const drawerWidth = 240;

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface MenuItemType {
  text: string;
  path: string;
  icon: React.ReactElement;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems: MenuItemType[] = [
    { text: 'Tổng quan', path: '/admin', icon: <DashboardIcon /> },
    { text: 'Quản lý người dùng', path: '/admin/users', icon: <PeopleIcon /> },
    { text: 'Quản lý nhà hàng', path: '/admin/restaurants', icon: <RestaurantIcon /> },
    { text: 'Quản lý thực đơn', path: '/admin/menu', icon: <RestaurantIcon /> },
    { text: 'Quản lý đơn hàng', path: '/admin/orders', icon: <ShoppingCartIcon /> },
    { text: 'Quản lý đặt bàn', path: '/admin/reservations', icon: <TableRestaurantIcon /> },
    { text: 'Cài đặt hệ thống', path: '/admin/settings', icon: <SettingsIcon /> },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/dang-nhap');
  };

  const drawer = (
    <div>
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: [1],
          py: 2,
          backgroundColor: theme.palette.primary.main
        }}
      >
        <Typography 
          variant="h6" 
          color="white" 
          fontWeight="bold"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <RestaurantIcon sx={{ mr: 1 }} /> 
          ADMIN PANEL
        </Typography>
      </Toolbar>
      <Divider />
      <Box sx={{ py: 2, px: 2, display: 'flex', alignItems: 'center' }}>
        <Avatar 
          alt={user?.fullName || 'Admin'} 
          src={user?.avatar} 
          sx={{ width: 40, height: 40, mr: 2 }}
        />
        <Box>
          <Typography variant="subtitle1" fontWeight="bold" noWrap>
            {user?.fullName || 'Admin'}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {user?.email || 'admin@nhahang.com'}
          </Typography>
        </Box>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || 
                          (item.path !== '/admin' && location.pathname.startsWith(item.path));
          
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton 
                component={Link} 
                to={item.path}
                selected={isActive}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.primary.light + '33',
                    borderRight: `4px solid ${theme.palette.primary.main}`,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.light + '33',
                    }
                  }
                }}
              >
                <ListItemIcon sx={{ 
                  color: isActive ? theme.palette.primary.main : 'inherit'
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{
                    fontWeight: isActive ? 'bold' : 'normal',
                    color: isActive ? theme.palette.primary.main : 'inherit'
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary="Đăng xuất" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Quản trị Nhà hàng
          </Typography>
          <Button 
            color="inherit" 
            startIcon={<ExitToAppIcon />}
            onClick={handleLogout}
            sx={{ display: { xs: 'none', sm: 'flex' } }}
          >
            Đăng xuất
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/"
            sx={{ ml: 2 }}
          >
            Về trang chủ
          </Button>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          backgroundColor: '#f9fafb'
        }}
      >
        <Toolbar />
        {children || <Outlet />}
      </Box>
    </Box>
  );
};

export default AdminLayout; 