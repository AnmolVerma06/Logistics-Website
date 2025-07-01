import React, { useState, useEffect, useRef } from 'react';
import {Link, useLocation} from 'react-router-dom'
import CheckoutSummary from '../CheckoutSummary/CheckoutSummary';
import DatePicker from 'react-datepicker';
import './style.scss'

const OrderRecivedSec = ({cartList}) => {
    const location = useLocation();
    const [shippingCost, setShippingCost] = useState(null);
    const [pickupDate, setPickupDate] = useState(null);
    const [deliveryDateStart, setDeliveryDateStart] = useState(null);
    const [deliveryDateEnd, setDeliveryDateEnd] = useState(null);
    const [orderGrandTotal, setOrderGrandTotal] = useState(null);
    const [orderSubtotal, setOrderSubtotal] = useState(null);
    const [senderDetails, setSenderDetails] = useState(null);
    const [receiverDetails, setReceiverDetails] = useState(null);
    const [orderId, setOrderId] = useState(null);
    const [orderSaved, setOrderSaved] = useState(false);
    const saveAttempted = useRef(false);
    const [copied, setCopied] = useState(false);
    const [calcFields, setCalcFields] = useState({ departureCity: '', deliverCity: '', weight: '', freightType: '' });

    useEffect(() => {
        if (orderSaved) {
            // Listeners are cleaned up by the return function, so we can just exit.
            return;
        }

        const blockNavigation = (event) => {
            // This triggers a browser-native confirmation dialog on reload or close.
            event.preventDefault();
            event.returnValue = '';
            return '';
        };

        const blockBackButton = () => {
            // This pushes the same page back to the history stack, preventing 'back'.
            console.log("Back button press detected and blocked.");
            window.history.pushState(null, '', window.location.href);
        };

        // On mount, push a state to capture the back button event
        window.history.pushState(null, '', window.location.href);
        
        window.addEventListener('beforeunload', blockNavigation);
        window.addEventListener('popstate', blockBackButton);

        // This cleanup function runs when `orderSaved` becomes true, removing the blocks.
        return () => {
            window.removeEventListener('beforeunload', blockNavigation);
            window.removeEventListener('popstate', blockBackButton);
        };
    }, [orderSaved]);

    useEffect(() => {
        // Generate a unique order ID once on component mount
        if (!orderId) { // Only set if it doesn't have a value
            setOrderId(`ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
        }

        try {
            const storedCost = localStorage.getItem('transfar_shipping_cost');
            if (storedCost) setShippingCost(JSON.parse(storedCost));
            
            const grandTotal = localStorage.getItem('transfar_order_grand_total');
            if (grandTotal) setOrderGrandTotal(grandTotal);

            const subtotal = localStorage.getItem('transfar_order_subtotal');
            if (subtotal) setOrderSubtotal(subtotal);

            const sender = localStorage.getItem('transfar_sender_details');
            if (sender) setSenderDetails(JSON.parse(sender));

            const receiver = localStorage.getItem('transfar_receiver_details');
            if (receiver) setReceiverDetails(JSON.parse(receiver));

            const calcData = JSON.parse(localStorage.getItem('transfar_price_calc') || '{}');
            setCalcFields({
                departureCity: calcData.departureCity || calcData.from || '',
                deliverCity: calcData.deliverCity || calcData.to || '',
                weight: calcData.weight || '',
                freightType: calcData.freightType || ''
            });

        } catch (e) {
            console.error("Failed to parse data from localStorage", e);
        }
    }, []);

    useEffect(() => {
        if (!shippingCost) return;

        const today = new Date();
        const pickupDateValue = new Date();
        
        const isExpress = shippingCost.addOns?.expressCharge > 0;
        const freightCharge = shippingCost.addOns?.freightCharge;

        if (isExpress) {
            pickupDateValue.setDate(today.getDate());
        } else {
            pickupDateValue.setDate(today.getDate() + 1);
            if (pickupDateValue.getDay() === 0) {
                pickupDateValue.setDate(pickupDateValue.getDate() + 1);
            } else if (pickupDateValue.getDay() === 6) {
                pickupDateValue.setDate(pickupDateValue.getDate() + 2);
            }
        }
        setPickupDate(pickupDateValue);

        const deliveryStart = new Date(pickupDateValue);
        const deliveryEnd = new Date(pickupDateValue);

        if (freightCharge === 2000) { // Air freight
            if (isExpress) {
                deliveryStart.setDate(pickupDateValue.getDate()); // same day
                deliveryEnd.setDate(pickupDateValue.getDate());   // same day
            } else {
                deliveryStart.setDate(pickupDateValue.getDate() + 1);
                deliveryEnd.setDate(pickupDateValue.getDate() + 1);
            }
        } else { // Road or Rail
            if (isExpress) {
                deliveryStart.setDate(pickupDateValue.getDate() + 2); // was +3
                deliveryEnd.setDate(pickupDateValue.getDate() + 3);   // was +4
            } else {
                deliveryStart.setDate(pickupDateValue.getDate() + 3);
                deliveryEnd.setDate(pickupDateValue.getDate() + 4);
            }
        }
        setDeliveryDateStart(deliveryStart);
        setDeliveryDateEnd(deliveryEnd);

    }, [shippingCost]);

    // Effect to save the order to the backend
    useEffect(() => {
        if (
            !orderId ||
            orderSaved ||
            saveAttempted.current ||
            !shippingCost ||
            !senderDetails ||
            !receiverDetails ||
            !orderGrandTotal ||
            !orderSubtotal ||
            !location.state?.paymentId ||
            !pickupDate || 
            !deliveryDateEnd
        ) return;

        saveAttempted.current = true; // Prevent further attempts

        const clearOrderDataFromStorage = () => {
            localStorage.removeItem('transfar_shipping_cost');
            localStorage.removeItem('transfar_order_grand_total');
            localStorage.removeItem('transfar_order_subtotal');
            localStorage.removeItem('transfar_sender_details');
            localStorage.removeItem('transfar_receiver_details');
            localStorage.removeItem('transfar_price_calc');
            console.log("Cleared order data from localStorage.");
        };

        const orderData = {
            orderId: orderId,
            paymentId: location.state.paymentId,
            cartItems: cartList,
            sender: senderDetails,
            receiver: receiverDetails,
            shippingCost,
            estimatedPickup: pickupDate,
            estimatedDeliveryStart: deliveryDateStart,
            estimatedDeliveryEnd: deliveryDateEnd,
            grandTotal: orderGrandTotal,
            subtotal: orderSubtotal,
            departureCity: calcFields.departureCity,
            deliverCity: calcFields.deliverCity,
            weight: calcFields.weight,
            freightType: calcFields.freightType
        };

        const saveOrder = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/save-order', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(orderData)
                });

                const result = await response.json(); // Get JSON body

                if (response.ok) {
                    console.log('Order processed successfully:', result.message);

                    // If order already existed (200), use its data to update the view
                    if (response.status === 200 && result.order) {
                        setOrderId(result.order.orderId); // Update orderId to the one from DB
                        // Also update dates if they exist in the response
                        if(result.order.estimatedPickup) setPickupDate(new Date(result.order.estimatedPickup));
                        if(result.order.estimatedDeliveryStart) setDeliveryDateStart(new Date(result.order.estimatedDeliveryStart));
                        if(result.order.estimatedDeliveryEnd) setDeliveryDateEnd(new Date(result.order.estimatedDeliveryEnd));
                    }
                    
                    setOrderSaved(true); // Mark as saved
                    clearOrderDataFromStorage(); // Clean up local storage
                    
                } else {
                    console.error('Failed to save order:', result.error);
                }
            } catch (error) {
                console.error('Error saving order:', error);
            }
        };

        saveOrder();

    }, [
        cartList, shippingCost, senderDetails, receiverDetails, orderGrandTotal,
        orderSubtotal, pickupDate, deliveryDateStart, deliveryDateEnd, location.state, orderId, orderSaved, calcFields
    ]);
    
    return(
        <section className="cart-recived-section section-padding">
            <div className="container">
                <div className="row">
                    <div className="order-top">
                        <h2>Thank You For Your Order! <span>your order has been received</span></h2>
                        <div style={{ color: '#b85c00', fontWeight: 500, margin: '12px 0 16px 0', fontSize: '1rem', background: '#fffbe6', padding: '8px 16px', borderRadius: '6px', border: '1px solid #ffe58f' }}>
                            Please save this Order ID for tracking and assistance with your order.


                        </div>
                        <div className="order-meta-info">
                            <div className="meta-item">
                                <label>Order ID</label>
                                <span className="order-id-value" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                                    {orderId || 'Generating...'}
                                    {orderId && (
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(orderId);
                                                setCopied(true);
                                                setTimeout(() => setCopied(false), 1500);
                                            }}
                                            style={{
                                                marginLeft: 8,
                                                background: '#f5f5f5',
                                                border: '1px solid #ccc',
                                                borderRadius: '4px',
                                                padding: '2px 8px',
                                                cursor: 'pointer',
                                                fontSize: '0.95em',
                                                color: '#333',
                                                display: 'flex',
                                                alignItems: 'center',
                                            }}
                                            title="Copy Order ID"
                                        >
                                            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect x="6" y="2" width="9" height="14" rx="2" stroke="#333" strokeWidth="1.5" fill="#fff"/>
                                                <rect x="3" y="5" width="9" height="13" rx="2" stroke="#333" strokeWidth="1.5" fill="#fff"/>
                                            </svg>
                                        </button>
                                    )}
                                    {copied && (
                                        <span style={{ color: '#52c41a', marginLeft: 8, fontSize: '0.95em' }}>Copied!</span>
                                    )}
                                </span>
                            </div>
                            <div className="meta-item">
                                <label>Order Status</label>
                                <span className="order-status-value">{orderSaved ? 'Confirmed' : 'Processing...'}</span>
                            </div>
                        </div>
                        <div className="estimated-dates">
                            <div className="date-item">
                                <label>Estimated Pickup</label>
                                <DatePicker
                                    selected={pickupDate}
                                    onChange={() => {}}
                                    disabled
                                    dateFormat="EEE, d MMM yyyy"
                                    className="date-picker-input"
                                />
                            </div>
                            <div className="date-item">
                                <label>Estimated Delivery</label>
                                <div className="date-range-display">
                                    {deliveryDateStart && deliveryDateEnd ? 
                                        (deliveryDateStart.getTime() === deliveryDateEnd.getTime() ?
                                            deliveryDateStart.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) :
                                            `${deliveryDateStart.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} - ${deliveryDateEnd.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`)
                                        : 'Calculating...'
                                    }
                                </div>
                            </div>
                        </div>
                        <Link to='/home' className="theme-btn">Back Home</Link>
                    </div>

                    {senderDetails && receiverDetails && (
                        <div className="shipping-details-columns">
                            <div className="shipping-column">
                                <h3>Sender Details</h3>
                                <p><strong>Name:</strong> {senderDetails.name}</p>
                                <p><strong>Address:</strong> {senderDetails.address}</p>
                                <p><strong>Location:</strong> {senderDetails.district}, {senderDetails.country} - {senderDetails.post_code}</p>
                                <p><strong>Email:</strong> {senderDetails.email}</p>
                                <p><strong>Phone:</strong> {senderDetails.phone}</p>
                            </div>
                            <div className="shipping-column">
                                <h3>Receiver Details</h3>
                                <p><strong>Name:</strong> {receiverDetails.name}</p>
                                <p><strong>Address:</strong> {receiverDetails.address}</p>
                                <p><strong>Location:</strong> {receiverDetails.district}, {receiverDetails.country} - {receiverDetails.post_code}</p>
                                <p><strong>Email:</strong> {receiverDetails.email}</p>
                                <p><strong>Phone:</strong> {receiverDetails.phone}</p>
                            </div>
                        </div>
                    )}
                    
                    <div style={{marginTop: '2rem', width: '100%'}}>
                        <CheckoutSummary
                            cartItems={cartList}
                            shippingCost={shippingCost}
                            subtotal={orderSubtotal ? Number(orderSubtotal) : undefined}
                            grandTotal={orderGrandTotal ? Number(orderGrandTotal) : undefined}
                            departureCity={calcFields.departureCity}
                            deliverCity={calcFields.deliverCity}
                            weight={calcFields.weight}
                            freightType={calcFields.freightType}
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default OrderRecivedSec;