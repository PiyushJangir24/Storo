import React, { useState, useEffect } from 'react';
import { partnerAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function PartnerDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [upcomingBookings, setUpcomingBookings] = useState([]);
    const [previousBookings, setPreviousBookings] = useState([]);
    const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' or 'previous'
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('month'); // day, week, month, year, custom
    const [customDate, setCustomDate] = useState({ start: '', end: '' });

    useEffect(() => {
        if (user && user.role !== 'partner') {
            navigate('/dashboard');
            return;
        }
        fetchData();
    }, [filter, customDate.end]); // Fetch when filter or custom date changes

    const fetchData = async () => {
        try {
            setLoading(true);
            let startDate, endDate;

            if (filter === 'custom' && customDate.start && customDate.end) {
                startDate = customDate.start;
                endDate = customDate.end;
            }

            const [statsData, bookingsData] = await Promise.all([
                partnerAPI.getStats(startDate, endDate),
                partnerAPI.getBookings(filter, startDate, endDate)
            ]);

            setStats(statsData);
            setBookings(bookingsData);

            // Separate bookings into upcoming and previous
            const currentDate = new Date();
            const upcoming = bookingsData.filter(b => new Date(b.endAt) >= currentDate);
            const previous = bookingsData.filter(b => new Date(b.endAt) < currentDate);

            setUpcomingBookings(upcoming);
            setPreviousBookings(previous);
        } catch (error) {
            console.error('Error fetching partner data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        if (newFilter !== 'custom') {
            setCustomDate({ start: '', end: '' });
        }
    };

    if (loading && !stats) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid min-vh-100 py-4" style={{
            background: "linear-gradient(135deg, #ffffff 0%, #f9fafb 50%, #ffffff 100%)",
            color: "#1a1a1a",
            position: "relative",
            overflow: "hidden"
        }}>
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
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-bold" style={{ color: "#1a1a1a", fontFamily: "'Inter', sans-serif" }}>Partner Dashboard</h2>
                        <p className="text-muted mb-0" style={{ color: "#6b7280" }}>Welcome back, {user?.name}</p>
                    </div>
                    <div className="d-flex gap-2">
                        <button className="btn btn-outline-danger" onClick={() => { logout(); navigate('/login'); }}>
                            Logout
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="card border-0 shadow-sm mb-4">
                    <div className="card-body">
                        <div className="d-flex flex-wrap gap-2 align-items-center">
                            <span className="fw-bold me-2">Filter by:</span>
                            {['day', 'week', 'month', 'year'].map((f) => (
                                <button
                                    key={f}
                                    className={`btn ${filter === f ? 'btn-primary' : 'btn-outline-secondary'}`}
                                    onClick={() => handleFilterChange(f)}
                                >
                                    Last {f.charAt(0).toUpperCase() + f.slice(1)}
                                </button>
                            ))}
                            <button
                                className={`btn ${filter === 'custom' ? 'btn-primary' : 'btn-outline-secondary'}`}
                                onClick={() => handleFilterChange('custom')}
                            >
                                Custom Date
                            </button>

                            {filter === 'custom' && (
                                <div className="d-flex gap-2 ms-2">
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={customDate.start}
                                        onChange={(e) => setCustomDate({ ...customDate, start: e.target.value })}
                                    />
                                    <span className="align-self-center">-</span>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={customDate.end}
                                        onChange={(e) => setCustomDate({ ...customDate, end: e.target.value })}
                                    />
                                    <button className="btn btn-sm btn-primary" onClick={fetchData}>Apply</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="row g-4 mb-4">
                    <div className="col-md-3">
                        <div className="card border-0 shadow-sm h-100 bg-primary text-white">
                            <div className="card-body">
                                <h6 className="card-title opacity-75">Total Earnings</h6>
                                <h2 className="fw-bold mb-0">₹{stats?.totalEarnings?.toLocaleString() || 0}</h2>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card border-0 shadow-sm h-100 bg-success text-white">
                            <div className="card-body">
                                <h6 className="card-title opacity-75">Total Bookings</h6>
                                <h2 className="fw-bold mb-0">{stats?.totalBookings || 0}</h2>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body">
                                <h6 className="card-title text-muted">Paid Bookings</h6>
                                <h2 className="fw-bold mb-0 text-success">{stats?.paidBookings || 0}</h2>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body">
                                <h6 className="card-title text-muted">Avg. Booking Value</h6>
                                <h2 className="fw-bold mb-0 text-primary">₹{Math.round(stats?.averageBookingValue || 0)}</h2>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bookings Table with Tabs */}
                <div className="card border-0 shadow-sm">
                    <div className="card-header bg-white py-3">
                        <div className="d-flex justify-content-between align-items-center">
                            <h5 className="mb-0 fw-bold">Bookings</h5>
                            <div className="btn-group" role="group">
                                <button
                                    type="button"
                                    className={`btn btn-sm ${activeTab === 'upcoming' ? 'btn-primary' : 'btn-outline-primary'}`}
                                    onClick={() => setActiveTab('upcoming')}
                                >
                                    Upcoming <span className="badge bg-light text-dark ms-1">{upcomingBookings.length}</span>
                                </button>
                                <button
                                    type="button"
                                    className={`btn btn-sm ${activeTab === 'previous' ? 'btn-secondary' : 'btn-outline-secondary'}`}
                                    onClick={() => setActiveTab('previous')}
                                >
                                    Previous <span className="badge bg-light text-dark ms-1">{previousBookings.length}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th>Booking ID</th>
                                    <th>Customer</th>
                                    <th>Date</th>
                                    <th>Duration</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Payment</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activeTab === 'upcoming' ? (
                                    upcomingBookings.length > 0 ? (
                                        upcomingBookings.map((booking) => (
                                            <tr key={booking._id} style={{ borderLeft: '3px solid #047857' }}>
                                                <td><span className="badge bg-light text-dark border">#{booking._id.slice(-6).toUpperCase()}</span></td>
                                                <td>
                                                    <div className="fw-bold">{booking.user?.name || 'Guest'}</div>
                                                    <div className="small text-muted">{booking.user?.phone || 'N/A'}</div>
                                                </td>
                                                <td>{new Date(booking.createdAt).toLocaleDateString()}</td>
                                                <td>
                                                    {new Date(booking.startAt).toLocaleDateString()} - {new Date(booking.endAt).toLocaleDateString()}
                                                </td>
                                                <td className="fw-bold">₹{booking.price}</td>
                                                <td>
                                                    <span className="badge bg-success">
                                                        ACTIVE
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`badge bg-${booking.paymentStatus === 'paid' ? 'success' : 'warning'}`}>
                                                        {booking.paymentStatus === 'paid' ? 'PAID' : 'PENDING'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="text-center py-5 text-muted">
                                                No upcoming bookings
                                            </td>
                                        </tr>
                                    )
                                ) : (
                                    previousBookings.length > 0 ? (
                                        previousBookings.map((booking) => (
                                            <tr key={booking._id} style={{ borderLeft: '3px solid #6b7280' }}>
                                                <td><span className="badge bg-light text-dark border">#{booking._id.slice(-6).toUpperCase()}</span></td>
                                                <td>
                                                    <div className="fw-bold">{booking.user?.name || 'Guest'}</div>
                                                    <div className="small text-muted">{booking.user?.phone || 'N/A'}</div>
                                                </td>
                                                <td>{new Date(booking.createdAt).toLocaleDateString()}</td>
                                                <td>
                                                    {new Date(booking.startAt).toLocaleDateString()} - {new Date(booking.endAt).toLocaleDateString()}
                                                </td>
                                                <td className="fw-bold">₹{booking.price}</td>
                                                <td>
                                                    <span className="badge bg-secondary">
                                                        COMPLETED
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`badge bg-${booking.paymentStatus === 'paid' ? 'success' : 'warning'}`}>
                                                        {booking.paymentStatus === 'paid' ? 'PAID' : 'PENDING'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="text-center py-5 text-muted">
                                                No previous bookings
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PartnerDashboard;

