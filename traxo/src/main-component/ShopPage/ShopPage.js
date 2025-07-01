import React, { Fragment, useState, useEffect } from 'react';
import { connect } from "react-redux";
import HeaderTop from '../../components/HeaderTop/HeaderTop'
import Navbar from '../../components/Navbar/Navbar';
import PageTitle from '../../components/pagetitle/PageTitle'
import { addToCart, removeFromCart, incrementQuantity, decrementQuantity } from "../../store/actions/action";
import ShopProduct from '../../components/ShopProduct';
import api from "../../api";
import SubscribeSectionS2 from '../../components/SubscribeSectionS2/SubscribeSectionS2';
import Footer from '../../components/footer/Footer';
import Scrollbar from '../../components/scrollbar/scrollbar'
import Logo from '../../images/logo-2.svg';
import { Link } from "react-router-dom";
import { totalPrice } from "../../utils";

function aggregateDimensions(cartItems) {
    let length = 0, width = 0, height = 0, totalWeight = 0;
    cartItems.forEach(item => {
        totalWeight += Number(item.weight) * item.qty;
        const dims = (item.dimensions || '').match(/\d+/g) || [];
        if (dims.length === 3) {
            length = Math.max(length, parseFloat(dims[0]));
            width = Math.max(width, parseFloat(dims[1]));
            height = Math.max(height, parseFloat(dims[2]));
        }
    });
    return { length, width, height, totalWeight };
}

const ShopPage = ({ addToCart, carts, removeFromCart, incrementQuantity, decrementQuantity }) => {

    const productsArray = api();
    const [currentPage, setCurrentPage] = useState(1);
    const [shippingCost, setShippingCost] = useState(null);
    const [calculationData, setCalculationData] = useState(null);
    const productsPerPage = 6;

    const totalProducts = productsArray.length;
    const totalPages = Math.ceil(totalProducts / productsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)
    };
    const currentProducts = productsArray.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

    const addToCartProduct = (product, qty = 1) => {
        addToCart(product, qty);
    };

    // Load calculation form data on mount
    useEffect(() => {
        const formData = JSON.parse(localStorage.getItem('transfar_price_calc') || '{}');
        if (formData.from && formData.to) {
            setCalculationData({
                departureCity: formData.departureCity || formData.from,
                deliverCity: formData.deliverCity || formData.to,
                freightType: formData.freightType || 'road',
                insurance: formData.insurance || 'no',
                deliveryOption: formData.deliveryOption || 'standard',
                weight: formData.weight || ''
            });
        }
    }, []);

    useEffect(() => {
        if (!carts || carts.length === 0) {
            setShippingCost(null);
            return;
        }
        const formData = JSON.parse(localStorage.getItem('transfar_price_calc') || '{}');
        if (!formData.from || !formData.to) {
            setShippingCost(null);
            return;
        }
        fetch('https://logistics-website-67n1.onrender.com/api/calculate-with-cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                cartItems: carts, 
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
            .then(data => { if (data.success) setShippingCost(data); else setShippingCost(null); })
            .catch(() => setShippingCost(null));
    }, [carts]);

    const calculateTotal = () => {
        const subtotal = totalPrice(carts);
        const shipping = shippingCost ? shippingCost.totalCost : 0;
        return subtotal + shipping;
    };

    return (
        <Fragment>
            <HeaderTop />
            <Navbar hclass={'wpo-site-header'} Logo={Logo} />
            <PageTitle pageTitle={'Shop'} pagesub={'Shop'} />
            <section className="wpo-shop-section section-padding">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">
                            <ShopProduct
                                addToCartProduct={addToCartProduct}
                                products={currentProducts}
                            />
                            <div className="pagination-wrapper pagination-wrapper-center">
                                <ul className="pg-pagination">
                                    <li>
                                        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} aria-label="Previous">
                                            <i className="ti-angle-left"></i>
                                        </button>
                                    </li>
                                    {[...Array(totalPages)].map((_, index) => (
                                        <li key={index} className={currentPage === index + 1 ? 'active' : ''}>
                                            <button onClick={() => handlePageChange(index + 1)}>
                                                {index + 1}
                                            </button>
                                        </li>
                                    ))}
                                    <li>
                                        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} aria-label="Next">
                                            <i className="ti-angle-right"></i>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="cart-sidebar">
                                <h3>Shipping Details</h3>
                                {calculationData ? (
                                    <div className="shipping-details">
                                        <div className="detail-item">
                                            <span>From:</span>
                                            <span>{calculationData.departureCity}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span>To:</span>
                                            <span>{calculationData.deliverCity}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span>Freight Type:</span>
                                            <span>{calculationData.freightType || 'Road'}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span>Insurance:</span>
                                            <span>{calculationData.insurance === 'yes' ? 'Yes' : 'No'}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span>Delivery:</span>
                                            <span>{calculationData.deliveryOption === 'express' ? 'Express' : 'Standard'}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <p>No shipping details found. Please fill the calculation form first.</p>
                                )}

                                <h3>Items in Cart</h3>
                                {carts.length === 0 ? (
                                    <p>Your cart is empty.</p>
                                ) : (
                                    <div className="cart-items-wrapper">
                                        {carts.map((item) => (
                                            <div className="cart-item-single" key={item.id}>
                                                <div className="cart-item-image">
                                                    <img src={item.proImg} alt={item.title} />
                                                </div>
                                                <div className="cart-item-info">
                                                    <h4>{item.title}</h4>
                                                    <div className="cart-item-qty-price">
                                                        <div className="quantity-controls">
                                                            <button onClick={() => decrementQuantity(item.id)}>-</button>
                                                            <span>{item.qty}</span>
                                                            <button onClick={() => incrementQuantity(item.id)}>+</button>
                                                        </div>
                                                        <span className="item-price">₹0.00</span>
                                                    </div>
                                                </div>
                                                <button
                                                    className="remove-item"
                                                    onClick={() => removeFromCart(item.id)}
                                                >
                                                    <i className="fi ti-trash"></i>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                
                                {carts.length > 0 && (
                                    <div className="cart-summary">
                                        <div className="summary-line">
                                            <span>Total Items:</span>
                                            <span>{carts.length}</span>
                                        </div>
                                        <div className="summary-line">
                                            <span>Box Cost:</span>
                                            <span>₹0.00</span>
                                        </div>
                                        {shippingCost && (
                                            <div className="summary-line">
                                                <span>Shipping Cost:</span>
                                                <span>₹{shippingCost.totalCost.toFixed(2)}</span>
                                            </div>
                                        )}
                                        {shippingCost && (
                                            <div className="shipping-breakdown">
                                                <div>Distance: {shippingCost.distanceKm} km</div>
                                                <div>Chargeable Weight: {shippingCost.chargeableWeight} kg</div>
                                                <div>Rate: ₹{shippingCost.ratePerKg}/kg</div>
                                                <div>Base Shipping: ₹{shippingCost.baseShippingCost}</div>
                                                <div>Fuel Surcharge ({shippingCost.fuelSurchargePercent}%): ₹{shippingCost.fuelSurcharge}</div>
                                                <div>Handling: ₹{shippingCost.handlingCharge}</div>
                                                <div>Insurance: ₹{shippingCost.addOns.insurance}</div>
                                                <div>Express: ₹{shippingCost.addOns.expressCharge}</div>
                                                <div>Freight: ₹{shippingCost.addOns.freightCharge}</div>
                                                <div>Subtotal: ₹{shippingCost.subtotal}</div>
                                                <div>GST (18%): ₹{shippingCost.gst}</div>
                                                <div><b>Total Shipping: ₹{shippingCost.totalCost}</b></div>
                                            </div>
                                        )}
                                        <div className="summary-line total-price">
                                            <span>Total:</span>
                                            <span>₹{calculateTotal().toFixed(2)}</span>
                                        </div>
                                        <div className="checkout-button">
                                            <Link to="/checkout" className="theme-btn">Proceed to Checkout</Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            <Footer hclass={'wpo-site-footer'} upperContactArea={true} />
            <Scrollbar />
        </Fragment>
    )
};

const mapStateToProps = (state) => {
    return {
        carts: state.cartList.cart,
    };
};

export default connect(mapStateToProps, { addToCart, removeFromCart, incrementQuantity, decrementQuantity })(ShopPage);