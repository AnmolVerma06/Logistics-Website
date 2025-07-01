import React, { useState, useEffect, useContext } from 'react';
import './AdminDashboard.css';
import { SearchContext } from './SearchContext';

// Utility function to format dates safely
function formatDate(dateVal) {
    if (!dateVal) return '-';
    const date = new Date(dateVal);
    return isNaN(date.getTime()) ? '-' : date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
}

const AdminDashboard = ({ activeTab }) => {
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const [contactMessages, setContactMessages] = useState([]);
    const { searchTerm } = useContext(SearchContext);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/admin/orders');
                if (response.ok) {
                    const data = await response.json();
                    setOrders(data);
                } else {
                    console.error('Failed to fetch orders');
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/admin/users');
                if (response.ok) {
                    const data = await response.json();
                    setUsers(data);
                } else {
                    console.error('Failed to fetch users');
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        const fetchContactMessages = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/contact-messages');
                if (response.ok) {
                    const data = await response.json();
                    setContactMessages(data);
                } else {
                    console.error('Failed to fetch contact messages');
                }
            } catch (error) {
                console.error('Error fetching contact messages:', error);
            }
        };

        if (activeTab === 'orders') {
            fetchOrders();
        } else if (activeTab === 'users') {
            fetchUsers();
        } else if (activeTab === 'contact') {
            fetchContactMessages();
        }
    }, [activeTab]);

    const toggleOrderDetails = (orderId) => {
        setExpandedOrderId(prevId => (prevId === orderId ? null : orderId));
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const response = await fetch(`http://localhost:5000/api/admin/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                const updatedOrder = await response.json();
                setOrders(prevOrders =>
                    prevOrders.map(order =>
                        order.orderId === orderId ? { ...order, status: updatedOrder.status } : order
                    )
                );
            } else {
                console.error('Failed to update order status');
            }
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    // Filter orders by orderId using the search term
    const filteredOrders = searchTerm
        ? orders.filter(order => order.orderId.toLowerCase().includes(searchTerm.toLowerCase()))
        : orders;

    const renderOrdersTable = () => (
        <table className="dashboard-table">
            <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {filteredOrders.map(order => (
                    <React.Fragment key={order.orderId}>
                        <tr className="order-summary-row">
                            <td>{order.orderId}</td>
                            <td>
                                <select
                                    className={`status-dropdown status-${order.status.toLowerCase().replace(/ /g, '-')}`}
                                    value={order.status}
                                    onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                                >
                                    <option value="Confirmed">Confirmed</option>
                                    <option value="Picked Up">Picked Up</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="In Transit">In Transit</option>
                                    <option value="Out for delivery">Out for delivery</option>
                                    <option value="Delivered">Delivered</option>
                                </select>
                            </td>
                            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td>
                                <button onClick={() => toggleOrderDetails(order.orderId)} className="details-toggle">
                                    {expandedOrderId === order.orderId ? 'Hide' : 'Show'} Details
                                </button>
                            </td>
                        </tr>
                        {expandedOrderId === order.orderId && (
                            <tr className="order-details-row">
                                <td colSpan="4">
                                    <div className="order-details-content">
                                        <h4>Order Details</h4>
                                        <div className="details-grid">
                                            <div><strong>Payment ID:</strong> {order.paymentId || 'N/A'}</div>
                                            <div><strong>Grand Total:</strong> ₹{order.grandTotal?.toFixed(2)}</div>
                                            <div><strong>Subtotal:</strong> ₹{order.grandTotal?.toFixed(2)}</div>
                                            <div><strong>Estimated Pickup:</strong> {formatDate(order.estimatedPickup)}</div>
                                            <div>
                                                <strong>Estimated Delivery:</strong> 
                                                {formatDate(order.estimatedDeliveryStart)} - {formatDate(order.estimatedDeliveryEnd)}
                                            </div>
                                            <div><strong>Departure City:</strong> {order.departureCity || '-'}</div>
                                            <div><strong>Destination City:</strong> {order.deliverCity || '-'}</div>
                                            <div><strong>Weight:</strong> {order.weight || '-'}</div>
                                            <div><strong>Freight Type:</strong> {order.freightType || '-'}</div>
                                        </div>

                                        <h5>Items</h5>
                                        <div className="items-list">
                                            {order.cartItems.map(item => (
                                                <div key={item.id} className="item-card">
                                                    <p><strong>Box Name:</strong> {item.title}</p>
                                                    <p><strong>Quantity:</strong> {item.qty}</p>
                                                    <p><strong>Price:</strong> ₹{item.price.toFixed(2)}</p>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="participants-grid">
                                            <div className="participant">
                                                <h5>Sender</h5>
                                                <p>{order.sender.name}</p>
                                                <p>{order.sender.email}</p>
                                                <p>{order.sender.phone}</p>
                                                <p>{order.sender.address}, {order.sender.city}, {order.sender.state} {order.sender.zip}</p>
                                            </div>
                                            <div className="participant">
                                                <h5>Receiver</h5>
                                                <p>{order.receiver.name}</p>
                                                <p>{order.receiver.email}</p>
                                                <p>{order.receiver.phone}</p>
                                                <p>{order.receiver.address}, {order.receiver.city}, {order.receiver.state} {order.receiver.zip}</p>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                ))}
            </tbody>
        </table>
    );

    const renderUsersTable = () => (
        <table className="dashboard-table">
            <thead>
                <tr>
                    <th>User ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Registered At</th>
                </tr>
            </thead>
            <tbody>
                {users.map(user => (
                    <tr key={user._id}>
                        <td>{user._id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    const renderContactMessagesTable = () => (
        <table className="dashboard-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Subject</th>
                    <th>Message</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                {contactMessages.map(msg => (
                    <tr key={msg._id}>
                        <td>{msg.name}</td>
                        <td>{msg.email}</td>
                        <td>{msg.subject || '-'}</td>
                        <td>{msg.message}</td>
                        <td>{formatDate(msg.createdAt)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    return (
        <div className="admin-dashboard">
            <div className="dashboard-content">
                {activeTab === 'orders' ? renderOrdersTable() :
                 activeTab === 'users' ? renderUsersTable() :
                 activeTab === 'contact' ? renderContactMessagesTable() : null}
            </div>
        </div>
    );
};

export default AdminDashboard; 