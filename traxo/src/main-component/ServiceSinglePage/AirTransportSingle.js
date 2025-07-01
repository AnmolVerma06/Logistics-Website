import React, { Fragment } from 'react';
import HeaderTop from '../../components/HeaderTop/HeaderTop';
import Navbar from '../../components/Navbar/Navbar';
import PageTitle from '../../components/pagetitle/PageTitle';

import Footer from '../../components/footer/Footer';
import Scrollbar from '../../components/scrollbar/scrollbar';
import Logo from '../../images/logo.svg';
import ServiceSidebar from './sidebar';
import Simg1 from '../../images/service-single/img-1.jpg';

const AirTransportSingle = () => {
    const serviceDetails = {
        title: 'Air Transport',
        simag: Simg1,
        description: 'It was popularised with the release sheets containing passages and more recently with software.'
    };
    return (
        <Fragment>
            <HeaderTop />
            <Navbar hclass={'wpo-site-header'} Logo={Logo} />
            <PageTitle pageTitle={serviceDetails.title} pagesub={'Service Single'} />
            <div className="wpo-service-single-area section-padding">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 col-12">
                            <div className="wpo-service-single-wrap">
                                <div className="wpo-service-single-item">
                                    <div className="wpo-service-single-main-img">
                                        <img src={serviceDetails.simag} alt="" />
                                    </div>
                                    <div className="wpo-service-single-title">
                                        <h2><strong>{serviceDetails.title}</strong></h2>
                                    </div>
                                    
                                    <p>Our air transport services provide the fastest and most efficient way to move your urgent or high-value shipments nationwide. We connect major cities with reliable, scheduled flights to ensure timely deliveries and minimal transit time. Whether it’s sensitive documents, perishable goods, or time-critical parcels, our experienced team and strong airline partnerships make sure your cargo arrives safely and on schedule. By choosing our air freight solutions, you gain access to a streamlined process with real-time tracking and responsive customer support, giving you complete peace of mind from pickup to delivery.</p>
                                    <br />
                                    <h3><strong>Why Choose Air Transport?</strong></h3>
                                    <br />
                                    <p>Air transport is the ideal choice when speed, reliability, and security are non-negotiable. Unlike road or sea freight, air cargo minimizes delivery times dramatically, helping your business meet tight deadlines and delight your customers with faster service. Our extensive domestic air network allows us to reach every major airport across the country, providing flexibility for urgent shipments. Air transport also offers higher security with reduced handling and fewer chances of damage or loss. Choose air freight to stay competitive, ensure critical goods reach their destination swiftly, and keep your operations running smoothly.</p>
                                    <h3><strong>Our Commitment to Safety</strong></h3>
                                    <p>Safety is at the heart of our air transport services. We follow rigorous protocols for packaging, handling, and loading cargo to ensure your goods remain secure throughout their journey. Our experienced team is trained in air freight regulations and best practices, guaranteeing full compliance with aviation standards and customs requirements. We work closely with trusted airline partners to maintain strict timelines and secure storage conditions, even for sensitive or high-value items. Our commitment to safety means you can rely on us for consistent, damage-free deliveries that protect your cargo and your reputation.</p>
                                </div>
                                {/* ...repeat the rest of the UI as in ServiceSinglePage.js... */}
                            </div>
                        </div>
                        <div className="col-lg-4 col-12">
                            <ServiceSidebar onlyTypes={['Air Transport','Road Transport','Ocean Transport','Train Transport']} currentType="Air Transport" />
                        </div>
                    </div>
                </div>
            </div>
            <Footer hclass={'wpo-site-footer'} upperContactArea={true} />
            <Scrollbar />
        </Fragment>
    );
};
export default AirTransportSingle; 