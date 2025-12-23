import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { partnerAPI } from '../api';

function BecomePartner() {
  const [form, setForm] = useState({
    name: '',
    address: '',
    capacity: '',
    lat: '',
    lng: '',
    base: '',
    perKg: '',
    perHour: '',
    userName: '',
    userEmail: '',
    userPassword: ''
  });
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
    setLoading(true);

    // Validate required fields
    if (!form.name || !form.address || !form.capacity || !form.lat || !form.lng || !form.userName || !form.userEmail || !form.userPassword) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (form.userPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const partnerData = {
        name: form.name,
        address: form.address,
        capacity: parseInt(form.capacity),
        location: {
          type: 'Point',
          coordinates: [parseFloat(form.lng), parseFloat(form.lat)],
        },
        base: parseFloat(form.base) || 100,
        perKg: parseFloat(form.perKg) || 10,
        perHour: parseFloat(form.perHour) || 5,
        userName: form.userName,
        userEmail: form.userEmail,
        userPassword: form.userPassword
      };

      const response = await partnerAPI.createPartner(partnerData);

      // Auto-login on success
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      navigate('/partner-dashboard');

    } catch (err) {
      setError(err.message || 'Failed to submit partnership request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container-fluid py-5"
      style={{
        backgroundColor: "#ffffff",
        minHeight: "100vh",
        color: "#1a1a1a"
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-xl-6">
            <div className="bg-white shadow-sm p-5" style={{ borderRadius: '1.5rem', border: '1px solid #e5e7eb' }}>
              <div className="text-center mb-4">
                <div className="mb-3">
                  <span style={{ fontSize: "3rem" }}>🏨</span>
                </div>
                <h2 className="fw-bold mb-2" style={{ color: "#1a1a1a", fontSize: "1.75rem", fontFamily: "'Inter', sans-serif" }}>Become a Hotel Partner</h2>
                <p className="mb-4" style={{ color: "#6b7280", fontSize: "1rem", lineHeight: "1.6", maxWidth: "500px", margin: "0 auto" }}>
                  Join our network and offer secure luggage storage to thousands of travelers.
                </p>
              </div>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="text-start mt-4">
                <h5 className="fw-bold mb-3 border-bottom pb-2" style={{ color: '#1a1a1a', fontFamily: 'serif' }}>1. Account Details</h5>
                <div className="mb-3">
                  <label className="form-label fw-bold">Your Name *</label>
                  <input
                    type="text"
                    name="userName"
                    className="form-control form-control-lg"
                    placeholder="Full Name"
                    value={form.userName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Email Address *</label>
                  <input
                    type="email"
                    name="userEmail"
                    className="form-control form-control-lg"
                    placeholder="name@example.com"
                    value={form.userEmail}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label fw-bold">Password *</label>
                  <input
                    type="password"
                    name="userPassword"
                    className="form-control form-control-lg"
                    placeholder="Create a password (min 6 chars)"
                    value={form.userPassword}
                    onChange={handleChange}
                    minLength={6}
                    required
                  />
                </div>

                <h5 className="fw-bold mb-3 border-bottom pb-2 mt-5" style={{ color: '#1a1a1a', fontFamily: 'serif' }}>2. Hotel Details</h5>
                <div className="mb-4">
                  <label className="form-label fw-bold" style={{ color: "#1a202c" }}>Hotel Name *</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control form-control-lg"
                    placeholder="Your Hotel Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    style={{ borderColor: "#e5e7eb" }}
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label fw-bold" style={{ color: "#1a202c" }}>Address *</label>
                  <input
                    type="text"
                    name="address"
                    className="form-control form-control-lg"
                    placeholder="Full address"
                    value={form.address}
                    onChange={handleChange}
                    required
                    style={{ borderColor: "#e5e7eb" }}
                  />
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Latitude *</label>
                    <input
                      type="number"
                      name="lat"
                      className="form-control form-control-lg"
                      placeholder="e.g., 28.6139"
                      value={form.lat}
                      onChange={handleChange}
                      step="any"
                      required
                    />
                    <small className="text-muted">Get coordinates from Google Maps</small>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Longitude *</label>
                    <input
                      type="number"
                      name="lng"
                      className="form-control form-control-lg"
                      placeholder="e.g., 77.2090"
                      value={form.lng}
                      onChange={handleChange}
                      step="any"
                      required
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Storage Capacity *</label>
                  <input
                    type="number"
                    name="capacity"
                    className="form-control form-control-lg"
                    placeholder="How many bags can you store?"
                    value={form.capacity}
                    min={1}
                    step={1}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-bold">Base Price (₹)</label>
                    <input
                      type="number"
                      name="base"
                      className="form-control form-control-lg"
                      placeholder="100"
                      value={form.base}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                    />
                    <small className="text-muted">Default: ₹100</small>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-bold">Per Kg (₹)</label>
                    <input
                      type="number"
                      name="perKg"
                      className="form-control form-control-lg"
                      placeholder="10"
                      value={form.perKg}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                    />
                    <small className="text-muted">Default: ₹10</small>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-bold">Per Hour (₹)</label>
                    <input
                      type="number"
                      name="perHour"
                      className="form-control form-control-lg"
                      placeholder="5"
                      value={form.perHour}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                    />
                    <small className="text-muted">Default: ₹5</small>
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn w-100 py-3 mt-3 fw-bold btn-lg"
                  disabled={loading}
                  style={{
                    borderRadius: '0.75rem',
                    backgroundColor: '#047857',
                    color: 'white',
                    border: 'none'
                  }}
                >
                  {loading ? 'Creating Account...' : 'Register & Join Network'}
                </button>
              </form>
              <div className="mt-4 small text-center" style={{ color: "#6b7280" }}>
                <span role="img" aria-label="chat">💬</span> Already have an account? <Link to="/login" style={{ color: '#1a1a1a', fontWeight: '600' }}>Login here</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BecomePartner;

