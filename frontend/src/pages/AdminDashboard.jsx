import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../api';
import { useAuth } from '../context/AuthContext';

function AdminDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [pendingPartners, setPendingPartners] = useState([]);
    const [approvedPartners, setApprovedPartners] = useState([]);
    const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'approved'
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // Check if user is admin
        if (!user || user.role !== 'admin') {
            navigate('/');
            return;
        }
        fetchData();
    }, [user, navigate]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [statsData, pendingData, approvedData] = await Promise.all([
                adminAPI.getStats(),
                adminAPI.getPendingPartners(),
                adminAPI.getApprovedPartners()
            ]);
            setStats(statsData);
            setPendingPartners(pendingData);
            setApprovedPartners(approvedData);
        } catch (err) {
            setError(err.message || 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (partnerId) => {
        if (!window.confirm('Are you sure you want to approve this partner?')) return;

        try {
            await adminAPI.approvePartner(partnerId);
            // Refresh data
            fetchData();
        } catch (err) {
            alert(err.message || 'Failed to approve partner');
        }
    };

    const handleReject = async (partnerId) => {
        if (!window.confirm('Are you sure you want to reject and delete this partner request? This action cannot be undone.')) return;

        try {
            await adminAPI.rejectPartner(partnerId);
            // Refresh data
            fetchData();
        } catch (err) {
            alert(err.message || 'Failed to reject partner');
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
            color: "#1a1a1a"
        }}>
            <div className="container">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-bold" style={{ fontFamily: "'Inter', sans-serif" }}>Admin Dashboard</h2>
                        <p className="text-muted mb-0">Welcome back, {user?.name}</p>
                    </div>
                    <button className="btn btn-outline-danger" onClick={() => { logout(); navigate('/login'); }}>
                        Logout
                    </button>
                </div>

                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}

                {/* Stats Cards */}
                <div className="row g-4 mb-4">
                    <div className="col-md-3">
                        <div className="card border-0 shadow-sm h-100 bg-primary text-white">
                            <div className="card-body">
                                <h6 className="card-title opacity-75">Total Partners</h6>
                                <h2 className="fw-bold mb-0">{stats?.totalPartners || 0}</h2>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card border-0 shadow-sm h-100 bg-success text-white">
                            <div className="card-body">
                                <h6 className="card-title opacity-75">Approved Partners</h6>
                                <h2 className="fw-bold mb-0">{stats?.approvedPartners || 0}</h2>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card border-0 shadow-sm h-100 bg-warning text-white">
                            <div className="card-body">
                                <h6 className="card-title opacity-75">Pending Approval</h6>
                                <h2 className="fw-bold mb-0">{stats?.pendingPartners || 0}</h2>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body">
                                <h6 className="card-title text-muted">Total Users</h6>
                                <h2 className="fw-bold mb-0 text-primary">{stats?.totalUsers || 0}</h2>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Partner Requests Table */}
                <div className="card border-0 shadow-sm">
                    <div className="card-header bg-white py-3">
                        <div className="d-flex justify-content-between align-items-center">
                            <h5 className="mb-0 fw-bold">Partner Requests</h5>
                            <div className="btn-group" role="group">
                                <button
                                    type="button"
                                    className={`btn btn-sm ${activeTab === 'pending' ? 'btn-warning' : 'btn-outline-warning'}`}
                                    onClick={() => setActiveTab('pending')}
                                >
                                    Pending <span className="badge bg-light text-dark ms-1">{pendingPartners.length}</span>
                                </button>
                                <button
                                    type="button"
                                    className={`btn btn-sm ${activeTab === 'approved' ? 'btn-success' : 'btn-outline-success'}`}
                                    onClick={() => setActiveTab('approved')}
                                >
                                    Approved <span className="badge bg-light text-dark ms-1">{approvedPartners.length}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th>Partner Name</th>
                                    <th>Address</th>
                                    <th>Contact Person</th>
                                    <th>Email</th>
                                    <th>Capacity</th>
                                    <th>Pricing</th>
                                    <th>Submitted</th>
                                    {activeTab === 'pending' && <th>Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {activeTab === 'pending' ? (
                                    pendingPartners.length > 0 ? (
                                        pendingPartners.map(({ partner, user }) => (
                                            <tr key={partner._id} style={{ borderLeft: '3px solid #ffc107' }}>
                                                <td className="fw-bold">{partner.name}</td>
                                                <td>{partner.address}</td>
                                                <td>{user?.name || 'N/A'}</td>
                                                <td>{user?.email || 'N/A'}</td>
                                                <td>{partner.capacity} bags</td>
                                                <td>
                                                    <small>
                                                        Base: ₹{partner.base}<br />
                                                        Per Kg: ₹{partner.perKg}<br />
                                                        Per Hour: ₹{partner.perHour}
                                                    </small>
                                                </td>
                                                <td>{new Date(partner.createdAt).toLocaleDateString()}</td>
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-success me-2"
                                                        onClick={() => handleApprove(partner._id)}
                                                    >
                                                        ✓ Approve
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => handleReject(partner._id)}
                                                    >
                                                        ✗ Reject
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className="text-center py-5 text-muted">
                                                No pending partner requests
                                            </td>
                                        </tr>
                                    )
                                ) : (
                                    approvedPartners.length > 0 ? (
                                        approvedPartners.map(({ partner, user }) => (
                                            <tr key={partner._id} style={{ borderLeft: '3px solid #28a745' }}>
                                                <td className="fw-bold">{partner.name}</td>
                                                <td>{partner.address}</td>
                                                <td>{user?.name || 'N/A'}</td>
                                                <td>{user?.email || 'N/A'}</td>
                                                <td>{partner.capacity} bags</td>
                                                <td>
                                                    <small>
                                                        Base: ₹{partner.base}<br />
                                                        Per Kg: ₹{partner.perKg}<br />
                                                        Per Hour: ₹{partner.perHour}
                                                    </small>
                                                </td>
                                                <td>{new Date(partner.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="text-center py-5 text-muted">
                                                No approved partners yet
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

export default AdminDashboard;
