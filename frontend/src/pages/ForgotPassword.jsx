import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../api';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await authAPI.forgotPassword(email);
            setMessage(response.message);
            setEmail('');
        } catch (err) {
            setError(err.message || 'Failed to send reset email');
        } finally {
            setLoading(false);
        }
    };

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
                                <h2 className="fw-bold" style={{ color: "#1a1a1a", fontFamily: "'Inter', sans-serif" }}>Forgot Password?</h2>
                                <p className="text-muted" style={{ color: "#6b7280" }}>
                                    Enter your email and we'll send you a link to reset your password
                                </p>
                            </div>

                            {message && (
                                <div className="alert alert-success" role="alert">
                                    {message}
                                </div>
                            )}

                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="form-label fw-semibold">Email Address</label>
                                    <input
                                        type="email"
                                        className="form-control form-control-lg"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        required
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
                                                Sending...
                                            </>
                                        ) : (
                                            'Send Reset Link'
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

export default ForgotPassword;

