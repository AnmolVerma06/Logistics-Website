import React, { Fragment } from 'react';
import HeaderTop from '../../components/HeaderTop/HeaderTop';
import Navbar from '../../components/Navbar/Navbar';
import PageTitle from '../../components/pagetitle/PageTitle';
import SubscribeSectionS2 from '../../components/SubscribeSectionS2/SubscribeSectionS2';
import Footer from '../../components/footer/Footer';
import Scrollbar from '../../components/scrollbar/scrollbar';
import Logo from '../../images/logo.svg';
import ServiceSidebar from './sidebar';
import Simg3 from '../../images/service-single/img-4.jpg';

const RoadTransportSingle = () => {
    const serviceDetails = {
        title: 'Road Transport',
        simag: Simg3,
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
                                    
                                    <p>Our road transport services offer a dependable, flexible solution for shipping goods across the country. With an extensive fleet of modern vehicles and professional drivers, we handle everything from small parcels to full truckloads. Our well-planned routes ensure timely pickups and deliveries, even in remote areas. Whether you’re moving goods between cities or providing last-mile delivery to your customers, we customize our road logistics to fit your schedule and needs. By choosing our road transport services, you gain nationwide reach, real-time tracking, and dedicated support to keep your business moving smoothly.</p>
                                    <br />
                                    <h3><strong>Why Choose Road Transport?</strong></h3>
                                    <p>Road transport remains one of the most versatile and accessible methods of moving goods. It offers door-to-door service, allowing direct delivery without the need for additional handling or transfers. This minimizes the risk of damage and reduces transit time. Road transport is also ideal for flexible scheduling, enabling urgent, same-day, or next-day deliveries to meet your business’s demands. With extensive infrastructure and easy access to rural and urban areas alike, road freight provides unmatched convenience and connectivity, helping you reliably serve customers wherever they are.</p>
                                    <br />
                                    <h3><strong>Reliable and Cost-Effective</strong></h3>
                                    <p>Our road transport services combine reliability with cost-effectiveness to deliver exceptional value. By leveraging optimized routes, fuel-efficient vehicles, and experienced logistics planners, we reduce unnecessary expenses and pass the savings on to you. Our transparent pricing means no hidden fees, and our advanced tracking systems keep you informed at every step. We’re committed to providing timely, secure deliveries that protect your goods and your bottom line. With our affordable solutions, you can streamline your supply chain, improve service to your customers, and maintain full control of your logistics budget.</p>
                                </div>
                                {/* ...repeat the rest of the UI as in ServiceSinglePage.js... */}
                            </div>
                        </div>
                        <div className="col-lg-4 col-12">
                            <ServiceSidebar onlyTypes={['Air Transport','Road Transport','Ocean Transport','Train Transport']} currentType="Road Transport" />
                        </div>
                    </div>
                </div>
            </div>
            <Footer hclass={'wpo-site-footer'} upperContactArea={true} />
            <Scrollbar />
        </Fragment>
    );
};
export default RoadTransportSingle; 