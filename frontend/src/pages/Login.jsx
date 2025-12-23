import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../api';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginType, setLoginType] = useState('user'); // 'user' or 'partner'
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(form.email, form.password);

      // Check if role matches login type
      if (loginType === 'partner' && response.user.role !== 'partner') {
        throw new Error('This account is not authorized as a partner.');
      }

      // Save token and user data to localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      // Redirect based on role
      if (response.user.role === 'partner') {
        navigate('/partner-dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container-fluid py-5"
      style={{
        backgroundColor: "#ffffff",
        minHeight: '90vh',
        color: "#1a1a1a",
        position: "relative"
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-lg border-0 p-5" style={{ borderRadius: '1.5rem', border: '1px solid #e5e7eb', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.12)' }}>
              <div className="text-center mb-4">
                <span className="display-4 mb-3 d-block">
                  {loginType === 'user' ? '🧳' : '🏨'}
                </span>
                <h2 className="fw-bold" style={{ color: "#1a1a1a", fontFamily: "'Inter', sans-serif" }}>
                  {loginType === 'user' ? 'Welcome Back' : 'Partner Login'}
                </h2>
                <p className="text-muted" style={{ color: "#6b7280" }}>
                  {loginType === 'user'
                    ? 'Login to access your Storo account'
                    : 'Manage your bookings and earnings'}
                </p>

                {/* Login Type Toggle */}
                <div className="btn-group w-100 mb-3" role="group">
                  <button
                    type="button"
                    className="btn btn-lg"
                    style={{
                      backgroundColor: loginType === 'user' ? '#047857' : 'transparent',
                      color: loginType === 'user' ? '#fff' : '#047857',
                      border: '1px solid #047857',
                      fontWeight: '600'
                    }}
                    onClick={() => setLoginType('user')}
                  >
                    User Login
                  </button>
                  <button
                    type="button"
                    className="btn btn-lg"
                    style={{
                      backgroundColor: loginType === 'partner' ? '#047857' : 'transparent',
                      color: loginType === 'partner' ? '#fff' : '#047857',
                      border: '1px solid #047857',
                      fontWeight: '600'
                    }}
                    onClick={() => setLoginType('partner')}
                  >
                    Partner Login
                  </button>
                </div>
              </div>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-bold">Email address</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control form-control-lg"
                    placeholder="Enter email"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label fw-bold">Password</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control form-control-lg"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    required
                  />
                </div>
                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-lg fw-bold"
                    disabled={loading}
                    style={{
                      backgroundColor: '#047857',
                      color: '#fff',
                      border: 'none'
                    }}
                  >
                    {loading ? 'Logging in...' : (loginType === 'user' ? 'Login' : 'Login as Partner')}
                  </button>
                </div>
              </form>

              <div className="text-center mt-3">
                <Link to="/forgot-password" className="text-decoration-none" style={{ color: '#047857', fontWeight: '600' }}>
                  Forgot Password?
                </Link>
              </div>

              <div className="text-center mt-3">
                <span className="text-muted" style={{ color: '#6b7280' }}>Don't have an account? </span>
                <Link to="/signup" className="text-decoration-none fw-bold" style={{ color: '#047857' }}>
                  Register
                </Link>
              </div>

              {loginType === 'partner' && (
                <div className="text-center mt-2">
                  <Link to="/become-partner" className="text-decoration-none small" style={{ color: '#6b7280' }}>
                    Want to become a partner? Apply here
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

