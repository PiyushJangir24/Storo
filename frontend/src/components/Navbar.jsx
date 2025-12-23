import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  // State to manage the User Dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // State to manage the Mobile Hamburger Menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    setIsDropdownOpen(false); // Close menu on action
    logout();
    navigate('/');
  };

  // Helper to close menus when a link is clicked
  const closeMenus = () => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar navbar-expand-lg sticky-top" style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #e5e7eb", padding: "1rem 0", boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)" }}>
      <div className="container">
        {/* Brand */}
        <Link
          className="navbar-brand d-flex align-items-center fw-bold"
          to="/"
          style={{ color: "#0d2aabff", fontSize: "1.5rem", letterSpacing: "-0.5px" }}
          onClick={closeMenus}
        >
          <img src="https://res.cloudinary.com/dw1mz6arj/image/upload/v1764066614/luggage_irht4g.png" alt="Storo Logo" style={{ width: '30px', height: '30px', marginRight: '8px' }} />
          Storo
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Mobile Menu Collapse */}
        <div className={`collapse navbar-collapse ${isMobileMenuOpen ? 'show' : ''}`} id="mainNavbar">

          {/* Main nav links - Centered */}
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-4">
            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/" onClick={closeMenus} style={{ color: "#1a1a1a" }}>Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/about-us" onClick={closeMenus} style={{ color: "#1a1a1a" }}>About</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/services" onClick={closeMenus} style={{ color: "#1a1a1a" }}>Services</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/find-storage" onClick={closeMenus} style={{ color: "#1a1a1a" }}>Find Storage</Link>
            </li>
          </ul>

          {/* Auth area - Right aligned */}
          <ul className="navbar-nav mb-2 mb-lg-0 d-flex align-items-center gap-3">
            {isAuthenticated ? (
              <>
                {user?.role === 'admin' ? (
                  <li className="nav-item">
                    <Link to="/admin-dashboard" className="nav-link fw-bold" onClick={closeMenus} style={{ color: "#1a1a1a" }}>
                      Admin Dashboard
                    </Link>
                  </li>
                ) : (
                  <li className="nav-item">
                    <Link to="/dashboard" className="nav-link fw-bold" onClick={closeMenus} style={{ color: "#1a1a1a" }}>
                      Dashboard
                    </Link>
                  </li>
                )}

                {/* User Dropdown */}
                <li className="nav-item dropdown">
                  <a
                    className={`nav-link dropdown-toggle fw-bold ${isDropdownOpen ? 'show' : ''}`}
                    href="#"
                    id="userDropdown"
                    role="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsDropdownOpen(!isDropdownOpen);
                    }}
                    aria-expanded={isDropdownOpen}
                    style={{ color: "#1a1a1a" }}
                  >
                    {user?.name || user?.email || 'User'}
                  </a>

                  <ul
                    className={`dropdown-menu border-0 shadow-lg ${isDropdownOpen ? 'show' : ''}`}
                    aria-labelledby="userDropdown"
                    style={{ right: 0, left: 'auto', minWidth: '220px', borderRadius: "12px", marginTop: "10px" }}
                  >
                    <li>
                      <Link className="dropdown-item py-2" to="/profile" onClick={closeMenus}>
                        👤 Profile
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item py-2" to="/support" onClick={closeMenus}>
                        💬 Support
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item py-2 text-danger" onClick={handleLogout}>
                        <img src="/logout.png" alt="Logout" style={{ width: '18px', height: '18px', marginRight: '8px' }} />
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link
                    to="/login"
                    className="btn fw-bold px-4 py-2"
                    onClick={closeMenus}
                    style={{
                      color: "#1a1a1a",
                      border: "2px solid #1a1a1a",
                      borderRadius: "50px",
                      backgroundColor: "transparent",
                      transition: "all 0.3s ease"
                    }}
                  >
                    Log in
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/become-partner"
                    className="btn fw-bold px-4 py-2"
                    onClick={closeMenus}
                    style={{
                      backgroundColor: "#8b3d88",
                      color: "white",
                      border: "none",
                      borderRadius: "50px"
                    }}
                  >
                    Become a Partner
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;