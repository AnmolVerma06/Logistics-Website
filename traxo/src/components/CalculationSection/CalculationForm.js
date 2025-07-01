import React, { useState, useEffect } from 'react';
import Icon  from '../../images/arrow.svg'
import { useNavigate } from 'react-router-dom';

const CalculationForm = (props) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        deliverCity: '',
        departureCity: '',
        freightType: '',
        insurance: '',
        deliveryOption: '',
        weight: '',
    });

    const [errors, setErrors] = useState({});
    const [submitStatus, setSubmitStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(Boolean(localStorage.getItem('userName')));

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
        { value: 'road', label: 'Road Freight' },
        { value: 'rail', label: 'Rail Freight' },
        { value: 'air', label: 'Air Freight (+₹2000)' },
        { value: 'ocean', label: 'Ocean Freight (+₹500)' }
    ];

    // Insurance options
    const insuranceOptions = [
        { value: 'no', label: 'No Insurance' },
        { value: 'yes', label: 'With Insurance (+₹100)' }
    ];

    // Delivery options
    const deliveryOptions = [
        { value: 'standard', label: 'Standard Delivery' },
        { value: 'express', label: 'Express Delivery (+₹200)' }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.name) newErrors.name = 'Full Name';
        if (!formData.email) {
            newErrors.email = 'Email Address';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Invalid email address';
        }
        if (!formData.phone) newErrors.phone = 'Phone Number';
        if (!formData.deliverCity) newErrors.deliverCity = 'Deliver City';
        if (!formData.departureCity) newErrors.departureCity = 'Departure City';
        if (!formData.freightType) newErrors.freightType = 'Freight Type';
        if (!formData.insurance) newErrors.insurance = 'Insurance';
        if (!formData.deliveryOption) newErrors.deliveryOption = 'Delivery Option';
        if (!formData.weight) newErrors.weight = 'Weight';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const getDistanceAndSave = async (from, to) => {
        setLoading(true);
        try {
            // Just use the city value directly
            const response = await fetch('http://localhost:5000/api/calculate-distance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    origin: from,
                    destination: to
                })
            });

            const data = await response.json();

            if (data.success) {
                // Save complete form data to localStorage
                localStorage.setItem('transfar_price_calc', JSON.stringify({
                    from,
                    to,
                    distanceKm: data.distance,
                    price: data.price,
                    // Save all form data
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    departureCity: formData.departureCity,
                    deliverCity: formData.deliverCity,
                    freightType: formData.freightType,
                    insurance: formData.insurance,
                    deliveryOption: formData.deliveryOption,
                    weight: formData.weight
                }));
                setLoading(false);
                navigate('/shop');
            } else {
                setLoading(false);
                setSubmitStatus('error');
                alert(data.error || 'Could not calculate distance. Please check city names.');
            }
        } catch (err) {
            setLoading(false);
            setSubmitStatus('error');
            alert('Error connecting to backend server. Please make sure the backend is running.');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            getDistanceAndSave(formData.departureCity, formData.deliverCity);
        } else {
            setSubmitStatus('error');
        }
    };

    const {SectionTitleShow = false} = props;

    useEffect(() => {
        const handleStorage = () => {
            setIsLoggedIn(Boolean(localStorage.getItem('userName')));
        };
        window.addEventListener('storage', handleStorage);
        window.addEventListener('user-login', handleStorage);
        window.addEventListener('user-logout', handleStorage);
        window.addEventListener('focus', handleStorage); // In case login happens in another tab
        return () => {
            window.removeEventListener('storage', handleStorage);
            window.removeEventListener('user-login', handleStorage);
            window.removeEventListener('user-logout', handleStorage);
            window.removeEventListener('focus', handleStorage);
        };
    }, []);

    return (
        <div className="wpo-contact-form-area" style={{ position: 'relative' }}>
            {!isLoggedIn && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(255,255,255,0.85)',
                    zIndex: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    fontSize: '1.2rem',
                    color: '#177265',
                    fontWeight: 600,
                    borderRadius: 8
                }}>
                    <div>Please log in to use the calculation form.</div>
                </div>
            )}
            {SectionTitleShow && (
                    <div className="wpo-section-title">
                        <span>FREIGHT FORM</span>
                        <h2>Easy to check your product transportation price.</h2>
                    </div>
            )}
            <form onSubmit={handleSubmit} className="contact-validation-active">
                <div className="personal-info">
                    <h5>PERSONAL INFO:</h5>
                    <div className="row">
                        <div className="form-group col-lg-4 col-md-6 col-12">
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                placeholder="Your Name*"
                                value={formData.name}
                                onChange={handleChange}
                                disabled={!isLoggedIn}
                            />
                            {errors.name && <div className="error">{errors.name}</div>}
                        </div>
                        <div className="form-group col-lg-4 col-md-6 col-12">
                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                placeholder="Your Email*"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={!isLoggedIn}
                            />
                            {errors.email && <div className="error">{errors.email}</div>}
                        </div>
                        <div className="form-group col-lg-4 col-md-6 col-12">
                            <input
                                type="text"
                                className="form-control"
                                name="phone"
                                placeholder="Phone"
                                value={formData.phone}
                                onChange={handleChange}
                                disabled={!isLoggedIn}
                            />
                            {errors.phone && <div className="error">{errors.phone}</div>}
                        </div>
                    </div>
                </div>
                <div className="shipt-info">
                    <h5>SHIPMENT INFO:</h5>
                    <div className="row">
                        <div className="form-group col-lg-4 col-md-6 col-12">
                            <select
                                name="deliverCity"
                                className="form-control"
                                value={formData.deliverCity}
                                onChange={handleChange}
                                disabled={!isLoggedIn}
                            >
                                <option value="" disabled>Select Deliver City*</option>
                                {cities.map((city, index) => (
                                    <option key={index} value={city.value}>
                                        {city.label}
                                    </option>
                                ))}
                            </select>
                            {errors.deliverCity && (
                                <div className="error">{errors.deliverCity}</div>
                            )}
                        </div>
                        <div className="form-group col-lg-4 col-md-6 col-12">
                            <select
                                name="departureCity"
                                className="form-control"
                                value={formData.departureCity}
                                onChange={handleChange}
                                disabled={!isLoggedIn}
                            >
                                <option value="" disabled>Select Departure City*</option>
                                {cities.map((city, index) => (
                                    <option key={index} value={city.value}>
                                        {city.label}
                                    </option>
                                ))}
                            </select>
                            {errors.departureCity && (
                                <div className="error">{errors.departureCity}</div>
                            )}
                        </div>
                        <div className="form-group col-lg-4 col-md-6 col-12">
                            <select
                                name="freightType"
                                className="form-control"
                                value={formData.freightType}
                                onChange={handleChange}
                                disabled={!isLoggedIn}
                            >
                                <option disabled="disabled" value="">
                                    Freight Type
                                </option>
                                {freightTypes.map((type, index) => (
                                    <option key={index} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                            {errors.freightType && (
                                <div className="error">{errors.freightType}</div>
                            )}
                        </div>
                        <div className="form-group col-lg-4 col-md-6 col-12">
                            <select
                                name="insurance"
                                className="form-control"
                                value={formData.insurance}
                                onChange={handleChange}
                                disabled={!isLoggedIn}
                            >
                                <option disabled="disabled" value="">
                                    Insurance
                                </option>
                                <option value="no">No</option>
                                <option value="yes">Yes</option>
                            </select>
                            {errors.insurance && (
                                <div className="error">{errors.insurance}</div>
                            )}
                        </div>
                        <div className="form-group col-lg-4 col-md-6 col-12">
                            <input
                                type="text"
                                className="form-control"
                                name="weight"
                                placeholder="Weight (kg)"
                                value={formData.weight}
                                onChange={handleChange}
                                disabled={!isLoggedIn}
                            />
                            {errors.weight && <div className="error">{errors.weight}</div>}
                        </div>
                        <div className="form-group col-lg-4 col-md-6 col-12">
                            <select
                                name="deliveryOption"
                                className="form-control"
                                value={formData.deliveryOption}
                                onChange={handleChange}
                                disabled={!isLoggedIn}
                            >
                                <option disabled="disabled" value="">
                                    Delivery Option
                                </option>
                                <option value="standard">Standard Delivery</option>
                                <option value="express">Express Delivery</option>
                            </select>
                            {errors.deliveryOption && <div className="error">{errors.deliveryOption}</div>}
                        </div>
                    </div>
                </div>
                <div className="submit-area">
                    <button type="submit" className="theme-btn" disabled={loading || !isLoggedIn}>
                        {loading ? 'Calculating...' : (<><span>GET A QUOTE</span> <i><img src={Icon} alt="" /></i></>)}
                    </button>
                    <div id="c-loader">
                        <i className="ti-reload"></i>
                    </div>
                </div>
                <div className="clearfix error-handling-messages">
                    {submitStatus === 'success' && <div id="c-success">Thank you</div>}
                    {submitStatus === 'error' && (
                        <div id="c-error">
                            Error occurred while sending email. Please try again later.
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};

export default CalculationForm;
