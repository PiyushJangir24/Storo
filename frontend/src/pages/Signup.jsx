import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../api';

function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      // Default role is 'user'
      const response = await authAPI.register(form.name, form.email, form.password, 'user');

      // Save token and user data to localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      navigate('/'); // Redirect to home page
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message || 'Registration failed. Please try again.');
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
        color: "#1a1a1a"
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-lg border-0 p-5" style={{ borderRadius: '1.5rem', border: '1px solid #e5e7eb', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.12)' }}>
              <div className="text-center mb-4">
                <span className="display-4 mb-3 d-block">✈️</span>
                <h2 className="fw-bold" style={{ color: "#1a1a1a", fontFamily: "'Inter', sans-serif" }}>Join Storo</h2>
                <p className="text-muted" style={{ color: "#6b7280" }}>Create your account and start storing with confidence.</p>
              </div>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-bold">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control form-control-lg"
                    placeholder="Your name"
                    value={form.name}
                    onChange={handleChange}
                    autoComplete="name"
                    required
                  />
                </div>
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
                    placeholder="Password (min 6 characters)"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    minLength={6}
                    required
                  />
                  <small className="text-muted">Password must be at least 6 characters long</small>
                </div>
                <button
                  type="submit"
                  className="btn w-100 btn-lg fw-bold"
                  disabled={loading}
                  style={{
                    borderRadius: '0.75rem',
                    backgroundColor: '#047857',
                    color: '#fff',
                    border: 'none'
                  }}
                >
                  {loading ? 'Creating account...' : 'Sign Up'}
                </button>
              </form>

              <div className="text-center mt-4">
                <p className="text-muted" style={{ color: '#6b7280' }}>
                  Already have an account?{' '}
                  <Link to="/login" className="fw-bold text-decoration-none" style={{ color: '#047857' }}>
                    Login here
                  </Link>
                </p>
              </div>

              <div className="text-center mt-2">
                <Link to="/become-partner" className="text-decoration-none small" style={{ color: '#6b7280' }}>
                  Want to become a partner? <span className="fw-bold" style={{ color: '#8b3d88' }}>Join Us</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;

