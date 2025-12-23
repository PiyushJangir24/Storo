import React from 'react';

function Notifications() {
    const notifications = [
        { id: 1, type: 'booking', title: 'Booking Confirmed', message: 'Your booking at Hotel Taj has been confirmed', time: '2 hours ago', read: false },
        { id: 2, type: 'payment', title: 'Payment Successful', message: 'Payment of ₹299 received successfully', time: '5 hours ago', read: false },
        { id: 3, type: 'reminder', title: 'Pickup Reminder', message: 'Don\'t forget to collect your luggage by 6 PM', time: '1 day ago', read: true },
        { id: 4, type: 'offer', title: 'Special Offer', message: 'Get 20% off on your next booking', time: '2 days ago', read: true }
    ];

    const getIcon = (type) => {
        switch (type) {
            case 'booking': return '📦';
            case 'payment': return '💰';
            case 'reminder': return '⏰';
            case 'offer': return '🎁';
            default: return '🔔';
        }
    };

    return (
        <div style={{ backgroundColor: "#ffffff", minHeight: '100vh', paddingTop: '2rem', paddingBottom: '2rem', color: "#1a1a1a" }}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <div className="text-center mb-5">
                    <div className="mb-3">
                        <span style={{ fontSize: '3.5rem' }}>🔔</span>
                    </div>
                    <h2 className="fw-bold mb-2" style={{ color: '#1a202c' }}>Notifications</h2>
                    <p style={{ color: '#6b7280' }}>Stay updated with your bookings and offers</p>
                </div>

                <div className="bg-white shadow-sm rounded-4" style={{ border: '1px solid #e5e7eb' }}>
                    {notifications.map((notif, index) => (
                        <div
                            key={notif.id}
                            className="p-4"
                            style={{
                                borderBottom: index !== notifications.length - 1 ? '1px solid #e5e7eb' : 'none',
                                backgroundColor: notif.read ? 'white' : '#f0f9ff'
                            }}
                        >
                            <div className="d-flex align-items-start">
                                <div className="me-3" style={{ fontSize: '2rem' }}>
                                    {getIcon(notif.type)}
                                </div>
                                <div className="flex-grow-1">
                                    <div className="d-flex justify-content-between align-items-start mb-1">
                                        <h6 className="fw-bold mb-1" style={{ color: '#1a202c' }}>{notif.title}</h6>
                                        {!notif.read && (
                                            <span className="badge" style={{ backgroundColor: '#1e3a8a', fontSize: '0.7rem' }}>New</span>
                                        )}
                                    </div>
                                    <p className="mb-1" style={{ color: '#4a5568' }}>{notif.message}</p>
                                    <small style={{ color: '#9ca3af' }}>{notif.time}</small>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-4">
                    <button
                        className="btn"
                        style={{
                            color: '#1e3a8a',
                            border: '1px solid #1e3a8a',
                            padding: '0.5rem 2rem',
                            borderRadius: '0.5rem'
                        }}
                    >
                        Mark All as Read
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Notifications;

