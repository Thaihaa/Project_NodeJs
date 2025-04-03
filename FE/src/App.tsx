import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ReservationPage from './pages/ReservationPage';
import CartPage from './pages/CartPage';
import MenuPage from './pages/MenuPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import AdminLayout from './layouts/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import UsersPage from './pages/admin/UsersPage';
import { AdminRoute } from './components/ProtectedRoute';

// Tạo theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#d32f2f',
      light: '#ff6659',
      dark: '#9a0007',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ffc107',
      light: '#fff350',
      dark: '#c79100',
      contrastText: '#000000',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <CartProvider>
          <Router>
            <Routes>
              {/* Admin Routes */}
              <Route 
                path="/admin" 
                element={
                  <AdminRoute>
                    <AdminLayout>
                      <DashboardPage />
                    </AdminLayout>
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/users" 
                element={
                  <AdminRoute>
                    <AdminLayout>
                      <UsersPage />
                    </AdminLayout>
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/restaurants" 
                element={
                  <AdminRoute>
                    <AdminLayout>
                      <div>Quản lý nhà hàng - Đang phát triển</div>
                    </AdminLayout>
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/menu" 
                element={
                  <AdminRoute>
                    <AdminLayout>
                      <div>Quản lý thực đơn - Đang phát triển</div>
                    </AdminLayout>
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/orders" 
                element={
                  <AdminRoute>
                    <AdminLayout>
                      <div>Quản lý đơn hàng - Đang phát triển</div>
                    </AdminLayout>
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/reservations" 
                element={
                  <AdminRoute>
                    <AdminLayout>
                      <div>Quản lý đặt bàn - Đang phát triển</div>
                    </AdminLayout>
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/settings" 
                element={
                  <AdminRoute>
                    <AdminLayout>
                      <div>Cài đặt hệ thống - Đang phát triển</div>
                    </AdminLayout>
                  </AdminRoute>
                } 
              />
              
              {/* Client Routes */}
              <Route path="/" element={
                <>
                  <Header />
                  <HomePage />
                  <Footer />
                </>
              } />
              <Route path="/dat-ban" element={
                <>
                  <Header />
                  <ReservationPage />
                  <Footer />
                </>
              } />
              <Route path="/cart" element={
                <>
                  <Header />
                  <CartPage />
                  <Footer />
                </>
              } />
              <Route path="/thuc-don" element={
                <>
                  <Header />
                  <MenuPage />
                  <Footer />
                </>
              } />
              <Route path="/dang-nhap" element={
                <>
                  <Header />
                  <LoginPage />
                  <Footer />
                </>
              } />
              <Route path="/dang-ky" element={
                <>
                  <Header />
                  <RegisterPage />
                  <Footer />
                </>
              } />
              <Route path="/uu-dai" element={
                <>
                  <Header />
                  <div>Ưu Đãi</div>
                  <Footer />
                </>
              } />
              <Route path="/unauthorized" element={
                <>
                  <Header />
                  <UnauthorizedPage />
                  <Footer />
                </>
              } />
            </Routes>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
