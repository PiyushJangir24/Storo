import React, { useState } from 'react';
import { paymentAPI, bookingAPI } from '../api';

function PaymentModal({ booking, onPaymentSuccess, onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Razorpay script is loaded in index.html

  const handlePayment = async () => {
    if (!window.Razorpay) {
      setError('Razorpay SDK not loaded. Please refresh the page.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create order on backend
      const order = await paymentAPI.createOrder(booking._id, booking.price);

      // Note: In production, you should get the Razorpay key from your backend
      // For now, using environment variable or a placeholder
      const razorpayKey = process.env.REACT_APP_RAZORPAY_KEY_ID;
      if (!razorpayKey) {
        setError('Razorpay key not configured. Please add REACT_APP_RAZORPAY_KEY_ID to your .env file.');
        setLoading(false);
        return;
      }

      const options = {
        key: razorpayKey,
        amount: order.amount,
        currency: order.currency,
        name: 'Storo',
        description: `Booking #${booking._id}`,
        order_id: order.id,
        handler: async function (response) {
          try {
            // Verify payment on backend
            const verification = await paymentAPI.verifyPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature,
              booking._id
            );

            if (verification.ok) {
              // Pass transaction details to success handler
              const transactionDetails = {
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                bookingId: booking._id,
                amount: booking.price,
              };
              onPaymentSuccess(transactionDetails);
            } else {
              setError('Payment verification failed');
              // Delete the pending booking
              try {
                await bookingAPI.deleteBooking(booking._id);
              } catch (err) {
                console.error('Failed to delete booking:', err);
              }
            }
          } catch (err) {
            setError(err.message || 'Payment verification failed');
            // Delete the pending booking on error
            try {
              await bookingAPI.deleteBooking(booking._id);
            } catch (deleteErr) {
              console.error('Failed to delete booking:', deleteErr);
            }
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: 'User',
          email: 'user@example.com',
        },
        theme: {
          color: '#171717',
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      setError(err.message || 'Failed to initiate payment');
      setLoading(false);
    }
  };

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content" style={{ borderRadius: '1.5rem', border: '1px solid #eaddd7', backgroundColor: '#fff' }}>
          <div className="modal-header" style={{ borderBottom: '1px solid #eaddd7' }}>
            <h5 className="modal-title fw-bold" style={{ color: '#171717', fontFamily: 'serif' }}>Payment Required</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            <div className="mb-3">
              <h6 className="fw-bold">Booking Details</h6>
              <p className="mb-1">
                <strong>Booking ID:</strong> {booking._id}
              </p>
              <p className="mb-1">
                <strong>Amount:</strong> ₹{booking.price}
              </p>
              <p className="mb-0">
                <strong>Status:</strong> {booking.status}
              </p>
            </div>
            <div className="alert alert-info">
              <small>
                Please complete the payment to confirm your booking. You will be redirected to
                Razorpay payment gateway.
              </small>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handlePayment}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Pay ₹' + booking.price}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentModal;

