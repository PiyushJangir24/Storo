import React from 'react';
import { Link } from 'react-router-dom';

function AboutUs() {
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
        <div className="row justify-content-center align-items-center mb-5">
          <div className="col-lg-8 text-center">
            {/* <span className="display-1 d-block mb-3">🌍</span> */}
            <h1 className="display-4 fw-bold mb-4" style={{ color: "#1a1a1a", fontFamily: "'Inter', sans-serif" }}>
              Reimagining Travel Freedom
            </h1>
            <p className="lead text-secondary mb-5" style={{ fontSize: "1.25rem", lineHeight: "1.8" }}>
              Storo is building the world's largest network of secure, on-demand luggage storage.
              We partner with trusted hotels to give travelers the freedom to explore without the baggage.
            </p>
          </div>
        </div>

        <div className="row g-5 mb-5">
          <div className="col-md-4 text-center">
            <div className="p-4 h-100 bg-white shadow-sm rounded-4 border">
              <div className="fs-1 mb-3">🛡️</div>
              <h3 className="fw-bold mb-3" style={{ color: "#1a202c" }}>Safety First</h3>
              <p className="text-muted">Every partner is vetted, and every bag is insured up to ₹10,000. Security is our obsession.</p>
            </div>
          </div>
          <div className="col-md-4 text-center">
            <div className="p-4 h-100 bg-white shadow-sm rounded-4 border">
              <div className="fs-1 mb-3">⚡</div>
              <h3 className="fw-bold mb-3" style={{ color: "#1a202c" }}>Instant Booking</h3>
              <p className="text-muted">No calls, no forms. Book in 2 clicks and get instant directions to your storage spot.</p>
            </div>
          </div>
          <div className="col-md-4 text-center">
            <div className="p-4 h-100 bg-white shadow-sm rounded-4 border">
              <div className="fs-1 mb-3">🤝</div>
              <h3 className="fw-bold mb-3" style={{ color: "#1a202c" }}>Local Partners</h3>
              <p className="text-muted">We support local businesses and hotels by connecting them with global travelers.</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-5">
          <h3 className="fw-bold mb-4">Ready to lighten your load?</h3>
          <Link to="/find-storage" className="btn btn-primary btn-lg px-5 py-3 fw-bold rounded-pill shadow-sm">
            Find Storage Nearby
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;

