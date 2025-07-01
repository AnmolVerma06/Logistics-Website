import React from 'react';
import './CheckoutSummary.scss';
import { totalPrice } from "../../utils";

const CheckoutSummary = ({ cartItems, shippingCost, subtotal, grandTotal, departureCity, deliverCity, weight, freightType }) => {
    // Calculate subtotal and total robustly
    const shippingSubtotal = shippingCost && (typeof shippingCost.subtotal === 'number' ? shippingCost.subtotal : (shippingCost.breakdown && parseFloat((shippingCost.breakdown.subtotal || '').toString().replace(/[^\d.]/g, '')))) || 0;
    const shippingTotal = shippingCost && (typeof shippingCost.totalCost === 'number' ? shippingCost.totalCost : (shippingCost.breakdown && parseFloat((shippingCost.breakdown.total || '').toString().replace(/[^\d.]/g, '')))) || 0;
    const cartSubtotal = cartItems && cartItems.length > 0 ? totalPrice(cartItems) : 0;
    // Prefer explicit subtotal prop, then shippingCost.subtotal, then cartSubtotal
    const subtotalToShow = typeof subtotal === 'number' ? subtotal : (shippingSubtotal > 0 ? shippingSubtotal : cartSubtotal);
    // Prefer explicit grandTotal prop, then shippingCost.totalCost, then fallback
    const grandTotalToShow = typeof grandTotal === 'number' ? grandTotal : (shippingTotal > 0 ? shippingTotal : (cartSubtotal + shippingSubtotal));

    // Helper function to get shipping details
    const getShippingDetails = () => {
        if (!shippingCost) return null;
        
        const details = [];
        
        // Add freight type info
        if (shippingCost.freightSurcharge > 0) {
            if (shippingCost.freightSurcharge === 2000) {
                details.push('Air Freight');
            } else if (shippingCost.freightSurcharge === 500) {
                details.push('Ocean Freight');
            }
        } else {
            details.push('Road/Rail Transport');
        }
        
        // Add insurance info
        if (shippingCost.insuranceSurcharge > 0) {
            details.push('With Insurance');
        }
        
        // Add delivery option info
        if (shippingCost.deliverySurcharge > 0) {
            details.push('Express Delivery');
        } else {
            details.push('Standard Delivery');
        }
        
        return details.join(' • ');
    };

    return (
        <div className="checkout-summary">
            <div className="summary-header">
                <h3>Order Summary</h3>
            </div>

            <div className="summary-content">
                {/* Order details from calculation */}
                <div className="order-details" style={{marginBottom: '1.5rem', background: '#f8fafc', borderRadius: '8px', padding: '1rem'}}>
                    <div style={{marginBottom: '0.5rem'}}><b>Departure City:</b> {departureCity || '-'}</div>
                    <div style={{marginBottom: '0.5rem'}}><b>Destination City:</b> {deliverCity || '-'}</div>
                    <div style={{marginBottom: '0.5rem'}}><b>Weight:</b> {weight || '-'}</div>
                    <div style={{marginBottom: '0.5rem'}}><b>Freight Type:</b> {freightType || '-'}</div>
                    {shippingCost && (
                        <>
                            <div style={{marginBottom: '0.5rem'}}><b>Chargeable Weight:</b> {shippingCost.chargeableWeight || shippingCost.breakdown?.chargeableWeight || '-'}</div>
                            <div style={{marginBottom: '0.5rem'}}><b>Volumetric Weight:</b> {shippingCost.volumetricWeight || shippingCost.breakdown?.volumetricWeight || '-'}</div>
                            {shippingCost.discountOrMultiplier && (
                                <div style={{marginBottom: '0.5rem'}}><b>Discount/Multiplier:</b> {shippingCost.discountOrMultiplier}</div>
                            )}
                        </>
                    )}
                </div>

                <div className="items-section">
                    <h4>Items ({cartItems.length})</h4>
                    <div className="items-list">
                        {cartItems.map((item, index) => {
                            const price = Number(item.price) || 0;
                            return (
                                <div key={index} className="item">
                                    <div className="item-info">
                                        <img src={item.proImg} alt={item.title} />
                                        <div className="item-details">
                                            <h5>{item.title}</h5>
                                            <p>Qty: {item.qty}</p>
                                            {item.weight && <p>Weight: {item.weight}</p>}
                                            {item.dimensions && <p>Dimensions: {item.dimensions}</p>}
                                        </div>
                                    </div>
                                    <div className="item-price">
                                        ₹{(item.qty * price).toFixed(2)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="cost-breakdown">
                    <div className="breakdown-item">
                        <span>Subtotal (Products):</span>
                        <span>₹{subtotalToShow.toFixed(2)}</span>
                    </div>
                    {shippingCost && (
                        <>
                            <div className="breakdown-item"><span>Base Shipping:</span><span>₹{shippingCost.baseShippingCost ?? shippingCost.breakdown?.baseShipping ?? '-'}</span></div>
                            <div className="breakdown-item"><span>Fuel Surcharge ({shippingCost.fuelSurchargePercent ?? '-'}%):</span><span>₹{shippingCost.fuelSurcharge ?? shippingCost.breakdown?.fuelSurcharge ?? '-'}</span></div>
                            <div className="breakdown-item"><span>Handling:</span><span>₹{shippingCost.handlingCharge ?? shippingCost.breakdown?.handling ?? '-'}</span></div>
                            <div className="breakdown-item"><span>Insurance:</span><span>₹{shippingCost.addOns?.insurance ?? shippingCost.breakdown?.insurance ?? '-'}</span></div>
                            <div className="breakdown-item"><span>Express:</span><span>₹{shippingCost.addOns?.expressCharge ?? shippingCost.breakdown?.express ?? '-'}</span></div>
                            <div className="breakdown-item"><span>Freight:</span><span>₹{shippingCost.addOns?.freightCharge ?? shippingCost.breakdown?.freight ?? '-'}</span></div>
                            <div className="breakdown-item"><span>Shipping Subtotal:</span><span>₹{shippingCost.subtotal ?? shippingCost.breakdown?.subtotal ?? '-'}</span></div>
                            <div className="breakdown-item"><span>GST (18%):</span><span>₹{shippingCost.gst ?? shippingCost.breakdown?.gst ?? '-'}</span></div>
                            <div className="breakdown-item"><span><b>Total Shipping:</b></span><span><b>₹{shippingCost.totalCost ?? shippingCost.breakdown?.total ?? '-'}</b></span></div>
                        </>
                    )}
                    <div className="breakdown-item total">
                        <span>Grand Total:</span>
                        <span>₹{grandTotalToShow.toFixed(2)}</span>
                    </div>
                </div>

                <div className="shipping-info">
                    {shippingCost && (
                        <div className="shipping-note">
                            <i className="fi ti-truck"></i>
                            <span>
                                Estimated delivery: 3-7 business days
                                {shippingCost.deliverySurcharge > 0 && ' (Express)'}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CheckoutSummary; 