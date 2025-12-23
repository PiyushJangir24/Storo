import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Services from './pages/Services';
import Cities from './pages/Cities';
// import Events from './pages/Events';
import BecomePartner from './pages/BecomePartner';
import Login from './pages/Login';
import Signup from './pages/Signup.jsx';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Booking from './pages/Booking';
import Dashboard from './pages/Dashboard';
import FindStorage from './pages/FindStorage';
import Profile from './pages/Profile';
import PartnerDashboard from './pages/PartnerDashboard';
import PaymentBilling from './pages/PaymentBilling';
import Notifications from './pages/Notifications';
import Locations from './pages/Locations';
import Support from './pages/Support';
import AdminDashboard from './pages/AdminDashboard';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about-us' element={<AboutUs />} />
          <Route path='/services' element={<Services />} />
          <Route path='/cities' element={<Cities />} />
          <Route path='/find-storage' element={<FindStorage />} />
          {/* <Route path='/events' element={<Events />} /> */}
          <Route path='/become-partner' element={<BecomePartner />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password/:token' element={<ResetPassword />} />
          <Route path='/booking' element={<ProtectedRoute><Booking /></ProtectedRoute>} />
          <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path='/partner-dashboard' element={<ProtectedRoute><PartnerDashboard /></ProtectedRoute>} />
          <Route path='/admin-dashboard' element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path='/payment-billing' element={<ProtectedRoute><PaymentBilling /></ProtectedRoute>} />
          <Route path='/notifications' element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path='/locations' element={<Locations />} />
          <Route path='/support' element={<Support />} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
