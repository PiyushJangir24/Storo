import React from 'react';

function PaymentBilling() {
    const transactions = [
        { id: 'TXN001', date: '2024-01-15', amount: 299, status: 'Completed', method: 'UPI' },
        { id: 'TXN002', date: '2024-01-10', amount: 450, status: 'Completed', method: 'Card' },
        { id: 'TXN003', date: '2024-01-05', amount: 199, status: 'Completed', method: 'UPI' }
    ];

    return (
        <div style={{ backgroundColor: "#ffffff", minHeight: '100vh', paddingTop: '2rem', paddingBottom: '2rem', color: "#1a1a1a" }}>
            <div className="container" style={{ maxWidth: '900px' }}>
                <div className="text-center mb-5">
                    <div className="mb-3">
                        <span style={{ fontSize: '3.5rem' }}>💳</span>
                    </div>
                    <h2 className="fw-bold mb-2" style={{ color: '#1a202c' }}>Payment & Billing</h2>
                    <p style={{ color: '#6b7280' }}>View your transaction history and manage payment methods</p>
                </div>

                {/* Transaction History */}
                <div className="bg-white shadow-sm p-4 rounded-4 mb-4" style={{ border: '1px solid #e5e7eb' }}>
                    <h4 className="fw-bold mb-4" style={{ color: '#1a202c' }}>Transaction History</h4>
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th style={{ color: '#6b7280', fontWeight: '600' }}>Transaction ID</th>
                                    <th style={{ color: '#6b7280', fontWeight: '600' }}>Date</th>
                                    <th style={{ color: '#6b7280', fontWeight: '600' }}>Amount</th>
                                    <th style={{ color: '#6b7280', fontWeight: '600' }}>Method</th>
                                    <th style={{ color: '#6b7280', fontWeight: '600' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((txn) => (
                                    <tr key={txn.id}>
                                        <td style={{ color: '#1a202c', fontWeight: '500' }}>{txn.id}</td>
                                        <td style={{ color: '#4a5568' }}>{txn.date}</td>
                                        <td style={{ color: '#1a202c', fontWeight: '600' }}>₹{txn.amount}</td>
                                        <td style={{ color: '#4a5568' }}>{txn.method}</td>
                                        <td>
                                            <span className="badge" style={{ backgroundColor: '#047857', color: 'white' }}>
                                                {txn.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Payment Methods */}
                <div className="bg-white shadow-sm p-4 rounded-4" style={{ border: '1px solid #e5e7eb' }}>
                    <h4 className="fw-bold mb-4" style={{ color: '#1a202c' }}>Saved Payment Methods</h4>
                    <p style={{ color: '#6b7280' }}>No saved payment methods yet. Add a payment method for faster checkout.</p>
                    <button
                        className="btn mt-3"
                        style={{
                            background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
                            color: 'white',
                            border: 'none',
                            padding: '0.75rem 2rem',
                            borderRadius: '0.5rem'
                        }}
                    >
                        Add Payment Method
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PaymentBilling;

