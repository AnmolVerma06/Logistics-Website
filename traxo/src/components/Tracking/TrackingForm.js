import React, { useState } from 'react';
import './TrackingForm.css';

const TrackingForm = () => {
    const [senderName, setSenderName] = useState('');
    const [orderId, setOrderId] = useState('');
    const [error, setError] = useState('');
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!senderName || !orderId) {
            setError('Both fields are required.');
            return;
        }

        setLoading(true);
        setError('');
        setOrder(null);

        try {
            const response = await fetch(`https://logistics-website-67n1.onrender.com/api/track?orderId=${orderId}&senderName=${encodeURIComponent(senderName)}`);
            const data = await response.json();

            if (response.ok) {
                setOrder(data);
            } else {
                setError(data.message || 'Order not found.');
            }
        } catch (err) {
            setError('Failed to connect to the server. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="wpo-contact-form-area">
            <div className="wpo-section-title">
                <span>Track Your Order</span>
                <h2>Enter Your Details Below</h2>
            </div>
            <form onSubmit={handleSubmit} className="contact-validation-active">
                <div className="row">
                    <div className="form-group col-lg-6 col-md-12 col-12">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Sender Name*"
                            value={senderName}
                            onChange={(e) => setSenderName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group col-lg-6 col-md-12 col-12">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Order ID*"
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className="submit-area">
                    <button type="submit" className="theme-btn" disabled={loading}>
                        {loading ? 'Tracking...' : 'Track Now'}
                    </button>
                </div>
                {error && <p className="error-message" style={{color: 'red', marginTop: '1rem'}}>{error}</p>}
            </form>

            {order && (
                <div className="order-details-wrapper">
                    <h3>Order Status</h3>
                    <div className="order-details-grid">
                        <p><strong>Order ID:</strong> {order.orderId}</p>
                        <p><strong>Status:</strong> <span className={`status-label status-${order.status.toLowerCase().replace(/ /g, '-')}`}>{order.status}</span></p>
                        <p><strong>Estimated Delivery:</strong> {new Date(order.estimatedDeliveryStart).toLocaleDateString()} - {new Date(order.estimatedDeliveryEnd).toLocaleDateString()}</p>
                        <p><strong>Sender:</strong> {order.sender.name}</p>
                        <p><strong>Receiver:</strong> {order.receiver.name}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrackingForm; 