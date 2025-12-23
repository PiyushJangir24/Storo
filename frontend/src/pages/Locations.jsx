import React from 'react';
import { useNavigate } from 'react-router-dom';

function Locations() {
    const navigate = useNavigate();

    const cities = [
        { name: 'Delhi', partners: 45, image: '🏛️' },
        { name: 'Mumbai', partners: 38, image: '🌆' },
        { name: 'Bangalore', partners: 32, image: '🌳' },
        { name: 'Goa', partners: 28, image: '🏖️' },
        { name: 'Jaipur', partners: 22, image: '🕌' },
        { name: 'Kolkata', partners: 20, image: '🏙️' }
    ];

    return (
        <div style={{ backgroundColor: "#ffffff", minHeight: '100vh', paddingTop: '2rem', paddingBottom: '2rem', color: "#1a1a1a" }}>
            <div className="container" style={{ maxWidth: '1000px' }}>
                <div className="text-center mb-5">
                    <div className="mb-3">
                        <span style={{ fontSize: '3.5rem' }}>📍</span>
                    </div>
                    <h2 className="fw-bold mb-2" style={{ color: '#1a1a1a', fontFamily: "'Inter', sans-serif" }}>Our Locations</h2>
                    <p style={{ color: '#6b7280' }}>Find storage partners across India</p>
                </div>

                <div className="row g-4">
                    {cities.map((city, index) => (
                        <div className="col-md-6 col-lg-4" key={index}>
                            <div
                                className="bg-white shadow-sm p-4 rounded-4 h-100 text-center"
                                style={{
                                    border: '1px solid #e5e7eb',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s, box-shadow 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '';
                                }}
                                onClick={() => navigate('/find-storage', { state: { searchQuery: city.name } })}
                            >
                                <div className="mb-3" style={{ fontSize: '3rem' }}>
                                    {city.image}
                                </div>
                                <h4 className="fw-bold mb-2" style={{ color: '#1a202c' }}>{city.name}</h4>
                                <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
                                    {city.partners} storage partners
                                </p>
                                <button
                                    className="btn btn-sm mt-2"
                                    style={{
                                        background: 'linear-gradient(135deg, #047857 0%, #065f46 100%)',
                                        color: 'white',
                                        border: 'none',
                                        padding: '0.5rem 1.5rem',
                                        borderRadius: '0.5rem'
                                    }}
                                >
                                    View Partners
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Locations;

