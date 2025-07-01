import React, { useState, useEffect } from 'react';
import './DeliveryDashboard.css';

// List of 25 major Indian cities (copied from CalculationForm.js)
const cities = [
    { value: 'Mumbai', label: 'Mumbai, Maharashtra' },
    { value: 'Delhi', label: 'Delhi, National Capital Territory' },
    { value: 'Bangalore', label: 'Bangalore (Bengaluru), Karnataka' },
    { value: 'Hyderabad', label: 'Hyderabad, Telangana' },
    { value: 'Chennai', label: 'Chennai, Tamil Nadu' },
    { value: 'Kolkata', label: 'Kolkata, West Bengal' },
    { value: 'Pune', label: 'Pune, Maharashtra' },
    { value: 'Ahmedabad', label: 'Ahmedabad, Gujarat' },
    { value: 'Jaipur', label: 'Jaipur, Rajasthan' },
    { value: 'Lucknow', label: 'Lucknow, Uttar Pradesh' },
    { value: 'Kanpur', label: 'Kanpur, Uttar Pradesh' },
    { value: 'Nagpur', label: 'Nagpur, Maharashtra' },
    { value: 'Indore', label: 'Indore, Madhya Pradesh' },
    { value: 'Bhopal', label: 'Bhopal, Madhya Pradesh' },
    { value: 'Patna', label: 'Patna, Bihar' },
    { value: 'Surat', label: 'Surat, Gujarat' },
    { value: 'Vadodara', label: 'Vadodara (Baroda), Gujarat' },
    { value: 'Ranchi', label: 'Ranchi, Jharkhand' },
    { value: 'Raipur', label: 'Raipur, Chhattisgarh' },
    { value: 'Chandigarh', label: 'Chandigarh, Chandigarh' },
    { value: 'Ludhiana', label: 'Ludhiana, Punjab' },
    { value: 'Guwahati', label: 'Guwahati, Assam' },
    { value: 'Coimbatore', label: 'Coimbatore, Tamil Nadu' },
    { value: 'Visakhapatnam', label: 'Visakhapatnam, Andhra Pradesh' },
    { value: 'Thiruvananthapuram', label: 'Thiruvananthapuram, Kerala' }
];

const DeliveryDashboard = ({ activeTab }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedCity, setSelectedCity] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            setError('');
            try {
                // Determine the endpoint based on the active tab
                const endpoint = activeTab === 'pickup' 
                    ? 'https://logistics-website-67n1.onrender.com/api/delivery/pickup' 
                    : 'https://logistics-website-67n1.onrender.com/api/delivery/deliver';
                
                const response = await fetch(endpoint);
                if (response.ok) {
                    const data = await response.json();
                    setOrders(data);
                } else {
                    const err = await response.json();
                    setError(err.message || `Failed to fetch orders for: ${activeTab}`);
                }
            } catch (err) {
                setError('Failed to connect to the server.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [activeTab]);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const response = await fetch(`https://logistics-website-67n1.onrender.com/api/admin/orders/${orderId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                // Refresh the list after status update
                setOrders(prevOrders => prevOrders.filter(order => order.orderId !== orderId));
            } else {
                console.error('Failed to update order status');
                alert('Could not update status. Please try again.');
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            alert('An error occurred. Please try again.');
        }
    };

    const filteredOrders = orders.filter(order => {
        if (!selectedCity) return true;
        if (activeTab === 'pickup') {
            return order.departureCity === selectedCity;
        } else {
            return order.deliverCity === selectedCity;
        }
    });

    const renderOrderTable = () => {
        if (loading) return <p>Loading orders...</p>;
        if (error) return <p className="error-message">{error}</p>;
        if (filteredOrders.length === 0) return <p>No orders found.</p>;

        return (
            <table className="dashboard-table">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Sender</th>
                        <th>Receiver</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredOrders.map(order => (
                        <tr key={order.orderId}>
                            <td>{order.orderId}</td>
                            <td>
                                <div><strong>{order.sender.name}</strong></div>
                                <div>{order.sender.address}, {order.sender.city}</div>
                            </td>
                            <td>
                                <div><strong>{order.receiver.name}</strong></div>
                                <div>{order.receiver.address}, {order.receiver.city}</div>
                            </td>
                            <td>
                                {activeTab === 'pickup' && (
                                    <button 
                                        className="action-btn pickup"
                                        onClick={() => handleStatusChange(order.orderId, 'Picked Up')}
                                    >
                                        Mark as Picked Up
                                    </button>
                                )}
                                {activeTab === 'delivery' && (
                                    <button 
                                        className="action-btn deliver"
                                        onClick={() => handleStatusChange(order.orderId, 'Delivered')}
                                    >
                                        Mark as Delivered
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <div className="delivery-dashboard">
            <div className="dashboard-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h2 style={{ margin: 0 }}>{activeTab === 'pickup' ? 'Items to be Picked Up' : 'Items to be Delivered'}</h2>
                <div className="city-select-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fff', borderRadius: '6px', boxShadow: '0 2px 8px rgba(52,143,143,0.07)', padding: '0.5rem 1rem', border: '1px solid #e0e0e0' }}>
                    <svg style={{ width: '20px', height: '20px', marginRight: '0.5rem', opacity: 0.7 }} fill="none" stroke="#348f8f" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <select
                        id="city-select"
                        value={selectedCity}
                        onChange={e => setSelectedCity(e.target.value)}
                        style={{ padding: '0.5rem 1.5rem 0.5rem 0.5rem', borderRadius: '4px', border: '1px solid #cce3e3', fontSize: '1rem', outline: 'none', background: 'transparent', color: '#348f8f', fontWeight: 500 }}
                    >
                        <option value="">All Cities</option>
                        {cities.map(city => (
                            <option key={city.value} value={city.value}>{city.label}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div style={{ borderBottom: '1px solid #e0e0e0', marginBottom: '2rem' }} />
            <div className="dashboard-content">
                {renderOrderTable()}
            </div>
        </div>
    );
};

export default DeliveryDashboard; 