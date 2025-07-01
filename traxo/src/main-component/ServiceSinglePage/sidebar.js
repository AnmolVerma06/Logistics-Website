import React from 'react';
import { Link } from 'react-router-dom';

const staticLinks = [
    { title: 'Air Transport', slug: '/service-single/air-transport' },
    { title: 'Road Transport', slug: '/service-single/road-transport' },
    { title: 'Ocean Transport', slug: '/service-single/ocean-transport' },
    { title: 'Train Transport', slug: '/service-single/train-transport' },
];

const ServiceSidebar = (props) => {
    const ClickHandler = () => {
        window.scrollTo(10, 0);
    };

    return (
        <div className="blog-sidebar">
            <div className="widget category-widget">
                <h3>All Services</h3>
                <ul>
                    {staticLinks.map((serv, item) => (
                        <li key={item}><Link onClick={ClickHandler} to={serv.slug}>{serv.title}</Link></li>
                    ))}
                </ul>
            </div>
            <div className="wpo-contact-widget widget">
                <h2>Contact us today for your transport service.</h2>
                <div className="call">
                    <span>CALL US:</span>
                    <h5>+00 568 975 38</h5>
                </div>
                <Link onClick={ClickHandler} className="theme-btn" to="/contact">GET A QUOTE</Link>
            </div>
        </div>
    );
};

export default ServiceSidebar;

