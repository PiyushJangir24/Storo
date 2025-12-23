import React, { useState } from 'react';
import { supportAPI } from '../api';

function Support() {
    const [formData, setFormData] = useState({
        subject: '',
        message: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            setMessage({ type: '', text: '' });

            await supportAPI.createTicket(formData.subject, formData.message);

            setMessage({
                type: 'success',
                text: 'Support request submitted successfully! We\'ll get back to you soon.'
            });

            // Clear form
            setFormData({ subject: '', message: '' });

            // Clear success message after 5 seconds
            setTimeout(() => {
                setMessage({ type: '', text: '' });
            }, 5000);
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setSubmitting(false);
        }
    };

    const faqs = [
        { q: 'How do I cancel my booking?', a: 'You can cancel your booking from the My Bookings page anytime before check-in.' },
        { q: 'What if I lose my luggage tag?', a: 'Contact our support team immediately with your booking ID for assistance.' },
        { q: 'Can I extend my storage time?', a: 'Yes, you can extend your storage time by contacting the partner hotel directly.' }
    ];

    return (
        <div style={{ backgroundColor: "#ffffff", minHeight: '100vh', paddingTop: '2rem', paddingBottom: '2rem', color: "#1a1a1a" }}>
            <div className="container" style={{ maxWidth: '900px' }}>
                <div className="text-center mb-5">
                    <div className="mb-3">
                        <span style={{ fontSize: '3.5rem' }}>💬</span>
                    </div>
                    <h2 className="fw-bold mb-2" style={{ color: '#1a1a1a', fontFamily: "'Inter', sans-serif" }}>Support Center</h2>
                    <p style={{ color: '#6b7280' }}>We're here to help you 24/7</p>
                </div>

                <div className="row g-4 mb-5">
                    <div className="col-md-4">
                        <div className="bg-white shadow-sm p-4 rounded-4 text-center h-100" style={{ border: '1px solid #e5e7eb' }}>
                            <div className="mb-3" style={{ fontSize: '2.5rem' }}>📧</div>
                            <h5 className="fw-bold mb-2" style={{ color: '#1a202c' }}>Email</h5>
                            <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>support@storo.com</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="bg-white shadow-sm p-4 rounded-4 text-center h-100" style={{ border: '1px solid #e5e7eb' }}>
                            <div className="mb-3" style={{ fontSize: '2.5rem' }}>📞</div>
                            <h5 className="fw-bold mb-2" style={{ color: '#1a202c' }}>Phone</h5>
                            <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>+91 1800-XXX-XXXX</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="bg-white shadow-sm p-4 rounded-4 text-center h-100" style={{ border: '1px solid #e5e7eb' }}>
                            <div className="mb-3" style={{ fontSize: '2.5rem' }}>💬</div>
                            <h5 className="fw-bold mb-2" style={{ color: '#1a202c' }}>Live Chat</h5>
                            <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Available 24/7</p>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-white shadow-sm p-5 rounded-4 mb-5" style={{ border: '1px solid #e5e7eb' }}>
                    <h4 className="fw-bold mb-4" style={{ color: '#1a202c' }}>Send us a message</h4>

                    {message.text && (
                        <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'} mb-4`} role="alert">
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="form-label fw-bold" style={{ color: '#1a202c' }}>Subject</label>
                            <input
                                type="text"
                                name="subject"
                                className="form-control form-control-lg"
                                placeholder="What can we help you with?"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                                style={{ borderColor: '#e5e7eb' }}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="form-label fw-bold" style={{ color: '#1a202c' }}>Message</label>
                            <textarea
                                name="message"
                                className="form-control form-control-lg"
                                rows="5"
                                placeholder="Describe your issue or question..."
                                value={formData.message}
                                onChange={handleChange}
                                required
                                style={{ borderColor: '#e5e7eb' }}
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn w-100 py-3 fw-bold"
                            disabled={submitting}
                            style={{
                                background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.75rem'
                            }}
                        >
                            {submitting ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                </div>

                {/* Quick FAQs */}
                <div className="bg-white shadow-sm p-4 rounded-4" style={{ border: '1px solid #e5e7eb' }}>
                    <h4 className="fw-bold mb-4" style={{ color: '#1a202c' }}>Quick Answers</h4>
                    {faqs.map((faq, index) => (
                        <div key={index} className="mb-3">
                            <h6 className="fw-bold" style={{ color: '#1a202c' }}>{faq.q}</h6>
                            <p style={{ color: '#4a5568', marginBottom: index !== faqs.length - 1 ? '1rem' : '0' }}>{faq.a}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Support;


