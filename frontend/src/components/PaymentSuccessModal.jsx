import React from 'react';
import { useNavigate } from 'react-router-dom';

function PaymentSuccessModal({ transactionDetails, onClose }) {
    const navigate = useNavigate();

    const handleViewDashboard = () => {
        navigate('/dashboard');
        onClose();
    };

    return (
        <div
            className="modal show d-block"
            tabIndex="-1"
            style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content" style={{ borderRadius: '1.5rem', overflow: 'hidden', border: '1px solid #eaddd7' }}>
                    {/* Success Header */}
                    <div
                        className="modal-header border-0 text-white text-center d-block py-4"
                        style={{
                            background: 'linear-gradient(135deg, #047857 0%, #065f46 100%)'
                        }}
                    >
                        <div className="d-flex justify-content-center mb-3">
                            <div
                                className="rounded-circle bg-white d-flex align-items-center justify-content-center"
                                style={{ width: '80px', height: '80px' }}
                            >
                                <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '3rem' }}></i>
                            </div>
                        </div>
                        <h4 className="modal-title fw-bold mb-2" style={{ fontFamily: 'serif' }}>Payment Successful!</h4>
                        <p className="mb-0 opacity-90">Your booking has been confirmed</p>
                    </div>

                    {/* Transaction Details */}
                    <div className="modal-body p-4">
                        <div className="mb-4">
                            <h6 className="fw-bold mb-3" style={{ color: '#171717', fontFamily: 'serif' }}>Transaction Details</h6>

                            <div className="card mb-3" style={{ backgroundColor: '#fffbf0', border: '1px solid #eaddd7' }}>
                                <div className="card-body p-3">
                                    <div className="row mb-2">
                                        <div className="col-6">
                                            <small className="text-muted">Payment ID</small>
                                        </div>
                                        <div className="col-6 text-end">
                                            <small className="fw-semibold font-monospace">
                                                {transactionDetails.paymentId?.slice(-12) || 'N/A'}
                                            </small>
                                        </div>
                                    </div>

                                    <div className="row mb-2">
                                        <div className="col-6">
                                            <small className="text-muted">Order ID</small>
                                        </div>
                                        <div className="col-6 text-end">
                                            <small className="fw-semibold font-monospace">
                                                {transactionDetails.orderId?.slice(-12) || 'N/A'}
                                            </small>
                                        </div>
                                    </div>

                                    <div className="row mb-2">
                                        <div className="col-6">
                                            <small className="text-muted">Booking ID</small>
                                        </div>
                                        <div className="col-6 text-end">
                                            <small className="fw-semibold font-monospace">
                                                {transactionDetails.bookingId?.slice(-12) || 'N/A'}
                                            </small>
                                        </div>
                                    </div>

                                    <hr className="my-2" />

                                    <div className="row">
                                        <div className="col-6">
                                            <small className="text-muted">Amount Paid</small>
                                        </div>
                                        <div className="col-6 text-end">
                                            <span className="fw-bold text-success fs-5">
                                                ₹{transactionDetails.amount || '0'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="alert alert-info mb-0">
                                <small>
                                    <i className="bi bi-info-circle me-2"></i>
                                    A confirmation email has been sent to your registered email address.
                                </small>
                            </div>
                        </div>

                        <div className="alert alert-success border-0 mb-0">
                            <div className="d-flex align-items-center">
                                <i className="bi bi-shield-check fs-4 me-3"></i>
                                <div>
                                    <small className="fw-semibold d-block">Your luggage is insured</small>
                                    <small className="text-muted">Coverage up to ₹10,000</small>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="modal-footer border-0 pt-0 pb-4 px-4">
                        <button
                            type="button"
                            className="btn btn-outline-secondary flex-fill"
                            onClick={onClose}
                        >
                            Close
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary flex-fill fw-semibold"
                            onClick={handleViewDashboard}
                        >
                            <i className="bi bi-grid-fill me-2"></i>
                            View Dashboard
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PaymentSuccessModal;
