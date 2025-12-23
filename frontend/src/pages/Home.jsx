import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// Scroll Animation Hook
const useScrollAnimation = () => {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // Observe all elements with scroll-animate class
    const elements = document.querySelectorAll('.scroll-animate');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);
};

// Large Blurred Blob SVGs
const BlurryBg = () => (
  <>
    <svg
      style={{
        position: "fixed",
        top: -120,
        left: -120,
        zIndex: 0,
        filter: "blur(60px)",
        opacity: 0.08,
        pointerEvents: "none",
      }}
      width="560" height="420" viewBox="0 0 600 440"
    >
      <ellipse cx="400" cy="220" rx="210" ry="130" fill="#2acb72" />
    </svg>
    <svg
      style={{
        position: "fixed",
        top: 80,
        right: -140,
        zIndex: 0,
        filter: "blur(48px)",
        opacity: 0.06,
        pointerEvents: "none",
      }}
      width="440" height="340" viewBox="0 0 440 340"
    >
      <ellipse cx="170" cy="170" rx="140" ry="100" fill="#0473ea" />
    </svg>
    <svg
      style={{
        position: "fixed",
        bottom: -60,
        left: 100,
        zIndex: 0,
        filter: "blur(36px)",
        opacity: 0.05,
        pointerEvents: "none",
      }}
      width="460" height="180" viewBox="0 0 460 180"
    >
      <ellipse cx="210" cy="90" rx="120" ry="70" fill="#fbc02d" />
    </svg>
  </>
);

// FAQ Section
function FAQSection() {
  const faqs = [
    {
      q: "How safe is storing my luggage with Storo?",
      a: "Your bags are stored with pre-verified hotel partners and tagged at drop-off. Every booking comes with insurance for extra peace of mind!"
    },
    {
      q: "What is the cost of using Storo?",
      a: "Storo starts at just ₹99 per bag per day. Pricing varies by city and partner, always shown clearly at booking."
    },
    {
      q: "How do I find my nearest Storo partner?",
      a: "Just type your city or hotel in the search box and see our closest verified storage partners on the map."
    },
    {
      q: "Can I cancel or change my booking?",
      a: "Absolutely! Cancel or modify anytime before check-in—no fees, full flexibility."
    },
  ];
  const [openIdx, setOpenIdx] = useState(0);
  return (
    <div className="container my-5 py-4" style={{ maxWidth: "900px" }}>
      <h3 className="fw-bold text-center mb-5" style={{ color: "#1a1a1a", fontFamily: "'Inter', sans-serif" }}>Frequently Asked Questions</h3>
      <div className="bg-white rounded-4 shadow-sm p-4" style={{ border: "1px solid #e5e7eb" }}>
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className={`${idx !== faqs.length - 1 ? 'border-bottom' : ''}`}
            style={{ paddingBottom: idx !== faqs.length - 1 ? '1.5rem' : '0', paddingTop: idx !== 0 ? '1.5rem' : '0', borderColor: "#e5e7eb" }}
          >
            <button
              className={`w-100 d-flex align-items-center justify-content-between px-0 py-0 text-start border-0 bg-transparent ${openIdx === idx ? "fw-bold" : "fw-semibold"
                }`}
              onClick={() => setOpenIdx(openIdx === idx ? -1 : idx)}
              style={{
                fontSize: "1.1rem",
                outline: "none",
                cursor: "pointer",
                transition: "color 0.2s ease",
                color: "#1a1a1a"
              }}
              aria-expanded={openIdx === idx}
            >
              <span>{faq.q}</span>
              <span
                className="ms-3"
                style={{
                  fontSize: "1.2rem",
                  transition: "transform 0.3s ease",
                  transform: openIdx === idx ? "rotate(180deg)" : "rotate(0deg)",
                  display: "inline-block",
                  color: "#1a1a1a"
                }}
              >
                ▼
              </span>
            </button>
            <div
              className="faq-answer"
              style={{
                maxHeight: openIdx === idx ? "500px" : "0",
                overflow: "hidden",
                transition: "max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease, margin-top 0.3s ease",
                opacity: openIdx === idx ? 1 : 0,
                marginTop: openIdx === idx ? "1rem" : "0",
                fontSize: "1rem",
                lineHeight: "1.6",
                color: "#6b7280"
              }}
            >
              {openIdx === idx && <div>{faq.a}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Reviews Section
function ReviewsSection() {
  const reviews = [
    {
      name: "Aditi S.",
      city: "Delhi",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
      stars: 5,
      text: "Dropped my luggage at 8am, picked up at 10pm. Seamless experience and super friendly team!"
    },
    {
      name: "Rahul P.",
      city: "Bangalore",
      avatar: "https://randomuser.me/api/portraits/men/17.jpg",
      stars: 5,
      text: "Booking took less than a minute. Price is awesome, Storo staff even gave me city tips."
    },
    {
      name: "Yvonne G.",
      city: "Mumbai",
      avatar: "https://randomuser.me/api/portraits/women/52.jpg",
      stars: 4,
      text: "Good insurance included, hotel was clean and safe. Would use Storo again next trip!"
    },
    {
      name: "Arjun T.",
      city: "Goa",
      avatar: "https://randomuser.me/api/portraits/men/85.jpg",
      stars: 5,
      text: "Perfect for tourists! Found a nearby hotel in seconds. No hassle."
    }
  ];
  return (
    <section className="container my-5 py-5">
      <h3 className="fw-bold mb-5 text-center" style={{ color: "#1a202c", fontSize: "2.5rem" }}>Real Storo Reviews</h3>
      <div className="row g-4 justify-content-center">
        {reviews.map((r, i) => (
          <div className="col-md-6 col-xl-3" key={i}>
            <div className="text-center py-4 px-3 h-100 bg-white shadow-sm" style={{
              borderRadius: "1rem",
              border: "1px solid #e5e7eb"
            }}>
              <div className="mb-3">
                <img
                  src={r.avatar}
                  alt={r.name}
                  className="rounded-circle"
                  style={{ width: 64, height: 64, objectFit: "cover", border: "3px solid #e5e7eb" }}
                />
              </div>
              <h6 className="fw-bold mb-1" style={{ color: "#1a202c" }}>{r.name} <span className="fw-normal" style={{ color: "#6b7280", fontSize: "0.9rem" }}>({r.city})</span></h6>
              <div className="mb-3" style={{ color: '#d97706' }}>
                {"★".repeat(r.stars)}{"☆".repeat(5 - r.stars)}
              </div>
              <p className="mb-0 fst-italic" style={{ color: "#4a5568", fontSize: "0.95rem", lineHeight: "1.6" }}>"{r.text}"</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Initialize scroll animations
  useScrollAnimation();

  const handleSearch = (e) => {
    e.preventDefault();
    // Navigate to FindStorage with search query
    navigate('/find-storage', { state: { searchQuery: searchQuery } });
  };

  const features = [
    {
      icon: "⚡",
      color: "success",
      title: "Quick and Seamless Booking",
      desc: "Book in 2 clicks with no calls, confirmations, or paperwork. Storage made instant."
    },
    {
      icon: "🔒",
      color: "primary",
      title: "Insured and Verified Locations",
      desc: "All Storo partners are vetted hotels; bags are tagged and insured up to ₹10,000 each."
    },
    {
      icon: "🤝",
      color: "warning",
      title: "All-day Support",
      desc: "Friendly live chat and fast email support. We're with you every step of your trip."
    },
    {
      icon: "☕",
      color: "info",
      title: "Trusted by Major Hotels",
      desc: "From Marriott to Lemon Tree, our partners ensure hospitality and trust."
    }
  ];

  const popularCities = [
    { name: "Delhi", img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&w=380&q=80" },
    { name: "Bangalore", img: "https://images.unsplash.com/photo-1526481280690-4b479c8b75cf?auto=format&w=380&q=80" },
    { name: "Goa", img: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&w=380&q=80" },
    { name: "Mumbai", img: "https://images.unsplash.com/photo-1468397312065-0063ebc0edc7?auto=format&w=380&q=80" }
  ];

  return (
    <div style={{
      background: "#ffffff",
      position: "relative",
      minHeight: "100vh",
      overflow: "hidden",
      color: "#1a1a1a"
    }}>
      {/* Funky Gradient Background Blobs */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        overflow: "hidden"
      }}>
        {/* Purple Gradient Blob - Top Right */}
        <div style={{
          position: "absolute",
          top: "-15%",
          right: "-8%",
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(139, 61, 136, 0.12) 0%, rgba(139, 61, 136, 0.06) 40%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(60px)",
          animation: "float 20s ease-in-out infinite"
        }}></div>

        {/* Green Gradient Blob - Bottom Left */}
        <div style={{
          position: "absolute",
          bottom: "-12%",
          left: "-8%",
          width: "550px",
          height: "550px",
          background: "radial-gradient(circle, rgba(4, 120, 87, 0.12) 0%, rgba(4, 120, 87, 0.06) 40%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(60px)",
          animation: "float 25s ease-in-out infinite reverse"
        }}></div>

        {/* Orange Accent Blob - Center */}
        <div style={{
          position: "absolute",
          top: "45%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(251, 146, 60, 0.1) 0%, rgba(251, 146, 60, 0.04) 50%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(50px)",
          animation: "float 18s ease-in-out infinite"
        }}></div>

        {/* Subtle Geometric Pattern Overlay */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(139, 61, 136, 0.02) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(4, 120, 87, 0.02) 0%, transparent 50%)
          `,
          opacity: 0.6
        }}></div>
      </div>

      {/* Add keyframes animations */}
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
        
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        /* Scroll Animation Styles */
        .scroll-animate {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }

        .scroll-animate.animate-in {
          opacity: 1;
          transform: translateY(0);
        }

        /* Stagger animation delays for cards */
        .scroll-animate:nth-child(1) { transition-delay: 0.1s; }
        .scroll-animate:nth-child(2) { transition-delay: 0.2s; }
        .scroll-animate:nth-child(3) { transition-delay: 0.3s; }
        .scroll-animate:nth-child(4) { transition-delay: 0.4s; }
      `}</style>

      <BlurryBg />

      {/* Modern Hero Section - Centered Booking Style */}
      <section
        className="container py-5 d-flex flex-column align-items-center justify-content-center"
        style={{ minHeight: "70vh", position: "relative", zIndex: 1 }}
      >
        <div
          className="text-center"
          style={{
            maxWidth: "900px",
            padding: "3rem 2rem",
            zIndex: 2
          }}
        >
          {/* Icon */}
          {/* <div className="mb-4">
            <span style={{ fontSize: "4rem" }} role="img" aria-label="luggage">🧳</span>
          </div> */}

          {/* Main Heading */}
          <h1
            className="fw-bold mb-4"
            style={{
              color: "#1a1a1a",
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              fontFamily: "'Inter', serif",
              maxWidth: "900px",
              margin: "0 auto"
            }}
          >
            Store your bags.{" "}
            <span style={{
              color: "#8b3d88",
              fontStyle: "italic",
              fontWeight: "600"
            }}>
              Roam freely
            </span>{" "}
            with Storo
          </h1>

          {/* Subtitle */}
          <p
            className="lead mb-5"
            style={{
              maxWidth: "650px",
              margin: "0 auto 2.5rem",
              color: "#6b7280",
              fontSize: "1.25rem",
              lineHeight: "1.7",
              fontWeight: "400"
            }}
          >
            Secure luggage storage instantly at{" "}
            <span className="fw-semibold" style={{ color: "#047857" }}>verified partner hotels</span>.
            <br />
            No stress, no hassle—just safe, simple drop-off.
          </p>

          {/* Search Form */}
          <form className="mb-4" onSubmit={handleSearch}>
            <div className="d-flex justify-content-center">
              <div style={{ maxWidth: "500px", width: "100%" }}>
                <div className="input-group input-group-lg shadow-lg" style={{ borderRadius: "1rem" }}>
                  <input
                    className="form-control border-0 py-3 px-4"
                    type="text"
                    placeholder="Search by city or hotel name..."
                    style={{
                      background: "white",
                      borderRadius: "1rem 0 0 1rem",
                      fontSize: "1.1rem"
                    }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button
                    className="btn btn-success px-5 fw-bold"
                    type="submit"
                    style={{
                      borderRadius: "0 1rem 1rem 0",
                      fontSize: "1.1rem",
                      background: "linear-gradient(135deg, #047857 0%, #065f46 100%)",
                      border: "none"
                    }}
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Trust Badges */}
          <div className="d-flex justify-content-center gap-3 mb-3 flex-wrap">
            <span className="badge fs-6 px-4 py-2 shadow-sm" style={{ borderRadius: "0.8rem", backgroundColor: "#047857", color: "white" }}>
              <span role="img" aria-label="shield">🛡️</span> ₹10,000 Insurance
            </span>
            <span className="badge fs-6 px-4 py-2 shadow-sm" style={{ borderRadius: "0.8rem", backgroundColor: "#047857", color: "white" }}>
              <span role="img" aria-label="calendar">📅</span> Free Cancel
            </span>
            <span className="badge fs-6 px-4 py-2 shadow-sm" style={{ borderRadius: "0.8rem", backgroundColor: "#047857", color: "white" }}>
              <span role="img" aria-label="clock">⚡</span> Instant Booking
            </span>
          </div>

          {/* Trust Text */}
          <p className="mt-4 mb-0" style={{ color: "#4a5568" }}>
            <strong>Trusted by 150+ leading hotels</strong> · Rated 4.9 worldwide
          </p>
        </div>
      </section>

      {/* Partner logos bar */}
      <section className="container pb-2 text-center my-4">
        <span className="small fw-bold text-uppercase mb-1 d-block" style={{ color: "#6b7280" }}>as featured by</span>
        <div className="d-flex justify-content-center align-items-center gap-4 flex-wrap mt-4">
          <img src="assets/logos/sheraton.png" alt="Sheraton Hotels" style={{ height: 60 }} />
          <img src="assets/logos/ibis.png" alt="Ibis Hotels" style={{ height: 60 }} />
          <img src="assets/logos/marriott.png" alt="Marriott Hotels" style={{ height: 60 }} />
          <img src="assets/logos/raffles.png" alt="Hotels.com" style={{ height: 60 }} />
          <img src="assets/logos/lemontree.png" alt="Lemon Tree Hotels" style={{ height: 60 }} />
          <img src="assets/logos/taj.png" alt="Taj Hotels" style={{ height: 60 }} />
          {/* <img src="assets/logos/holidayinn.png" alt="Holiday Inn" style={{height:60}} /> */}
        </div>
      </section>

      {/* Popular Cities grid
      <section className="container my-4">
        <h3 className="text-center fw-bold mb-4 text-primary display-6">Popular Cities</h3>
        <div className="row g-4 justify-content-center">
          {popularCities.map((c, idx) => (
            <div className="col-6 col-md-3" key={idx}>
              <div className="text-center p-2" style={{
                borderRadius: "1.2rem",
                background: "rgba(255,255,255,0.79)"
              }}>
                <img
                  src={c.img}
                  alt={c.name}
                  style={{
                    width: "100%",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "1.2rem 1.2rem 0 0"
                  }}
                />
                <div className="fw-bold pt-2 fs-5">{c.name}</div>
              </div>
            </div>
          ))}
        </div>
      </section> */}

      {/* Why Choose Storo */}
      <section className="container my-5 py-5">
        <h2 className="fw-bold text-center mb-5 display-5" style={{ letterSpacing: "-1px", color: "#1a202c" }}>
          Why choose <span style={{ color: "#047857" }}>Storo?</span>
        </h2>
        <div className="row g-4 justify-content-center">
          {features.map((f, idx) => (
            <div className="col-md-6 col-lg-3 scroll-animate" key={idx}>
              <div className="text-center p-4 h-100 bg-white shadow-sm" style={{ borderRadius: "1rem", border: "1px solid #e5e7eb" }}>
                <div className={`mb-3 fs-1 text-${f.color}`}>
                  <span role="img" aria-label={f.title}>{f.icon}</span>
                </div>
                <div className="fw-bold fs-5 mb-3" style={{ color: "#1a202c" }}>{f.title}</div>
                <div style={{ color: "#4a5568", fontSize: "0.95rem", lineHeight: "1.6" }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="container my-5 py-5">
        <h3 className="fw-bold text-center mb-5" style={{ color: "#1a202c", fontSize: "2.5rem" }}>How it works</h3>
        <div className="bg-white shadow-sm p-5 rounded-4" style={{ border: "1px solid #e5e7eb" }}>
          <div className="row g-5 text-center align-items-stretch">
            <div className="col-md-4">
              <div className="mb-3">
                <span className="display-4 mb-3 d-block" style={{ color: "#047857" }}>🗺️</span>
              </div>
              <h5 className="fw-bold mb-3" style={{ color: "#1a202c" }}>1. Book Nearby</h5>
              <p style={{ color: "#4a5568", lineHeight: "1.6" }}>Pick your trusted Storo spot with real-time inventory.</p>
            </div>
            <div className="col-md-4">
              <div className="mb-3">
                <span className="display-4 mb-3 d-block" style={{ color: "#d97706" }}>📦</span>
              </div>
              <h5 className="fw-bold mb-3" style={{ color: "#1a202c" }}>2. Check-in Bags</h5>
              <p style={{ color: "#4a5568", lineHeight: "1.6" }}>Show your reservation code and hand off. Storo's insurance starts here!</p>
            </div>
            <div className="col-md-4">
              <div className="mb-3">
                <span className="display-4 mb-3 d-block" style={{ color: "#1e3a8a" }}>🥳</span>
              </div>
              <h5 className="fw-bold mb-3" style={{ color: "#1a202c" }}>3. Explore & Collect</h5>
              <p style={{ color: "#4a5568", lineHeight: "1.6" }}>Get notified, return anytime, and hit the road light and free!</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection />

      {/* Reviews Section */}
      <ReviewsSection />


    </div>
  );
}

export default Home;

