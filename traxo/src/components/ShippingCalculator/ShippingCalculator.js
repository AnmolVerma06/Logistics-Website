import React, { useState } from 'react';
import './ShippingCalculator.scss';

const ShippingCalculator = ({ cartItems, onShippingCalculated }) => {
    const [shippingData, setShippingData] = useState({
        departureCity: '',
        deliveryCity: '',
        freightType: 'road',
        insurance: 'no',
        deliveryOption: 'standard'
    });
    const [shippingCost, setShippingCost] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // List of 25 major Indian cities
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

    // Freight type options
    const freightTypes = [
        { value: 'road', label: 'Road Transport' },
        { value: 'rail', label: 'Rail Transport' },
        { value: 'air', label: 'Air Freight (+₹2000)' },
        { value: 'ocean', label: 'Ocean Freight (+₹500)' }
    ];

    // Insurance options
    const insuranceOptions = [
        { value: 'no', label: 'No Insurance' },
        { value: 'yes', label: 'Yes (+₹100)' }
    ];

    // Delivery options
    const deliveryOptions = [
        { value: 'standard', label: 'Standard Delivery' },
        { value: 'express', label: 'Express Delivery (+₹200)' }
    ];

    // Aggregate cart items
    const calculateCartTotals = () => {
        if (!cartItems || cartItems.length === 0) return null;
        let totalWeight = 0, length = 0, width = 0, height = 0;
        cartItems.forEach(item => {
            // Assume item.weight is a number (kg)
            totalWeight += Number(item.weight) * item.qty;
            // Assume item.dimensions = "LxWxH" in cm or "Lcm x Wcm x Hcm"
            let dims = [];
            if (typeof item.dimensions === 'string') {
                dims = item.dimensions.match(/\d+/g) || [];
            }
            if (dims.length === 3) {
                const l = parseFloat(dims[0]) || 0;
                const w = parseFloat(dims[1]) || 0;
                const h = parseFloat(dims[2]) || 0;
                length = Math.max(length, l);
                width = Math.max(width, w);
                height = Math.max(height, h);
            }
        });
        return { weight: totalWeight, length, width, height };
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingData(prev => ({ ...prev, [name]: value }));
    };

    const calculateShipping = async () => {
        if (!shippingData.departureCity || !shippingData.deliveryCity) {
            setError('Please select both departure and delivery cities');
            return;
        }
        const cartTotals = calculateCartTotals();
        if (!cartTotals) {
            setError('No items in cart to calculate shipping');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/calculate-price', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    departureCity: shippingData.departureCity,
                    deliveryCity: shippingData.deliveryCity,
                    actualWeight: cartTotals.weight,
                    length: cartTotals.length,
                    width: cartTotals.width,
                    height: cartTotals.height,
                    freightType: shippingData.freightType,
                    insurance: shippingData.insurance,
                    deliveryOption: shippingData.deliveryOption
                })
            });
            const data = await response.json();
            if (data.success) {
                setShippingCost(data);
                if (onShippingCalculated) onShippingCalculated(data);
            } else {
                setError(data.error || 'Failed to calculate shipping cost');
            }
        } catch (err) {
            setError('Failed to calculate shipping cost');
        } finally {
            setLoading(false);
        }
    };

    const cartTotals = calculateCartTotals();

    return (
        <div className="shipping-calculator">
            <div className="calculator-header">
                <h3>Shipping Calculator</h3>
                <p>Calculate shipping cost for your order</p>
            </div>

            <div className="calculator-form">
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="departureCity">Departure City *</label>
                        <select
                            id="departureCity"
                            name="departureCity"
                            value={shippingData.departureCity}
                            onChange={handleInputChange}
                            className="form-control"
                        >
                            <option value="">Select Departure City</option>
                            {cities.map((city, index) => (
                                <option key={index} value={city.value}>
                                    {city.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="deliveryCity">Delivery City *</label>
                        <select
                            id="deliveryCity"
                            name="deliveryCity"
                            value={shippingData.deliveryCity}
                            onChange={handleInputChange}
                            className="form-control"
                        >
                            <option value="">Select Delivery City</option>
                            {cities.map((city, index) => (
                                <option key={index} value={city.value}>
                                    {city.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="freightType">Freight Type</label>
                        <select
                            id="freightType"
                            name="freightType"
                            value={shippingData.freightType}
                            onChange={handleInputChange}
                            className="form-control"
                        >
                            {freightTypes.map((type, index) => (
                                <option key={index} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="insurance">Insurance</label>
                        <select
                            id="insurance"
                            name="insurance"
                            value={shippingData.insurance}
                            onChange={handleInputChange}
                            className="form-control"
                        >
                            {insuranceOptions.map((option, index) => (
                                <option key={index} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="deliveryOption">Delivery Option</label>
                        <select
                            id="deliveryOption"
                            name="deliveryOption"
                            value={shippingData.deliveryOption}
                            onChange={handleInputChange}
                            className="form-control"
                        >
                            {deliveryOptions.map((option, index) => (
                                <option key={index} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {cartTotals && (
                    <div className="cart-summary">
                        <h4>Order Summary</h4>
                        <div className="summary-grid">
                            <div className="summary-item">
                                <span>Total Weight:</span>
                                <span>{cartTotals.weight.toFixed(2)} kg</span>
                            </div>
                            <div className="summary-item">
                                <span>Dimensions:</span>
                                <span>{cartTotals.length}cm × {cartTotals.width}cm × {cartTotals.height}cm</span>
                            </div>
                            <div className="summary-item">
                                <span>Items:</span>
                                <span>{cartItems.length}</span>
                            </div>
                        </div>
                    </div>
                )}

                <div className="form-actions">
                    <button
                        type="button"
                        onClick={calculateShipping}
                        disabled={loading || !shippingData.departureCity || !shippingData.deliveryCity}
                        className="calculate-btn"
                    >
                        {loading ? 'Calculating...' : 'Calculate Shipping'}
                    </button>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {shippingCost && (
                    <div className="shipping-breakdown">
                        <h4>Shipping Cost Breakdown</h4>
                        <div className="breakdown-grid">
                            <div className="breakdown-item">
                                <span>Distance:</span>
                                <span>{shippingCost.breakdown.distance}</span>
                            </div>
                            <div className="breakdown-item">
                                <span>Actual Weight:</span>
                                <span>{shippingCost.breakdown.actualWeight}</span>
                            </div>
                            <div className="breakdown-item">
                                <span>Volumetric Weight:</span>
                                <span>{shippingCost.breakdown.volumetricWeight}</span>
                            </div>
                            <div className="breakdown-item">
                                <span>Chargeable Weight:</span>
                                <span>{shippingCost.breakdown.chargeableWeight}</span>
                            </div>
                            <div className="breakdown-item">
                                <span>Base Rate:</span>
                                <span>{shippingCost.breakdown.baseRate}</span>
                            </div>
                            <div className="breakdown-item">
                                <span>Base Cost:</span>
                                <span>{shippingCost.breakdown.baseCost}</span>
                            </div>
                            {shippingData.freightType !== 'road' && shippingData.freightType !== 'rail' && (
                                <div className="breakdown-item">
                                    <span>Freight Surcharge:</span>
                                    <span>{shippingCost.breakdown.freightSurcharge}</span>
                                </div>
                            )}
                            {shippingData.insurance === 'yes' && (
                                <div className="breakdown-item">
                                    <span>Insurance:</span>
                                    <span>{shippingCost.breakdown.insuranceSurcharge}</span>
                                </div>
                            )}
                            {shippingData.deliveryOption === 'express' && (
                                <div className="breakdown-item">
                                    <span>Express Delivery:</span>
                                    <span>{shippingCost.breakdown.deliverySurcharge}</span>
                                </div>
                            )}
                            <div className="breakdown-item subtotal">
                                <span>Subtotal:</span>
                                <span>{shippingCost.breakdown.subtotal}</span>
                            </div>
                            <div className="breakdown-item gst">
                                <span>GST (18%):</span>
                                <span>{shippingCost.breakdown.gst}</span>
                            </div>
                            <div className="breakdown-item total">
                                <span>Total Shipping:</span>
                                <span>{shippingCost.breakdown.total}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShippingCalculator; 