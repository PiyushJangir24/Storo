import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer style={{ backgroundColor: "#1a1a1a", paddingTop: "4rem", paddingBottom: "2rem", borderTop: "1px solid #2d2d2d", color: "#e5e5e5" }}>
      <div className="container">
        <div className="row g-5">
          {/* Brand Section */}
          <div className="col-lg-4 col-md-6">
            <h3 className="fw-bold mb-3" style={{ color: "#ffffff", fontFamily: "serif" }}>Storo.</h3>
            <p className="mb-4" style={{ lineHeight: "1.6", color: "#b3b3b3" }}>
              The world's most trusted luggage storage network.
              Explore freely, we'll handle the bags.
            </p>
            <div className="d-flex gap-3">
              {/* Social Icons (SVGs) */}
              <a href="#" className="transition-all" style={{ color: "#b3b3b3" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" className="transition-all" style={{ color: "#b3b3b3" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" className="transition-all" style={{ color: "#b3b3b3" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold mb-3" style={{ color: "#ffffff", fontFamily: "serif" }}>Company</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/" className="text-decoration-none hover-link" style={{ color: "#b3b3b3" }}>Home</Link></li>
              <li className="mb-2"><Link to="/about-us" className="text-decoration-none hover-link" style={{ color: "#b3b3b3" }}>About Us</Link></li>
              <li className="mb-2"><Link to="/services" className="text-decoration-none hover-link" style={{ color: "#b3b3b3" }}>Services</Link></li>
              <li className="mb-2"><Link to="/become-partner" className="text-decoration-none hover-link" style={{ color: "#b3b3b3" }}>Become a Partner</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold mb-3" style={{ color: "#ffffff", fontFamily: "serif" }}>Support</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/support" className="text-decoration-none hover-link" style={{ color: "#b3b3b3" }}>Help Center</Link></li>
              <li className="mb-2"><Link to="/locations" className="text-decoration-none hover-link" style={{ color: "#b3b3b3" }}>Locations</Link></li>
              <li className="mb-2"><a href="#" className="text-decoration-none hover-link" style={{ color: "#b3b3b3" }}>Privacy Policy</a></li>
              <li className="mb-2"><a href="#" className="text-decoration-none hover-link" style={{ color: "#b3b3b3" }}>Terms of Service</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-lg-4 col-md-6">
            <h6 className="fw-bold mb-3" style={{ color: "#ffffff", fontFamily: "serif" }}>Stay Updated</h6>
            <p className="small mb-3" style={{ color: "#b3b3b3" }}>Get travel tips and exclusive deals sent straight to your inbox.</p>
            <form className="input-group mb-3">
              <input type="email" className="form-control border-end-0" placeholder="Enter your email" aria-label="Email" style={{ borderRadius: "0.5rem 0 0 0.5rem", borderColor: "#3d3d3d", backgroundColor: "#2d2d2d", color: "#e5e5e5" }} />
              <button className="btn" type="button" style={{ borderRadius: "0 0.5rem 0.5rem 0", backgroundColor: "#047857", color: "white" }}>Subscribe</button>
            </form>
          </div>
        </div>

        <hr className="my-5" style={{ borderColor: "#2d2d2d" }} />

        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start">
            <p className="small mb-0" style={{ color: "#b3b3b3" }}>&copy; 2025 Storo Inc. All rights reserved.</p>
          </div>
          <div className="col-md-6 text-center text-md-end mt-3 mt-md-0">
            <span className="small" style={{ color: "#b3b3b3" }}>Made with ❤️ for travelers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
