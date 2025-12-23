import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { bookingAPI } from '../api';
import PaymentModal from '../components/PaymentModal';
import PaymentSuccessModal from '../components/PaymentSuccessModal';

function Booking() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookingForm, setBookingForm] = useState({
    weightKg: '',
    startAt: '',
    endAt: '',
  });
  const [bookingCreated, setBookingCreated] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState(null);

  useEffect(() => {
    // Get the partner from navigation state
    if (location.state?.partners && location.state.partners.length > 0) {
      setSelectedPartner(location.state.partners[0]);
    } else {
      // If no partner was passed, redirect back to find storage
      navigate('/find-storage');
    }
  }, [location.state, navigate]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPartner) {
      setError('No partner selected');
      return;
    }

    // Validate form
    if (!bookingForm.weightKg || !bookingForm.startAt || !bookingForm.endAt) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const booking = await bookingAPI.createBooking(
        selectedPartner._id || selectedPartner.id,
        parseFloat(bookingForm.weightKg),
        new Date(bookingForm.startAt).toISOString(),
        new Date(bookingForm.endAt).toISOString(),
        'pay-now' // Default payment method, will be changed to 'pay-later' if user chooses that option
      );
      setBookingCreated(booking);
    } catch (err) {
      setError(err.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setBookingForm({
      ...bookingForm,
      [e.target.name]: e.target.value,
    });
  };

  if (!selectedPartner) {
    return (
      <div className="container-fluid py-5" style={{ minHeight: '90vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

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
        <div className="row justify-content-center">
          <div className="col-lg-10">
            {/* Header */}
            <div className="text-center mb-4">
              <h2 className="fw-bold text-primary">Complete Your Booking</h2>
              <p className="text-muted">Fill in the details below to reserve your storage</p>
            </div>

            <div className="row g-4">
              {/* Partner Details Card */}
              <div className="col-md-5">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '1.5rem' }}>
                  <div className="card-body p-4">
                    <h5 className="fw-bold text-primary mb-3">Selected Hotel</h5>

                    <div className="mb-3">
                      <h6 className="fw-bold mb-2">{selectedPartner.name}</h6>
                      <p className="text-muted mb-0">
                        <i className="bi bi-geo-alt"></i> {selectedPartner.address}
                      </p>
                    </div>

                    <hr />

                    <div className="row mb-3">
                      <div className="col-6">
                        <small className="text-muted">Capacity</small>
                        <p className="fw-bold mb-0">{selectedPartner.capacity} bags</p>
                      </div>
                      <div className="col-6">
                        <small className="text-muted">Base Price</small>
                        <p className="fw-bold text-success mb-0">₹{selectedPartner.base}/day</p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <small className="text-muted">Additional Charges</small>
                      <div className="d-flex justify-content-between mt-1">
                        <span className="small">Per Kg: ₹{selectedPartner.perKg}</span>
                        <span className="small">Per Hour: ₹{selectedPartner.perHour}</span>
                      </div>
                    </div>

                    <div className="alert alert-info mb-0">
                      <small>
                        <i className="bi bi-info-circle"></i> Your luggage is insured up to ₹10,000
                      </small>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Form Card */}
              <div className="col-md-7">
                <div className="card border-0 shadow-sm" style={{ borderRadius: '1.5rem' }}>
                  <div className="card-body p-4">
                    <h5 className="fw-bold text-primary mb-4">Booking Details</h5>

                    {error && (
                      <div className="alert alert-danger" role="alert">
                        {error}
                      </div>
                    )}

                    <form onSubmit={handleBookingSubmit}>
                      <div className="mb-3">
                        <label className="form-label fw-semibold">Weight (kg)</label>
                        <input
                          type="number"
                          className="form-control"
                          name="weightKg"
                          value={bookingForm.weightKg}
                          onChange={handleInputChange}
                          placeholder="Enter total weight in kg"
                          min="1"
                          step="0.1"
                          required
                        />
                        <small className="text-muted">Additional charges apply per kg</small>
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-semibold">Check-in Date & Time</label>
                        <input
                          type="datetime-local"
                          className="form-control"
                          name="startAt"
                          value={bookingForm.startAt}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="mb-4">
                        <label className="form-label fw-semibold">Check-out Date & Time</label>
                        <input
                          type="datetime-local"
                          className="form-control"
                          name="endAt"
                          value={bookingForm.endAt}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="d-grid gap-2">
                        <button
                          type="submit"
                          className="btn btn-primary btn-lg fw-bold"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Processing...
                            </>
                          ) : (
                            'Proceed to Payment'
                          )}
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => navigate('/find-storage')}
                        >
                          Choose Different Hotel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {bookingCreated && !paymentSuccess && (
        <PaymentModal
          booking={bookingCreated}
          onPaymentSuccess={(details) => {
            setTransactionDetails(details);
            setPaymentSuccess(true);
            setBookingCreated(null);
          }}
          onClose={async () => {
            // Delete the pending booking when modal is closed without payment
            try {
              await bookingAPI.deleteBooking(bookingCreated._id);
            } catch (err) {
              console.error('Failed to delete booking:', err);
            }
            setBookingCreated(null);
          }}
        />
      )}

      {/* Payment Success Modal */}
      {paymentSuccess && transactionDetails && (
        <PaymentSuccessModal
          transactionDetails={transactionDetails}
          onClose={() => {
            setPaymentSuccess(false);
            setTransactionDetails(null);
          }}
        />
      )}
    </div>
  );
}

export default Booking;

