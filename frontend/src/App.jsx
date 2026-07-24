import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Lenis from 'lenis';

import { ProtectedRoute } from './routes/ProtectedRoute';
import { RoleRoute } from './routes/RoleRoute';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import VendorSwitchModal from './components/VendorSwitchModal';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// Customer Pages
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderSuccess from './pages/OrderSuccess';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Dashboards
import VendorDashboard from './pages/Vendor';
import AdminDashboard from './pages/Admin';

function AppContent() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/vendor') || location.pathname.startsWith('/admin');

  return (
    <>
      {!isDashboard && <Navbar />}
      <VendorSwitchModal />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Customer Routes */}
          {/* Products is now embedded in Home page (SPA) */}
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route 
            path="/cart" 
            element={<ProtectedRoute><Cart /></ProtectedRoute>} 
          />
          <Route 
            path="/checkout" 
            element={<ProtectedRoute><Checkout /></ProtectedRoute>} 
          />
          <Route 
            path="/orders" 
            element={<ProtectedRoute><Orders /></ProtectedRoute>} 
          />
          <Route 
            path="/order-success" 
            element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} 
          />
          <Route 
            path="/profile" 
            element={<ProtectedRoute><Profile /></ProtectedRoute>} 
          />

          {/* Vendor Routes */}
          <Route 
            path="/vendor/*" 
            element={
              <RoleRoute allowedRoles={['vendor']}>
                <VendorDashboard />
              </RoleRoute>
            } 
          />

          {/* Admin Routes */}
          <Route 
            path="/admin/*" 
            element={
              <RoleRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </RoleRoute>
            } 
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isDashboard && <Footer />}
    </>
  );
}

function App() {
  // Initialize smooth scrolling with Lenis
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <div className="flex flex-col min-h-screen">
        <AppContent />
      </div>
    </BrowserRouter>
  );
}

export default App;
