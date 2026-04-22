import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import ProductListing from './pages/ProductListing';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Checkout from './pages/Checkout';
import Dashboard from './pages/admin/Dashboard';
import UserDashboard from './pages/UserDashboard';
import ProductManagement from './pages/admin/ProductManagement';
import OrderManagement from './pages/admin/OrderManagement';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ProtectedRoute from './components/common/ProtectedRoute';
import UserManagement from './pages/admin/UserManagement';
import Success from './pages/Success';

function App() {
  const [showIntro, setShowIntro] = useState(() => {
    return !sessionStorage.getItem('evergreen_intro_shown');
  });

  const handleFinishIntro = () => {
    sessionStorage.setItem('evergreen_intro_shown', 'true');
    setShowIntro(false);
  };

  if (showIntro) {
    return (
      <div style={styles.introContainer}>
        <video
          autoPlay
          muted
          style={styles.introVideo}
          onEnded={handleFinishIntro}
          onClick={handleFinishIntro}
        >
          <source src="/gemini_generated_video_f4b9d69d.mp4" type="video/mp4" />
        </video>
        <button style={styles.skipButton} onClick={handleFinishIntro}>
          Skip
        </button>
      </div>
    );
  }

  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductListing />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/success" element={<Success />} />
            
            {/* User Dashboard */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<UserDashboard />} />
            </Route>

            {/* Admin Routes (Protected) */}
            <Route element={<ProtectedRoute adminOnly={true} />}>
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/admin/products" element={<ProductManagement />} />
              <Route path="/admin/orders" element={<OrderManagement />} />
              <Route path="/admin/users" element={<UserManagement />} />
            </Route>
            
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </main>
        <Footer />
        <ToastContainer position="bottom-right" theme="dark" />
      </div>
    </Router>
  );
}

const styles = {
  introContainer: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'black',
    zIndex: 9999,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  introVideo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  skipButton: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    cursor: 'pointer',
    fontSize: '16px',
  },
};

export default App;
