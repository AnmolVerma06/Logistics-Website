import React from "react";
import { Link } from "react-router-dom";


const ShopProduct = ({ products, addToCartProduct }) => {
    const ClickHandler = () => {
        window.scrollTo(10, 0);
    };

    return (

        <div className="shop-grids clearfix">
            {products.length > 0 &&
                products.slice(0, 6).map((product, pitem) => (
                    <div className="grid" key={pitem}>
                        <div className="img-holder">
                            <img src={product.proImg} alt="" />
                        </div>
                        <div className="details">
                            <h3><Link onClick={ClickHandler} to={`/shop-single/${product.slug}`}>{product.title}</Link></h3>
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '10px',
                                marginBottom: '10px'
                            }}>
                                <span style={{ 
                                    fontSize: '18px', 
                                    fontWeight: 'bold', 
                                    color: '#28a745',
                                    backgroundColor: '#d4edda',
                                    padding: '4px 8px',
                                    borderRadius: '4px'
                                }}>
                                    FREE
                                </span>
                                <span style={{ 
                                    fontSize: '14px', 
                                    color: '#6c757d',
                                    textDecoration: 'line-through'
                                }}>
                                    ₹{product.delPrice}
                                </span>
                            </div>
                            
                            {/* Product Dimensions Only */}
                            <div style={{
                                marginBottom: '15px',
                                padding: '8px 12px',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '5px',
                                fontSize: '13px',
                                fontWeight: '500',
                                color: '#495057',
                                border: '1px solid #e9ecef'
                            }}>
                                <strong>Dimensions:</strong> {product.dimensions}
                            </div>
                            
                            <div className="add-to-cart">
                                <button
                                    data-bs-toggle="tooltip"
                                    data-bs-html="true"
                                    title="Add to Cart"
                                    onClick={() => addToCartProduct(product)}
                                >
                                    Add to cart
                                    <i className="ti-shopping-cart"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
        </div>
    );
};

export default ShopProduct;
