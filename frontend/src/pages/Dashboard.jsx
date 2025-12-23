import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingAPI } from '../api';

function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [upcomingBookings, setUpcomingBookings] = useState([]);
    const [previousBookings, setPreviousBookings] = useState([]);
    const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' or 'previous'
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // Get user from localStorage
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (!storedUser || !token) {
            navigate('/login');
            return;
        }

        try {
            const userData = JSON.parse(storedUser);
            setUser(userData);
        } catch (err) {
            console.error('Error parsing user data:', err);
            navigate('/login');
            return;
        }

        // Fetch user bookings
        fetchBookings();
    }, [navigate]);

    const fetchBookings = async () => {
        setLoading(true);
        setError('');
        try {
            const userBookings = await bookingAPI.getUserBookings();
            setBookings(userBookings);

            // Separate bookings into upcoming and previous
            const currentDate = new Date();
            const upcoming = userBookings.filter(b => new Date(b.endAt) >= currentDate);
            const previous = userBookings.filter(b => new Date(b.endAt) < currentDate);

            setUpcomingBookings(upcoming);
            setPreviousBookings(previous);
        } catch (err) {
            setError(err.message || 'Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadgeClass = (status) => {
        if (status === 'confirmed') return 'bg-success';
        if (status === 'pending') return 'bg-warning';
        if (status === 'cancelled') return 'bg-danger';
        return 'bg-secondary';
    };

    return (
        <div
            className="container-fluid py-5"
            style={{
                background: "linear-gradient(135deg, #ffffff 0%, #f9fafb 50%, #ffffff 100%)",
                minHeight: '90vh',
                color: "#1a1a1a",
                position: "relative",
                overflow: "hidden"
            }}
        >
            {/* Funky Bold Background */}
            <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 0,
                overflow: "hidden"
            }}>
                <div style={{
                    position: "absolute",
                    top: "-20%",
                    right: "-10%",
                    width: "700px",
                    height: "700px",
                    background: "radial-gradient(circle, rgba(139, 61, 136, 0.3) 0%, rgba(139, 61, 136, 0.12) 40%, transparent 70%)",
                    borderRadius: "50%",
                    filter: "blur(80px)",
                    animation: "float 20s ease-in-out infinite"
                }}></div>

                <div style={{
                    position: "absolute",
                    bottom: "-15%",
                    left: "-10%",
                    width: "600px",
                    height: "600px",
                    background: "radial-gradient(circle, rgba(4, 120, 87, 0.25) 0%, rgba(4, 120, 87, 0.1) 40%, transparent 70%)",
                    borderRadius: "50%",
                    filter: "blur(80px)",
                    animation: "float 25s ease-in-out infinite reverse"
                }}></div>
            </div>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(50px, -50px) scale(1.15); }
                    66% { transform: translate(-30px, 30px) scale(0.85); }
                }
            `}</style>

            <div className="container" style={{ position: "relative", zIndex: 1 }}>
                {/* Header Section */}
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="card shadow-lg border-0 p-4" style={{ borderRadius: '1.5rem' }}>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h2 className="fw-bold text-primary mb-1">Welcome, {user?.name || 'User'}!</h2>
                                    <p className="text-muted mb-0">{user?.email}</p>
                                </div>
                                <button
                                    className="btn btn-outline-danger"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bookings Section with Tabs */}
                <div className="row">
                    <div className="col-12">
                        <div className="card shadow-lg border-0 p-4" style={{ borderRadius: '1.5rem' }}>
                            {/* Tab Headers */}
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div className="btn-group" role="group">
                                    <button
                                        type="button"
                                        className={`btn ${activeTab === 'upcoming' ? 'btn-primary' : 'btn-outline-primary'}`}
                                        onClick={() => setActiveTab('upcoming')}
                                    >
                                        Upcoming Bookings <span className="badge bg-light text-dark ms-2">{upcomingBookings.length}</span>
                                    </button>
                                    <button
                                        type="button"
                                        className={`btn ${activeTab === 'previous' ? 'btn-secondary' : 'btn-outline-secondary'}`}
                                        onClick={() => setActiveTab('previous')}
                                    >
                                        Previous Bookings <span className="badge bg-light text-dark ms-2">{previousBookings.length}</span>
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}

                            {loading ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <p className="mt-3 text-muted">Loading your bookings...</p>
                                </div>
                            ) : (
                                <>
                                    {/* Upcoming Bookings Tab */}
                                    {activeTab === 'upcoming' && (
                                        <>
                                            {upcomingBookings.length === 0 ? (
                                                <div className="text-center py-5">
                                                    <span className="display-1">📦</span>
                                                    <h5 className="mt-3 text-muted">No upcoming bookings</h5>
                                                    <p className="text-muted">Start by booking storage for your luggage!</p>
                                                    <button
                                                        className="btn btn-primary mt-3"
                                                        onClick={() => navigate('/find-storage')}
                                                    >
                                                        Find Storage
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="row g-4">
                                                    {upcomingBookings.map((booking) => (
                                                        <div className="col-md-6 col-lg-4" key={booking._id}>
                                                            <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: '1rem', borderLeft: '4px solid #047857' }}>
                                                                <div className="card-body">
                                                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                                                        <h6 className="fw-bold mb-0">
                                                                            {booking.partner?.name || 'Partner'}
                                                                        </h6>
                                                                        <div>
                                                                            <span className={`badge bg-success me-1`}>
                                                                                Active
                                                                            </span>
                                                                            <span className={`badge ${booking.paymentStatus === 'paid' ? 'bg-success' : 'bg-warning'}`}>
                                                                                {booking.paymentStatus === 'paid' ? 'Paid' : 'Pay Later'}
                                                                            </span>
                                                                        </div>
                                                                    </div>

                                                                    <p className="text-muted small mb-2">
                                                                        <strong>Address:</strong> {booking.partner?.address || 'N/A'}
                                                                    </p>

                                                                    <hr />

                                                                    <div className="mb-2">
                                                                        <small className="text-muted">Weight:</small>
                                                                        <p className="mb-1 fw-bold">{booking.weightKg} kg</p>
                                                                    </div>

                                                                    <div className="mb-2">
                                                                        <small className="text-muted">Start Date:</small>
                                                                        <p className="mb-1">{formatDate(booking.startAt)}</p>
                                                                    </div>

                                                                    <div className="mb-2">
                                                                        <small className="text-muted">End Date:</small>
                                                                        <p className="mb-1">{formatDate(booking.endAt)}</p>
                                                                    </div>

                                                                    <hr />

                                                                    <div className="d-flex justify-content-between align-items-center">
                                                                        <span className="text-muted">Total Price:</span>
                                                                        <span className="h5 mb-0 text-success fw-bold">₹{booking.price}</span>
                                                                    </div>

                                                                    <small className="text-muted d-block mt-2">
                                                                        Booking ID: {booking._id.slice(-8)}
                                                                    </small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    )}

                                    {/* Previous Bookings Tab */}
                                    {activeTab === 'previous' && (
                                        <>
                                            {previousBookings.length === 0 ? (
                                                <div className="text-center py-5">
                                                    <span className="display-1">📋</span>
                                                    <h5 className="mt-3 text-muted">No previous bookings</h5>
                                                    <p className="text-muted">Your completed bookings will appear here.</p>
                                                </div>
                                            ) : (
                                                <div className="row g-4">
                                                    {previousBookings.map((booking) => (
                                                        <div className="col-md-6 col-lg-4" key={booking._id}>
                                                            <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: '1rem', borderLeft: '4px solid #6b7280' }}>
                                                                <div className="card-body">
                                                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                                                        <h6 className="fw-bold mb-0">
                                                                            {booking.partner?.name || 'Partner'}
                                                                        </h6>
                                                                        <div>
                                                                            <span className={`badge bg-secondary me-1`}>
                                                                                Completed
                                                                            </span>
                                                                            <span className={`badge ${booking.paymentStatus === 'paid' ? 'bg-success' : 'bg-warning'}`}>
                                                                                {booking.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                                                                            </span>
                                                                        </div>
                                                                    </div>

                                                                    <p className="text-muted small mb-2">
                                                                        <strong>Address:</strong> {booking.partner?.address || 'N/A'}
                                                                    </p>

                                                                    <hr />

                                                                    <div className="mb-2">
                                                                        <small className="text-muted">Weight:</small>
                                                                        <p className="mb-1 fw-bold">{booking.weightKg} kg</p>
                                                                    </div>

                                                                    <div className="mb-2">
                                                                        <small className="text-muted">Start Date:</small>
                                                                        <p className="mb-1">{formatDate(booking.startAt)}</p>
                                                                    </div>

                                                                    <div className="mb-2">
                                                                        <small className="text-muted">End Date:</small>
                                                                        <p className="mb-1">{formatDate(booking.endAt)}</p>
                                                                    </div>

                                                                    <hr />

                                                                    <div className="d-flex justify-content-between align-items-center">
                                                                        <span className="text-muted">Total Price:</span>
                                                                        <span className="h5 mb-0 text-secondary fw-bold">₹{booking.price}</span>
                                                                    </div>

                                                                    <small className="text-muted d-block mt-2">
                                                                        Booking ID: {booking._id.slice(-8)}
                                                                    </small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;

