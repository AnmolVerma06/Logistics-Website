import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../../images/logo-2.svg'
import Services from '../../api/Services'
/* image */
import Img1 from '../../images/instragram/1.jpg'
import Img2 from '../../images/instragram/2.jpg'
import Img3 from '../../images/instragram/3.jpg'
import Img4 from '../../images/instragram/4.jpg'
import Img5 from '../../images/instragram/5.jpg'
import Img6 from '../../images/instragram/6.jpg'


const ClickHandler = () => {
    window.scrollTo(10, 0);
}

const Footer = (props) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const validateEmail = (email) => {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(String(email).toLowerCase());
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateEmail(email)) {
            setError('');
            console.log('Email is valid:', email);
        } else {
            setError('Please enter a valid email address.');
        }
    };

    const { upperContactArea = false, InstagramShow = false, NewsletterShow = true, FooterShape = true } = props

    return (
        <footer className={'' + props.hclass}>
            {upperContactArea && (
                <div className="upper-contact-area">
                    <div className="container">
                        <div className="row">
                            <div className="col col-xs-12">
                                <div className="contact-grids">
                                    <div className="grid">
                                        <div className="icon">
                                            <i className="fi flaticon-location-1"></i>
                                        </div>
                                        <div className="details">
                                            <h5>Location:</h5>
                                            <p>Indira Nagar, Kanpur</p>
                                        </div>
                                    </div>
                                    <div className="grid">
                                        <div className="icon">
                                            <i className="fi flaticon-email"></i>
                                        </div>
                                        <div className="details">
                                            <h5>Email:</h5>
                                            <p>Traxo@gmail.com</p>
                                        </div>
                                    </div>
                                    <div className="grid">
                                        <div className="icon">
                                            <i className="fi flaticon-phone-call"></i>
                                        </div>
                                        <div className="details">
                                            <h5>Phone:</h5>
                                            <p>+91 7991589875</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="upper-footer">
                <div className="container">
                    <div className="row">
                        <div className="col col-lg-4 col-md-6 col-12">
                            <div className="widget about-widget">
                                <div className="logo widget-title">
                                <Link className="navbar-brand" to="/" style={{display:'flex',alignItems:'center',gap:'8px'}}>
                            <img src="/favicon.png" alt="favicon" style={{width:'42px',height:'42px'}} />
                            <span style={{fontWeight:'bold',fontSize:'2.5rem',color:'white',lineHeight:1}}>Traxo</span>
                        </Link>
                                </div>
                                <p>Empowering businesses and individuals with dependable nationwide delivery services that exceed expectations every single day.</p>
                                <div className="social-icons">
                                    <ul>
                                        <li><Link onClick={ClickHandler} to="#"><i className="ti-facebook"></i></Link></li>
                                        <li><Link onClick={ClickHandler} to="#"><i className="ti-twitter-alt"></i></Link></li>
                                        <li><Link onClick={ClickHandler} to="#"><i className="ti-linkedin"></i></Link></li>
                                        <li><Link onClick={ClickHandler} to="#"><i className="ti-pinterest"></i></Link></li>
                                        <li><Link onClick={ClickHandler} to="#"><i className="ti-vimeo-alt"></i></Link></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col col-lg-2 col-md-6 col-12">
                            <div className="widget link-widget">
                                <div className="widget-title">
                                    <h3>Navigation</h3>
                                </div>
                                <ul>
                                    <li><Link onClick={ClickHandler} to="/about">About us</Link></li>
                                    <li><Link onClick={ClickHandler} to="/contact">Contact us</Link></li>
                                    <li><Link onClick={ClickHandler} to="/tracking">Tracking</Link></li>
                                    
                                </ul>
                            </div>
                        </div>
                        <div className="col col-lg-3 col-md-6 col-12">
                            <div className="widget link-widget service-link-widget">
                                <div className="widget-title">
                                    <h3>All Services</h3>
                                </div>
                                <ul>
                                    {Services.slice(0, 3).map((fservic, index) => (
                                        <li key={index}><Link onClick={ClickHandler} to={`/service-single/${fservic.slug}`}>{fservic.title}</Link></li>
                                    ))}
                                    <li><Link onClick={ClickHandler} to={`/service-single/train-transport`}>Train Transport</Link></li>
                                </ul>
                            </div>
                        </div>
                        {NewsletterShow && (
                            <div className="col col-lg-3 col-md-6 col-12">
                                <div className="widget newsletter-widget">
                                    <div className="widget-title">
                                        <h3>Newsletter</h3>
                                    </div>
                                    <p>Subscribe to our Newsletter to get latest updates</p>
                                    <form onSubmit={handleSubmit}>
                                        <div className="input-1">
                                            <input
                                                type="email"
                                                className="form-control"
                                                placeholder="Email Address *"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>
                                        {error && <div className="error-message" style={{ color: 'red' }}>{error}</div>}
                                        <div className="submit clearfix">
                                            <button type="submit">
                                                <i className="ti-email"></i>
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                        {InstagramShow &&
                            (
                                <div className="col col-lg-3 col-md-6 col-12">
                                    <div className="widget instagram">
                                        <div className="widget-title">
                                            <h3>Our Gallery</h3>
                                        </div>
                                        <ul className="d-flex">
                                            <li><img src={Img1}
                                                alt="" /></li>
                                            <li><img src={Img2}
                                                alt="" /></li>
                                            <li><img src={Img3}
                                                alt="" /></li>
                                            <li><img src={Img4}
                                                alt="" /></li>
                                            <li><img src={Img5}
                                                alt="" /></li>
                                            <li><img src={Img6}
                                                alt="" /></li>
                                        </ul>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
                {FooterShape && (
                    <div>
                        <div className="vector-1"></div>
                        <div className="vector-2"></div>
                        <div className="vector-3"></div>
                        <div className="vector-4"></div>
                        <div className="vector-5"></div>
                        <div className="vector-6"></div>
                        <div className="vector-7"></div>
                        <div className="vector-8"></div>
                    </div>
                )}
            </div>
            <div className="wpo-lower-footer">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6 col-md-12  col-12">
                            <p className="copyright">Copyright &copy;<span>2025</span>
                                <span className="copyright-icon">|</span> All Rights Reserved.
                            </p>
                        </div>
                        <div className="col-lg-6 col-md-12  col-12">
                            <p className="link">Term and Service <span>||</span> Privacy Policy</p>
                        </div>
                    </div>
                </div>
            </div>

        </footer >
    )
}

export default Footer;









