import React, { Fragment, useState, useEffect } from 'react';
// import Grid from "@mui/material/Grid";
// import Collapse from "@mui/material/Collapse";
import FontAwesome from "../../components/UiStyle/FontAwesome";
// import Button from "@mui/material/Button";
// import TextField from "@mui/material/TextField";
// import FormControl from "@mui/material/FormControl";
// import InputLabel from "@mui/material/InputLabel";
// import Select from "@mui/material/Select";
// import MenuItem from "@mui/material/MenuItem";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import Checkbox from "@mui/material/Checkbox";
// import RadioGroup from "@mui/material/RadioGroup";
// import Radio from "@mui/material/Radio";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableRow from "@mui/material/TableRow";
// import TableCell from "@mui/material/TableCell";
import { Link, useNavigate } from 'react-router-dom'
import { totalPrice } from "../../utils";
import CheckoutSummary from '../CheckoutSummary/CheckoutSummary';

// images
import visa from '../../images/checkout/img-1.png';
import mastercard from '../../images/checkout/img-2.png';
import skrill from '../../images/checkout/img-3.png';
import paypal from '../../images/checkout/img-1.png';



import './style.scss';

const cardType = [
    {
        title: 'visa',
        img: visa
    },
    {
        title: 'mastercard',
        img: mastercard
    },
    {
        title: 'skrill',
        img: skrill
    },
    {
        title: 'paypal',
        img: paypal
    },
];

const senderFields = [
    'fname', 'lname', 'country', 'dristrict', 'address', 'post_code', 'email', 'phone'
];
const receiverFields = [
    'fname2', 'lname2', 'country2', 'dristrict2', 'address2', 'post_code2', 'email2', 'phone2'
];

const RAZORPAY_KEY = 'rzp_test_45KjxdqPyredPs';

const CheckoutSection = ({ cartList }) => {
    // states
    const [tabs, setExpanded] = useState({
        cupon: false,
        billing_adress: true,
        shipping: false,
        payment: true
    });
    const [forms, setForms] = useState({
        cupon_key: '',
        fname: '',
        lname: '',
        country: '',
        dristrict: '',
        address: '',
        post_code: '',
        email: '',
        phone: '',
        note: '',
        payment_method: 'cash',
        card_type: '',
        fname2: '',
        lname2: '',
        country2: '',
        dristrict2: '',
        address2: '',
        post_code2: '',
        email2: '',
        phone2: '',
        card_holder: '',
        card_number: '',
        cvv: '',
        expire_date: '',
    });
    const [errors, setErrors] = useState({});
    const [dif_ship, setDif_ship] = useState(true);
    const [shippingCost, setShippingCost] = useState(null);
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);
    const navigate = useNavigate();

    // Automatically calculate shipping cost when cart changes
    useEffect(() => {
        if (!cartList || cartList.length === 0) {
            setShippingCost(null);
            return;
        }
        const formData = JSON.parse(localStorage.getItem('transfar_price_calc') || '{}');
        if (!formData.from || !formData.to) {
            setShippingCost(null);
            return;
        }
        fetch('http://localhost:5000/api/calculate-with-cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                cartItems: cartList, 
                calculationData: {
                    departureCity: formData.departureCity || formData.from,
                    deliverCity: formData.deliverCity || formData.to,
                    freightType: formData.freightType || 'road',
                    insurance: formData.insurance || 'no',
                    deliveryOption: formData.deliveryOption || 'standard'
                }
            })
        })
            .then(res => res.json())
            .then(data => { 
                if (data.success) {
                    setShippingCost(data); 
                    localStorage.setItem('transfar_shipping_cost', JSON.stringify(data));
                } else {
                    setShippingCost(null); 
                    localStorage.removeItem('transfar_shipping_cost');
                }
            })
            .catch(() => {
                setShippingCost(null);
                localStorage.removeItem('transfar_shipping_cost');
            });
    }, [cartList]);

    // Load Razorpay script
    useEffect(() => {
        if (!window.Razorpay) {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            script.onload = () => setRazorpayLoaded(true);
            document.body.appendChild(script);
        } else {
            setRazorpayLoaded(true);
        }
    }, []);

    // Calculate total with shipping
    const calculateTotalWithShipping = () => {
        const subtotal = totalPrice(cartList);
        const shipping = shippingCost ? shippingCost.totalCost : 0;
        return subtotal + shipping;
    };

    // tabs handler
    function faqHandler(name) {
        setExpanded({
            cupon: false,
            billing_adress: false,
            shipping: false,
            payment: true, 
            [name]: !tabs[name]
        });
    }

    // forms handler
    const changeHandler = e => {
        setForms({ ...forms, [e.target.name]: e.target.value })
        setErrors({ ...errors, [e.target.name]: '' });
    };

    // Validation for required fields (sender and receiver)
    const validateBilling = () => {
        const newErrors = {};
        senderFields.forEach(field => {
            if (!forms[field] || forms[field].trim() === '') {
                newErrors[field] = 'Required';
            }
        });
        receiverFields.forEach(field => {
            if (!forms[field] || forms[field].trim() === '') {
                newErrors[field] = 'Required';
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleBillingSubmit = (e) => {
        e.preventDefault();
        if (validateBilling()) {
            // Proceed to next step or submit order
            alert('Billing address submitted!');
        }
    };

    // Razorpay payment handler
    const handleRazorpayPayment = () => {
        if (!razorpayLoaded) {
            alert('Payment gateway is loading. Please wait.');
            return;
        }
        const subtotal = totalPrice(cartList);
        const shipping = shippingCost ? shippingCost.totalCost : 0;
        const grandTotal = subtotal + shipping;
        const totalAmount = Math.round(grandTotal * 100); // in paise
        const options = {
            key: RAZORPAY_KEY,
            amount: totalAmount,
            currency: 'INR',
            name: 'Transfar',
            description: 'Order Payment',
            image: '',
            handler: function (response) {
                // Store order totals for order_received page
                localStorage.setItem('transfar_order_grand_total', grandTotal.toFixed(2));
                localStorage.setItem('transfar_order_subtotal', subtotal.toFixed(2));

                // Store sender and receiver details
                const senderDetails = {
                    name: `${forms.fname} ${forms.lname}`,
                    country: forms.country,
                    district: forms.dristrict,
                    address: forms.address,
                    post_code: forms.post_code,
                    email: forms.email,
                    phone: forms.phone
                };
                const receiverDetails = {
                    name: `${forms.fname2} ${forms.lname2}`,
                    country: forms.country2,
                    district: forms.dristrict2,
                    address: forms.address2,
                    post_code: forms.post_code2,
                    email: forms.email2,
                    phone: forms.phone2
                };
                localStorage.setItem('transfar_sender_details', JSON.stringify(senderDetails));
                localStorage.setItem('transfar_receiver_details', JSON.stringify(receiverDetails));

                // Redirect to order received page after payment
                navigate('/order_received', { state: { paymentId: response.razorpay_payment_id } });
            },
            prefill: {
                name: forms.fname + ' ' + forms.lname,
                email: forms.email,
                contact: forms.phone
            },
            notes: {
                address: forms.address
            },
            theme: {
                color: '#27ae60'
            }
        };
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response){
            alert('Payment failed: ' + response.error.description);
        });
        rzp.open();
    };

    return (
        <Fragment>
            <div className="checkoutWrapper section-padding">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="check-form-area">
                                <div className="cuponWrap checkoutCard" style={{marginBottom: '2rem', borderRadius: '8px', border: '1px solid #dedddd', background: '#fafbfc'}}>
                                    <button className="collapseBtn" onClick={() => faqHandler('cupon')} style={{fontWeight: 600, fontSize: '1rem', padding: '1rem', borderRadius: '8px', background: '#f5f7fa', border: 'none', width: '100%', textAlign: 'left'}}>
                                        Have A Coupon? <span style={{color: '#3498db'}}>Click Here To Enter Your Code.</span>
                                        <FontAwesome name={tabs.cupon ? 'minus' : 'plus'} />
                                    </button>
                                    {tabs.cupon && (
                                        <div className="chCardBody" style={{padding: '1.5rem'}}>
                                            <p style={{marginBottom: '1rem'}}>If you have a coupon code, please apply it:</p>
                                            <form className="cuponForm" style={{display: 'flex', gap: '1rem'}}>
                                                <input
                                                    type="text"
                                                    className="formInput radiusNone"
                                                    value={forms.cupon_key}
                                                    name="cupon_key"
                                                    onChange={changeHandler}
                                                    placeholder="Enter coupon code"
                                                    style={{flex: 1, padding: '0.75rem', borderRadius: '6px', border: '1px solid #ccc'}}
                                                />
                                                <button className="cBtn cBtnBlack" style={{padding: '0.75rem 2rem', borderRadius: '6px', background: '#3498db', color: '#fff', border: 'none'}}>Apply</button>
                                            </form>
                                        </div>
                                    )}
                                </div>

                                <div className="cuponWrap checkoutCard" style={{borderRadius: '8px', border: '1px solid #dedddd', background: '#fafbfc'}}>
                                    <button className="collapseBtn" onClick={() => faqHandler('billing_adress')} style={{fontWeight: 600, fontSize: '1rem', padding: '1rem', borderRadius: '8px', background: '#f5f7fa', border: 'none', width: '100%', textAlign: 'left'}}>
                                        Billing Address
                                        <FontAwesome name={tabs.billing_adress ? 'minus' : 'plus'} />
                                    </button>
                                    {tabs.billing_adress && (
                                        <div className="chCardBody" style={{padding: '1.5rem'}}>
                                            <form className="cuponForm" onSubmit={handleBillingSubmit}>
                                                {/* Sender Details */}
                                                <h4 style={{marginBottom: '1rem', color: '#3498db'}}>Sender Details</h4>
                                                <div className="row" style={{rowGap: '1rem'}}>
                                                    <div className="col-sm-6 col-xs-12">
                                                        <label>First Name <span style={{color: 'red'}}>*</span></label>
                                                        <input type="text" name="fname" value={forms.fname} onChange={changeHandler} className={`formInput radiusNone${errors.fname ? ' is-invalid' : ''}`} style={{padding: '0.75rem', borderRadius: '6px', border: errors.fname ? '1px solid red' : '1px solid #ccc'}} />
                                                        {errors.fname && <div style={{color: 'red', fontSize: '0.85rem'}}>{errors.fname}</div>}
                                                    </div>
                                                    <div className="col-sm-6 col-xs-12">
                                                        <label>Last Name <span style={{color: 'red'}}>*</span></label>
                                                        <input type="text" name="lname" value={forms.lname} onChange={changeHandler} className={`formInput radiusNone${errors.lname ? ' is-invalid' : ''}`} style={{padding: '0.75rem', borderRadius: '6px', border: errors.lname ? '1px solid red' : '1px solid #ccc'}} />
                                                        {errors.lname && <div style={{color: 'red', fontSize: '0.85rem'}}>{errors.lname}</div>}
                                                    </div>
                                                    <div className="col-sm-6 col-xs-12">
                                                        <label>Country <span style={{color: 'red'}}>*</span></label>
                                                        <select name="country" value={forms.country} onChange={changeHandler} className={`formSelect${errors.country ? ' is-invalid' : ''}`} style={{padding: '0.75rem', borderRadius: '6px', border: errors.country ? '1px solid red' : '1px solid #ccc'}}>
                                                            <option value="">Select Country</option>
                                                            <option value="India">India</option>
                                                            <option value="United States">United States</option>
                                                            <option value="United Kingdom">United Kingdom</option>
                                                            <option value="Canada">Canada</option>
                                                            <option value="Australia">Australia</option>
                                                            <option value="Germany">Germany</option>
                                                            <option value="France">France</option>
                                                            <option value="Japan">Japan</option>
                                                            <option value="China">China</option>
                                                            <option value="Singapore">Singapore</option>
                                                        </select>
                                                        {errors.country && <div style={{color: 'red', fontSize: '0.85rem'}}>{errors.country}</div>}
                                                    </div>
                                                    <div className="col-sm-6 col-xs-12">
                                                        <label>State/Province <span style={{color: 'red'}}>*</span></label>
                                                        <input type="text" name="dristrict" value={forms.dristrict} onChange={changeHandler} className={`formInput radiusNone${errors.dristrict ? ' is-invalid' : ''}`} style={{padding: '0.75rem', borderRadius: '6px', border: errors.dristrict ? '1px solid red' : '1px solid #ccc'}} />
                                                        {errors.dristrict && <div style={{color: 'red', fontSize: '0.85rem'}}>{errors.dristrict}</div>}
                                                    </div>
                                                    <div className="col-xs-12">
                                                        <label style={{position: 'relative', fontWeight: 500}}>Address <span style={{color: 'red'}}>*</span></label>
                                                        <div style={{position: 'relative'}}>
                                                            <textarea
                                                                name="address"
                                                                value={forms.address}
                                                                onChange={changeHandler}
                                                                className={`formInput radiusNone${errors.address ? ' is-invalid' : ''}`}
                                                                style={{padding: '1.2rem 1rem 0.5rem 1rem', borderRadius: '8px', border: errors.address ? '1px solid red' : '1px solid #ccc', minHeight: '90px', background: '#f8fafc', fontSize: '1rem'}}
                                                                placeholder="Street, Apartment, Area, City, State, Zip"
                                                                rows={4}
                                                            ></textarea>
                                                            {errors.address && <div style={{color: 'red', fontSize: '0.85rem'}}>{errors.address}</div>}
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-6 col-xs-12">
                                                        <label>Post Code <span style={{color: 'red'}}>*</span></label>
                                                        <input type="text" name="post_code" value={forms.post_code} onChange={changeHandler} className={`formInput radiusNone${errors.post_code ? ' is-invalid' : ''}`} style={{padding: '0.75rem', borderRadius: '6px', border: errors.post_code ? '1px solid red' : '1px solid #ccc'}} />
                                                        {errors.post_code && <div style={{color: 'red', fontSize: '0.85rem'}}>{errors.post_code}</div>}
                                                    </div>
                                                    <div className="col-sm-6 col-xs-12">
                                                        <label>Email Address <span style={{color: 'red'}}>*</span></label>
                                                        <input type="email" name="email" value={forms.email} onChange={changeHandler} className={`formInput radiusNone${errors.email ? ' is-invalid' : ''}`} style={{padding: '0.75rem', borderRadius: '6px', border: errors.email ? '1px solid red' : '1px solid #ccc'}} />
                                                        {errors.email && <div style={{color: 'red', fontSize: '0.85rem'}}>{errors.email}</div>}
                                                    </div>
                                                    <div className="col-sm-6 col-xs-12">
                                                        <label>Phone No <span style={{color: 'red'}}>*</span></label>
                                                        <input type="text" name="phone" value={forms.phone} onChange={changeHandler} className={`formInput radiusNone${errors.phone ? ' is-invalid' : ''}`} style={{padding: '0.75rem', borderRadius: '6px', border: errors.phone ? '1px solid red' : '1px solid #ccc'}} />
                                                        {errors.phone && <div style={{color: 'red', fontSize: '0.85rem'}}>{errors.phone}</div>}
                                                    </div>
                                                </div>
                                                {/* Receiver Details */}
                                                <h4 style={{margin: '2rem 0 1rem 0', color: '#27ae60'}}>Receiver Details</h4>
                                                <div className="row" style={{rowGap: '1rem'}}>
                                                    <div className="col-sm-6 col-xs-12">
                                                        <label>First Name <span style={{color: 'red'}}>*</span></label>
                                                        <input type="text" name="fname2" value={forms.fname2} onChange={changeHandler} className={`formInput radiusNone${errors.fname2 ? ' is-invalid' : ''}`} style={{padding: '0.75rem', borderRadius: '6px', border: errors.fname2 ? '1px solid red' : '1px solid #ccc'}} />
                                                        {errors.fname2 && <div style={{color: 'red', fontSize: '0.85rem'}}>{errors.fname2}</div>}
                                                    </div>
                                                    <div className="col-sm-6 col-xs-12">
                                                        <label>Last Name <span style={{color: 'red'}}>*</span></label>
                                                        <input type="text" name="lname2" value={forms.lname2} onChange={changeHandler} className={`formInput radiusNone${errors.lname2 ? ' is-invalid' : ''}`} style={{padding: '0.75rem', borderRadius: '6px', border: errors.lname2 ? '1px solid red' : '1px solid #ccc'}} />
                                                        {errors.lname2 && <div style={{color: 'red', fontSize: '0.85rem'}}>{errors.lname2}</div>}
                                                    </div>
                                                    <div className="col-sm-6 col-xs-12">
                                                        <label>Country <span style={{color: 'red'}}>*</span></label>
                                                        <select name="country2" value={forms.country2} onChange={changeHandler} className={`formSelect${errors.country2 ? ' is-invalid' : ''}`} style={{padding: '0.75rem', borderRadius: '6px', border: errors.country2 ? '1px solid red' : '1px solid #ccc'}}>
                                                            <option value="">Select Country</option>
                                                            <option value="India">India</option>
                                                            <option value="United States">United States</option>
                                                            <option value="United Kingdom">United Kingdom</option>
                                                            <option value="Canada">Canada</option>
                                                            <option value="Australia">Australia</option>
                                                            <option value="Germany">Germany</option>
                                                            <option value="France">France</option>
                                                            <option value="Japan">Japan</option>
                                                            <option value="China">China</option>
                                                            <option value="Singapore">Singapore</option>
                                                        </select>
                                                        {errors.country2 && <div style={{color: 'red', fontSize: '0.85rem'}}>{errors.country2}</div>}
                                                    </div>
                                                    <div className="col-sm-6 col-xs-12">
                                                        <label>State/Province <span style={{color: 'red'}}>*</span></label>
                                                        <input type="text" name="dristrict2" value={forms.dristrict2} onChange={changeHandler} className={`formInput radiusNone${errors.dristrict2 ? ' is-invalid' : ''}`} style={{padding: '0.75rem', borderRadius: '6px', border: errors.dristrict2 ? '1px solid red' : '1px solid #ccc'}} />
                                                        {errors.dristrict2 && <div style={{color: 'red', fontSize: '0.85rem'}}>{errors.dristrict2}</div>}
                                                    </div>
                                                    <div className="col-xs-12">
                                                        <label style={{position: 'relative', fontWeight: 500}}>Address <span style={{color: 'red'}}>*</span></label>
                                                        <div style={{position: 'relative'}}>
                                                            <textarea
                                                                name="address2"
                                                                value={forms.address2}
                                                                onChange={changeHandler}
                                                                className={`formInput radiusNone${errors.address2 ? ' is-invalid' : ''}`}
                                                                style={{padding: '1.2rem 1rem 0.5rem 1rem', borderRadius: '8px', border: errors.address2 ? '1px solid red' : '1px solid #ccc', minHeight: '90px', background: '#f8fafc', fontSize: '1rem'}}
                                                                placeholder="Street, Apartment, Area, City, State, Zip"
                                                                rows={4}
                                                            ></textarea>
                                                            {errors.address2 && <div style={{color: 'red', fontSize: '0.85rem'}}>{errors.address2}</div>}
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-6 col-xs-12">
                                                        <label>Post Code <span style={{color: 'red'}}>*</span></label>
                                                        <input type="text" name="post_code2" value={forms.post_code2} onChange={changeHandler} className={`formInput radiusNone${errors.post_code2 ? ' is-invalid' : ''}`} style={{padding: '0.75rem', borderRadius: '6px', border: errors.post_code2 ? '1px solid red' : '1px solid #ccc'}} />
                                                        {errors.post_code2 && <div style={{color: 'red', fontSize: '0.85rem'}}>{errors.post_code2}</div>}
                                                    </div>
                                                    <div className="col-sm-6 col-xs-12">
                                                        <label>Email Address <span style={{color: 'red'}}>*</span></label>
                                                        <input type="email" name="email2" value={forms.email2} onChange={changeHandler} className={`formInput radiusNone${errors.email2 ? ' is-invalid' : ''}`} style={{padding: '0.75rem', borderRadius: '6px', border: errors.email2 ? '1px solid red' : '1px solid #ccc'}} />
                                                        {errors.email2 && <div style={{color: 'red', fontSize: '0.85rem'}}>{errors.email2}</div>}
                                                    </div>
                                                    <div className="col-sm-6 col-xs-12">
                                                        <label>Phone No <span style={{color: 'red'}}>*</span></label>
                                                        <input type="text" name="phone2" value={forms.phone2} onChange={changeHandler} className={`formInput radiusNone${errors.phone2 ? ' is-invalid' : ''}`} style={{padding: '0.75rem', borderRadius: '6px', border: errors.phone2 ? '1px solid red' : '1px solid #ccc'}} />
                                                        {errors.phone2 && <div style={{color: 'red', fontSize: '0.85rem'}}>{errors.phone2}</div>}
                                                    </div>
                                                </div>
                                                {/* Order Notes */}
                                                <div className="col-xs-12" style={{marginTop: '1.5rem'}}>
                                                    <label>Order Notes</label>
                                                    <textarea placeholder="Note about your order (e.g. delivery instructions, special requests)" name="note" value={forms.note} onChange={changeHandler} className="formInput radiusNone" style={{padding: '0.75rem', borderRadius: '6px', border: '1px solid #ccc', minHeight: '100px'}} rows={5}></textarea>
                                                </div>
                                                
                                            </form>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <CheckoutSummary cartItems={cartList} shippingCost={shippingCost} subtotal={totalPrice(cartList)} />
                            <div className="payment-gateway-section" style={{marginTop: '2rem', padding: '2rem', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)'}}>
                                <h3 style={{marginBottom: '1rem'}}>Payment Gateway</h3>
                                <p>Pay securely using Razorpay.</p>
                                <button
                                    className="cBtn cBtnBlack"
                                    style={{padding: '0.75rem 2rem', borderRadius: '6px', background: '#2d9cdb', color: '#fff', border: 'none', fontWeight: 600, fontSize: '1rem'}}
                                    onClick={handleRazorpayPayment}
                                    disabled={!razorpayLoaded || cartList.length === 0}
                                >
                                    Pay with Razorpay
                                </button>
                                {!razorpayLoaded && <div style={{marginTop: '1rem', color: '#888'}}>Loading payment gateway...</div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
};

export default CheckoutSection;