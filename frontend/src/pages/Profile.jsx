import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api';

function Profile() {
    const { user, setUser } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const userData = await authAPI.getProfile();
            setFormData({
                name: userData?.name || '',
                email: userData?.email || '',
                phone: userData?.phone || '',
                address: userData?.address || ''
            });
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            setMessage({ type: '', text: '' });

            const response = await authAPI.updateProfile(
                formData.name,
                formData.phone,
                formData.address
            );

            // Update user context with new data
            if (setUser && response) {
                setUser(response);
            }

            setMessage({ type: 'success', text: 'Profile updated successfully!' });

            // Clear success message after 3 seconds
            setTimeout(() => {
                setMessage({ type: '', text: '' });
            }, 3000);
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)', minHeight: '100vh', paddingTop: '2rem', paddingBottom: '2rem' }}>
                <div className="container text-center" style={{ maxWidth: '800px', paddingTop: '5rem' }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3" style={{ color: '#6b7280' }}>Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: "#ffffff", minHeight: '100vh', paddingTop: '2rem', paddingBottom: '2rem', color: "#1a1a1a" }}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <div className="bg-white shadow-sm p-5 rounded-4" style={{ border: '1px solid #e5e7eb' }}>
                    <div className="text-center mb-4">
                        <div className="mb-3">
                            <span style={{ fontSize: '3.5rem' }}>👤</span>
                        </div>
                        <h2 className="fw-bold mb-2" style={{ color: '#1a202c' }}>Profile</h2>
                        <p style={{ color: '#6b7280' }}>Manage your personal information</p>
                    </div>

                    {message.text && (
                        <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'} mb-4`} role="alert">
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="form-label fw-bold" style={{ color: '#1a202c' }}>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                className="form-control form-control-lg"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                style={{ borderColor: '#e5e7eb' }}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-bold" style={{ color: '#1a202c' }}>Email Address</label>
                            <input
                                type="email"
                                name="email"
                                className="form-control form-control-lg"
                                value={formData.email}
                                onChange={handleChange}
                                disabled
                                style={{ borderColor: '#e5e7eb', backgroundColor: '#f9fafb' }}
                            />
                            <small style={{ color: '#6b7280' }}>Email cannot be changed</small>
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-bold" style={{ color: '#1a202c' }}>Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                className="form-control form-control-lg"
                                placeholder="+91 XXXXX XXXXX"
                                value={formData.phone}
                                onChange={handleChange}
                                style={{ borderColor: '#e5e7eb' }}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-bold" style={{ color: '#1a202c' }}>Address</label>
                            <textarea
                                name="address"
                                className="form-control form-control-lg"
                                rows="3"
                                placeholder="Your address"
                                value={formData.address}
                                onChange={handleChange}
                                style={{ borderColor: '#e5e7eb' }}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn w-100 py-3 fw-bold btn-lg"
                            disabled={saving}
                            style={{
                                background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.75rem'
                            }}
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Profile;

