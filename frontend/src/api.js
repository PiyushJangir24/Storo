const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Helper function to make authenticated requests
const authHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

// Auth APIs
export const authAPI = {
  register: async (name, email, password, role = 'user') => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password, role }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }
    return response.json();
  },

  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }
    return response.json();
  },

  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'GET',
      headers: authHeaders(),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch profile');
    }
    return response.json();
  },

  updateProfile: async (name, phone, address) => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ name, phone, address }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update profile');
    }
    return response.json();
  },

  forgotPassword: async (email) => {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send reset email');
    }
    return response.json();
  },

  resetPassword: async (token, newPassword) => {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, newPassword }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to reset password');
    }
    return response.json();
  },
};

// Partner APIs
export const partnerAPI = {
  createPartner: async (partnerData) => {
    const response = await fetch(`${API_BASE_URL}/partners`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(partnerData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create partner');
    }
    return response.json();
  },

  findNearby: async (lng, lat, radius = 2000) => {
    const response = await fetch(`${API_BASE_URL}/partners/nearby`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ lng, lat, radius }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to find nearby partners');
    }
    return response.json();
  },

  getStats: async (startDate, endDate) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await fetch(`${API_BASE_URL}/partners/stats?${params.toString()}`, {
      headers: authHeaders(),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch stats');
    }
    return response.json();
  },

  getBookings: async (filter, startDate, endDate) => {
    const params = new URLSearchParams();
    if (filter) params.append('filter', filter);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await fetch(`${API_BASE_URL}/partners/bookings?${params.toString()}`, {
      headers: authHeaders(),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch bookings');
    }
    return response.json();
  },

  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/partners/profile`, {
      headers: authHeaders(),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch profile');
    }
    return response.json();
  },
};

// Booking APIs
export const bookingAPI = {
  getUserBookings: async () => {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'GET',
      headers: authHeaders(),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch bookings');
    }
    return response.json();
  },

  createBooking: async (partnerId, weightKg, startAt, endAt, paymentMethod = 'pay-now') => {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ partnerId, weightKg, startAt, endAt, paymentMethod }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create booking');
    }
    return response.json();
  },

  updateBookingStatus: async (bookingId, status) => {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update booking');
    }
    return response.json();
  },

  deleteBooking: async (bookingId) => {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete booking');
    }
    return response.json();
  },
};

// Payment APIs
export const paymentAPI = {
  createOrder: async (bookingId, amount) => {
    const response = await fetch(`${API_BASE_URL}/payments/create-order`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ bookingId, amount }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create order');
    }
    return response.json();
  },

  verifyPayment: async (razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId) => {
    const response = await fetch(`${API_BASE_URL}/payments/verify`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        bookingId,
      }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Payment verification failed');
    }
    return response.json();
  },
};

// Support API
export const supportAPI = {
  createTicket: async (subject, message) => {
    const response = await fetch(`${API_BASE_URL}/support/ticket`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ subject, message }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create support ticket');
    }
    return response.json();
  },
};

// Admin API
export const adminAPI = {
  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/stats`, {
      method: 'GET',
      headers: authHeaders(),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch admin stats');
    }
    return response.json();
  },

  getPendingPartners: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/partners/pending`, {
      method: 'GET',
      headers: authHeaders(),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch pending partners');
    }
    return response.json();
  },

  getApprovedPartners: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/partners/approved`, {
      method: 'GET',
      headers: authHeaders(),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch approved partners');
    }
    return response.json();
  },

  approvePartner: async (partnerId) => {
    const response = await fetch(`${API_BASE_URL}/admin/partners/${partnerId}/approve`, {
      method: 'PUT',
      headers: authHeaders(),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to approve partner');
    }
    return response.json();
  },

  rejectPartner: async (partnerId) => {
    const response = await fetch(`${API_BASE_URL}/admin/partners/${partnerId}/reject`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to reject partner');
    }
    return response.json();
  },
};

