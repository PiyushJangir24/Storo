import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { partnerAPI } from '../api';

function Cities() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const cities = [
    { name: "Delhi", emoji: "🕌", gradient: "linear-gradient(135deg,#FFD6E0,#F3A183)", coordinates: { lat: 28.6139, lng: 77.2090 } },
    { name: "Mumbai", emoji: "🌴", gradient: "linear-gradient(135deg,#B2FEFA,#0ED2F7)", coordinates: { lat: 19.0760, lng: 72.8777 } },
    { name: "Bangalore", emoji: "🌳", gradient: "linear-gradient(135deg,#A1FFCE,#FAFFD1)", coordinates: { lat: 12.9716, lng: 77.5946 } },
    { name: "Goa", emoji: "🏖️", gradient: "linear-gradient(135deg,#FBC2EB,#A6C1EE)", coordinates: { lat: 15.2993, lng: 74.1240 } },
    { name: "Chennai", emoji: "🌅", gradient: "linear-gradient(135deg,#FDFFB6,#5BCEFA)", coordinates: { lat: 13.0827, lng: 80.2707 } },
    { name: "Kolkata", emoji: "🦚", gradient: "linear-gradient(135deg,#7DE2FC,#B9B6E5)", coordinates: { lat: 22.5726, lng: 88.3639 } },
    { name: "Jaipur", emoji: "🏰", gradient: "linear-gradient(135deg,#FFDEE9,#B5FFFC)", coordinates: { lat: 26.9124, lng: 75.7873 } },
    { name: "Hyderabad", emoji: "🌇", gradient: "linear-gradient(135deg,#D9AFD9,#97D9E1)", coordinates: { lat: 17.3850, lng: 78.4867 } }
  ];

  const handleViewPartners = async (city) => {
    setLoading(true);
    setError('');

    try {
      const partners = await partnerAPI.findNearby(
        city.coordinates.lng,
        city.coordinates.lat,
        10000 // 10km radius
      );

      if (partners.length > 0) {
        // Navigate to booking page with city info
        navigate('/booking', { state: { city: city.name, partners } });
      } else {
        setError(`No partners found in ${city.name} at the moment.`);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch partners');
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
        <h2 className="fw-bold text-center mb-5 display-6" style={{ color: "#1a1a1a", fontFamily: "'Inter', sans-serif" }}>Where You Can Find Us</h2>

        {error && (
          <div className="alert alert-warning alert-dismissible fade show" role="alert">
            {error}
            <button
              type="button"
              className="btn-close"
              onClick={() => setError('')}
              aria-label="Close"
            ></button>
          </div>
        )}

        <div className="row g-4">
          {cities.map(c => (
            <div className="col-md-6 col-lg-3" key={c.name}>
              <div
                className="card h-100 text-center shadow border-0 p-4 glass-effect city-card"
                style={{
                  borderRadius: "18px",
                  transition: "transform .15s",
                  backdropFilter: "blur(10px)",
                  background: "#ffffff80"
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
              >
                <div
                  className="d-flex align-items-center justify-content-center mb-3 mx-auto"
                  style={{
                    width: 78,
                    height: 78,
                    borderRadius: "50%",
                    background: c.gradient,
                    boxShadow: "0 2px 12px #00000020"
                  }}>
                  <span className="fs-1 text-white">{c.emoji}</span>
                </div>
                <h5 className="fw-bold">{c.name}</h5>
                <button
                  onClick={() => handleViewPartners(c)}
                  className="btn btn-outline-primary btn-sm mt-2 rounded-pill shadow-sm"
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'View Partners'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Cities;

