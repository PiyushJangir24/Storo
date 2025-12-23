import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { partnerAPI } from '../api';

function FindStorage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchLocation, setSearchLocation] = useState(location.state?.searchQuery || '');
    const [filteredPartners, setFilteredPartners] = useState([]);

    // Default location for finding all partners (Delhi coordinates)
    const defaultLocation = { lat: 28.6139, lng: 77.2090 };

    useEffect(() => {
        fetchAllPartners();
    }, []);

    const fetchAllPartners = async () => {
        setLoading(true);
        setError('');
        try {
            // Fetch partners with a large radius to get all partners
            const allPartners = await partnerAPI.findNearby(
                defaultLocation.lng,
                defaultLocation.lat,
                500000 // 500km radius to get all partners across India
            );
            setPartners(allPartners);
            setFilteredPartners(allPartners);

            // If there's a search query from navigation, filter immediately
            if (location.state?.searchQuery) {
                filterPartners(allPartners, location.state.searchQuery);
            }
        } catch (err) {
            setError(err.message || 'Failed to fetch partners');
        } finally {
            setLoading(false);
        }
    };

    const filterPartners = (partnersList, searchTerm) => {
        if (!searchTerm.trim()) {
            setFilteredPartners(partnersList);
            setError('');
            return;
        }

        const term = searchTerm.toLowerCase();
        const filtered = partnersList.filter(partner => {
            const name = partner.name.toLowerCase();
            const address = partner.address.toLowerCase();
            return name.includes(term) || address.includes(term);
        });

        setFilteredPartners(filtered);

        if (filtered.length === 0) {
            setError(`No partners found for "${searchTerm}"`);
        } else {
            setError('');
        }
    };

    const handleSearch = () => {
        filterPartners(partners, searchLocation);
    };

    const handleBookNow = (partner) => {
        navigate('/booking', { state: { partners: [partner] } });
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
                {/* Purple Gradient Blob */}
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

                {/* Green Gradient Blob */}
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

            {/* Add keyframes animation */}
            <style>{`
                @keyframes float {
                    0%, 100% {
                        transform: translate(0, 0) scale(1);
                    }
                    33% {
                        transform: translate(50px, -50px) scale(1.15);
                    }
                    66% {
                        transform: translate(-30px, 30px) scale(0.85);
                    }
                }
            `}</style>

            <div className="container" style={{ position: "relative", zIndex: 1 }}>
                {/* Header Section */}
                <div className="row mb-5">
                    <div className="col-12 text-center">
                        <h2 className="fw-bold mb-2" style={{ color: "#1a1a1a", fontSize: "2.5rem", fontFamily: "'Inter', sans-serif" }}>Find Storage Partners</h2>
                        <p style={{ color: "#6b7280" }}>Browse all available storage locations</p>
                    </div>
                </div>

                {/* Search Section */}
                <div className="row mb-5">
                    <div className="col-md-8 col-lg-6 mx-auto">
                        <div className="bg-white shadow-sm border p-3" style={{ borderRadius: '1rem', borderColor: '#e5e7eb' }}>
                            <div className="input-group input-group-lg">
                                <input
                                    type="text"
                                    className="form-control border-0"
                                    placeholder="Search by city, name or location..."
                                    value={searchLocation}
                                    onChange={(e) => setSearchLocation(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    style={{ fontSize: '1rem' }}
                                />
                                <button
                                    className="btn px-5 fw-bold"
                                    onClick={handleSearch}
                                    style={{
                                        background: 'linear-gradient(135deg, #047857 0%, #065f46 100%)',
                                        color: 'white',
                                        border: 'none'
                                    }}
                                >
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="alert alert-warning" role="alert">
                        {error}
                    </div>
                )}

                {/* Loading State */}
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-3 text-muted">Loading storage partners...</p>
                    </div>
                ) : filteredPartners.length === 0 ? (
                    <div className="text-center py-5">
                        <span className="display-1">📦</span>
                        <h5 className="mt-3 text-muted">No partners found</h5>
                        <p className="text-muted">
                            {searchLocation ? 'Try a different search term' : 'No storage partners available yet'}
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Results Count */}
                        <div className="row mb-4">
                            <div className="col-12">
                                <p style={{ color: "#6b7280" }}>
                                    Showing {filteredPartners.length} storage partner{filteredPartners.length !== 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>

                        {/* Partners Grid */}
                        <div className="row g-4">
                            {filteredPartners.map((partner) => (
                                <div className="col-md-6 col-lg-4" key={partner._id}>
                                    <div
                                        className="card h-100 bg-white shadow-sm"
                                        style={{
                                            borderRadius: '1rem',
                                            transition: 'transform 0.2s, box-shadow 0.2s',
                                            border: '1px solid #e5e7eb'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-5px)';
                                            e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '';
                                        }}
                                    >
                                        <div className="card-body p-4">
                                            {/* Partner Name */}
                                            <div className="d-flex justify-content-between align-items-start mb-3">
                                                <h5 className="fw-bold mb-0" style={{ color: "#1a1a1a" }}>{partner.name}</h5>
                                                <span className="badge" style={{ backgroundColor: "#047857", color: "white" }}>Available</span>
                                            </div>

                                            {/* Address */}
                                            <div className="mb-3">
                                                <small style={{ color: "#6b7280" }}>📍 Location</small>
                                                <p className="mb-0" style={{ color: "#1a202c" }}>{partner.address}</p>
                                            </div>

                                            <hr style={{ borderColor: "#e5e7eb" }} />

                                            {/* Details */}
                                            <div className="row mb-3">
                                                <div className="col-6">
                                                    <small style={{ color: "#6b7280" }}>Capacity</small>
                                                    <p className="mb-0 fw-bold" style={{ color: "#1a202c" }}>{partner.capacity} bags</p>
                                                </div>
                                                <div className="col-6">
                                                    <small style={{ color: "#6b7280" }}>Base Price</small>
                                                    <p className="mb-0 fw-bold" style={{ color: "#047857" }}>₹{partner.base}/day</p>
                                                </div>
                                            </div>

                                            {/* Pricing Details */}
                                            <div className="mb-3">
                                                <small style={{ color: "#6b7280" }}>Additional Charges</small>
                                                <div className="d-flex justify-content-between mt-1">
                                                    <span className="small" style={{ color: "#4a5568" }}>Per Kg: ₹{partner.perKg}</span>
                                                    <span className="small" style={{ color: "#4a5568" }}>Per Hour: ₹{partner.perHour}</span>
                                                </div>
                                            </div>

                                            {/* Book Now Button */}
                                            <button
                                                className="btn w-100 fw-bold"
                                                onClick={() => handleBookNow(partner)}
                                                style={{
                                                    backgroundColor: '#047857',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '0.75rem',
                                                    borderRadius: '0.5rem'
                                                }}
                                            >
                                                Book Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default FindStorage;

