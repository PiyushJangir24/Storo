import React from 'react';
import { Link } from 'react-router-dom';

function Services() {
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
        <div className="text-center mb-5">
          <span className="text-primary fw-bold text-uppercase tracking-wider">What we offer</span>
          <h2 className="display-4 fw-bold mt-2 mb-4" style={{ color: "#1a1a1a", fontFamily: "'Inter', sans-serif" }}>Our Services</h2>
          <p className="lead text-muted mx-auto" style={{ maxWidth: "700px" }}>
            More than just storage. We provide a complete ecosystem for hassle-free travel.
          </p>
        </div>

        <div className="row g-4 justify-content-center">
          {/* Service 1 */}
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm hover-shadow transition-all" style={{ borderRadius: "1.5rem" }}>
              <div className="card-body p-5 text-center">
                <div className="mb-4 d-inline-block p-3 rounded-circle bg-primary bg-opacity-10">
                  <span className="fs-1">🧳</span>
                </div>
                <h3 className="h4 fw-bold mb-3">Luggage Storage</h3>
                <p className="text-secondary mb-4">
                  Secure, hourly or daily storage at verified hotels.
                  Includes insurance, tamper-proof seals, and 24/7 support.
                </p>
                <Link to="/find-storage" className="btn btn-outline-primary rounded-pill px-4 fw-bold">
                  Book Storage
                </Link>
              </div>
            </div>
          </div>

          {/* Service 2 */}
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm hover-shadow transition-all" style={{ borderRadius: "1.5rem" }}>
              <div className="card-body p-5 text-center">
                <div className="mb-4 d-inline-block p-3 rounded-circle bg-success bg-opacity-10">
                  <span className="fs-1">🏨</span>
                </div>
                <h3 className="h4 fw-bold mb-3">Partner Network</h3>
                <p className="text-secondary mb-4">
                  For hotels and shops: Monetize your extra space.
                  Join our network to earn revenue and attract new footfall.
                </p>
                <Link to="/become-partner" className="btn btn-outline-success rounded-pill px-4 fw-bold">
                  Become a Partner
                </Link>
              </div>
            </div>
          </div>

          {/* Service 3 */}
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm hover-shadow transition-all" style={{ borderRadius: "1.5rem" }}>
              <div className="card-body p-5 text-center">
                <div className="mb-4 d-inline-block p-3 rounded-circle bg-info bg-opacity-10">
                  <span className="fs-1">🗺️</span>
                </div>
                <h3 className="h4 fw-bold mb-3">City Guides</h3>
                <p className="text-secondary mb-4">
                  Discover the best spots near your storage location.
                  Curated recommendations for food, sights, and transit.
                </p>
                <Link to="/cities" className="btn btn-outline-info rounded-pill px-4 fw-bold">
                  Explore Cities
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Services;

