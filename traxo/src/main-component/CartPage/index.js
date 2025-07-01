import React, { Fragment, useState, useEffect } from "react";
import HeaderTop from '../../components/HeaderTop/HeaderTop';
import Navbar from '../../components/Navbar/Navbar';
import PageTitle from "../../components/pagetitle/PageTitle";
import Scrollbar from "../../components/scrollbar/scrollbar";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { totalPrice } from "../../utils";
import {
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
} from "../../store/actions/action";
import SubscribeSectionS2 from '../../components/SubscribeSectionS2/SubscribeSectionS2';
import Footer from '../../components/footer/Footer';
import Logo from '../../images/logo.svg'

const CartPage = (props) => {
  const ClickHandler = () => {
    window.scrollTo(10, 0);
  };

  const { carts } = props;
  const [shippingCost, setShippingCost] = useState(null);
  const [calculationData, setCalculationData] = useState(null);

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

  // Automatically calculate shipping cost when cart changes
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

  // Calculate total with shipping
  const calculateTotalWithShipping = () => {
    const subtotal = totalPrice(carts);
    const shipping = shippingCost ? shippingCost.totalCost : 0;
    return subtotal + shipping;
  };

  return (
    <Fragment>
      <HeaderTop />
      <Navbar hclass={'wpo-site-header'} Logo={Logo} />
      <PageTitle pageTitle={"Cart"} pagesub={"Cart"} />
      <div className="cart-area section-padding">
        <div className="container">
          <div className="form">
            <div className="cart-wrapper">
              <div className="row">
                <div className="col-12">
                  {/* Shipping Details Section */}
                  {calculationData && (
                    <div className="shipping-details-section">
                      <h3>Shipping Details</h3>
                      <div className="shipping-details-grid">
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
                    </div>
                  )}

                  <form action="cart">
                    <table className="table-responsive cart-wrap">
                      <thead>
                        <tr>
                          <th className="images images-b">Image</th>
                          <th className="product-2">Product Name</th>
                          <th className="pr">Quantity</th>
                          <th className="ptice">Price</th>
                          <th className="stock">Total Price</th>
                          <th className="remove remove-b">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {carts &&
                          carts.length > 0 &&
                          carts.map((catItem, crt) => (
                            <tr key={crt}>
                              <td className="images">
                                <img src={catItem.proImg} alt="" />
                              </td>
                              <td className="product">
                                <ul>
                                  <li className="first-cart">
                                    {catItem.title}
                                  </li>
                                  <li>Brand : {catItem.brand}</li>
                                  <li>Size : {catItem.size}</li>
                                  {catItem.weight && (
                                    <li>Weight : {catItem.weight}</li>
                                  )}
                                  {catItem.dimensions && (
                                    <li>Dimensions : {catItem.dimensions}</li>
                                  )}
                                </ul>
                              </td>
                              <td className="stock">
                                <div className="pro-single-btn">
                                  <span
                                    className="dec qtybutton"
                                    onClick={() =>
                                      props.decrementQuantity(catItem.id)
                                    }
                                  >
                                    -
                                  </span>
                                  <input
                                    value={catItem.qty || 0}
                                    type="text"
                                    readOnly
                                  />
                                  <span
                                    className="inc qtybutton"
                                    onClick={() =>
                                      props.incrementQuantity(catItem.id)
                                    }
                                  >
                                    +
                                  </span>
                                </div>
                              </td>
                              <td className="ptice">${catItem.qty * catItem.price}</td>
                              <td className="stock">${catItem.qty * catItem.price}</td>
                              <td className="action">
                                <ul>
                                  <li
                                    className="w-btn"
                                    onClick={() =>
                                      props.removeFromCart(catItem.id)
                                    }
                                  >
                                    <i className="fi ti-trash"></i>
                                  </li>
                                </ul>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </form>
                  <div className="submit-btn-area">
                    <ul>
                      <li>
                        <Link
                          onClick={ClickHandler}
                          className="theme-btn"
                          to="/shop"
                        >
                          Continue Shopping
                        </Link>
                      </li>
                      <li>
                        <button type="submit" >Update Cart</button>
                      </li>
                    </ul>
                  </div>

                  <div className="cart-product-list">
                    <ul>
                      <li>
                        Total product<span>( {carts.length} )</span>
                      </li>
                      <li>
                        Sub Price<span>${totalPrice(carts)}</span>
                      </li>
                      <li>
                        Vat<span>$0</span>
                      </li>
                      <li>
                        Eco Tax<span>$0</span>
                      </li>
                      <li>
                        Delivery Charge
                        <span>
                          {shippingCost ? `₹${shippingCost.totalCost.toFixed(2)}` : '$0'}
                        </span>
                      </li>
                      <li className="cart-b">
                        Total Price
                        <span>${calculateTotalWithShipping().toFixed(2)}</span>
                      </li>
                    </ul>
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
                  </div>
                  <div className="submit-btn-area">
                    <ul>
                      <li>
                        <Link
                          onClick={ClickHandler}
                          className="theme-btn"
                          to="/checkout"
                        >
                          Proceed to Checkout
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SubscribeSectionS2 />
      <Footer hclass={'wpo-site-footer-s3'} NewsletterShow={false} InstagramShow={true} FooterShape={false} />
      <Scrollbar />
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    carts: state.cartList.cart,
  };
};

export default connect(mapStateToProps, {
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
})(CartPage);
