import React from "react";
import { Link } from "react-router-dom";


const ClickHandler = () => {
    window.scrollTo(10, 0);
}

const CtaSection = (props) => {
    return (
        <section className="wpo-cta-section">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-6 col-md-6 col-12">
                        <div className="wpo-cta-text">
                            <span>Call to Action</span>
                            <h3>Join with us for and get best transport services.</h3>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6 col-12">
                        <div className="wpo-cta-btn">
                            <Link onClick={ClickHandler} className="theme-btn-s2" to="/contact">JOIN WITH US</Link>
                        </div>
                    </div>
                </div>
            </div>
        </section> 
    )
}
export default CtaSection;


