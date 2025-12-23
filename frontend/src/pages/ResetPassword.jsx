import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../api';

function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.newPassword !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.newPassword.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setLoading(true);

        try {
            await authAPI.resetPassword(token, formData.newPassword);
            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div
                className="container-fluid d-flex align-items-center justify-content-center"
                style={{
                    minHeight: '100vh',
                    backgroundColor: "#ffffff",
                    color: "#1a1a1a"
                }}
            >
                <div className="row w-100 justify-content-center">
                    <div className="col-md-5 col-lg-4">
                        <div className="card shadow-lg border-0" style={{ borderRadius: '1.5rem', border: '1px solid #e5e7eb' }}>
                            <div className="card-body p-5 text-center">
                                <div className="mb-4">
                                    <span style={{ fontSize: '4rem' }}>✅</span>
                                </div>
                                <h3 className="fw-bold mb-3" style={{ color: '#047857', fontFamily: 'serif' }}>Password Reset Successful!</h3>
                                <p className="text-muted mb-4" style={{ color: '#6b7280' }}>
                                    Your password has been reset successfully. You can now login with your new password.
                                </p>
                                <p className="text-muted" style={{ color: '#6b7280' }}>Redirecting to login page...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="container-fluid d-flex align-items-center justify-content-center"
            style={{
                minHeight: '100vh',
                backgroundColor: "#ffffff",
                color: "#1a1a1a"
            }}
        >
            <div className="row w-100 justify-content-center">
                <div className="col-md-5 col-lg-4">
                    <div className="card shadow-lg border-0" style={{ borderRadius: '1.5rem', border: '1px solid #e5e7eb' }}>
                        <div className="card-body p-5">
                            <div className="text-center mb-4">
                                <h2 className="fw-bold" style={{ color: "#1a1a1a", fontFamily: "'Inter', sans-serif" }}>Reset Password</h2>
                                <p className="text-muted" style={{ color: "#6b7280" }}>Enter your new password below</p>
                            </div>

                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">New Password</label>
                                    <input
                                        type="password"
                                        className="form-control form-control-lg"
                                        name="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        placeholder="Enter new password"
                                        required
                                        minLength="6"
                                    />
                                    <small className="text-muted">Minimum 6 characters</small>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-semibold">Confirm Password</label>
                                    <input
                                        type="password"
                                        className="form-control form-control-lg"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Confirm new password"
                                        required
                                        minLength="6"
                                    />
                                </div>

                                <div className="d-grid gap-2">
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-lg fw-bold"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Resetting...
                                            </>
                                        ) : (
                                            'Reset Password'
                                        )}
                                    </button>

                                    <Link to="/login" className="btn btn-outline-secondary btn-lg">
                                        Back to Login
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;

