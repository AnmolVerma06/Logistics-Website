import React from 'react';
import { Link } from 'react-router-dom';


// image
import Ab from '../../images/about/img-1.jpg'
import Abd1 from '../../images/about/img-2.jpg'

const about = (props) => {
    const ClickHandler = () => {
        window.scrollTo(10, 0);
    }
    return (
        <section className={"" + props.hclass}>
            <div className="container">
                <div className="wpo-about-section-wrapper">
                    <div className="row align-items-center">
                        <div className="col-xl-6 col-lg-12 col-md-12 col-12">
                            <div className="wpo-about-img">
                                <div className="wpo-about-img-left">
                                    <img src={Ab} alt="" />
                                </div>
                                <div className="about-img-inner">
                                    <div className="about-img-inner-text">
                                        <h2>18 <span>Years of <br /> experience.</span></h2>
                                        <p> Our commitment to safety, speed, and transparency ensures your cargo arrives securely and on time.</p>
                                    </div>
                                    <img src={Abd1} alt="" />
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-6 col-lg-12 col-md-12 col-12">
                            <div className="wpo-about-content ">
                                <div className="wpo-about-content-top">
                                    <h2>We are best and trusted transportation company.</h2>
                                    <p>We have been delivering excellence through reliable road, air, and coastal shipping solutions across the nation. Our mission is to make logistics simple, efficient, and tailored to your needs.</p>
                                </div>
                                <div className="wpo-about-content-progress">
                                    <div className="progress-inner">
                                        <div className="progress yellow">
                                            <span className="progress-left">
                                                <span className="progress-bar"></span>
                                            </span>
                                            <span className="progress-right">
                                                <span className="progress-bar"></span>
                                            </span>
                                            <div className="progress-value">98%</div>
                                            <div className="progress-name"><span>Success</span></div>
                                        </div>
                                    </div>
                                    <p>Thanks to our dedicated team and modern fleet, we have earned a 98% success rate in meeting delivery deadlines and exceeding customer expectations. </p>
                                </div>
                                <div className="wpo-about-check-wrap">
                                    <div className="wpo-about-check-item">
                                        <p>Stay updated with real-time tracking and expert customer service.</p>
                                    </div>
                                    <div className="wpo-about-check-item">
                                        <p>Tailored services for businesses of all sizes, from small packages to bulk shipments.</p>
                                    </div>
                                </div>
                                <Link onClick={ClickHandler} to="/service" className="theme-btn-s2">All Services</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default about;

