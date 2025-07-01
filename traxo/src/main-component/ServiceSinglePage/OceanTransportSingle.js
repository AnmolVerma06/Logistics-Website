import React, { Fragment } from 'react';
import HeaderTop from '../../components/HeaderTop/HeaderTop';
import Navbar from '../../components/Navbar/Navbar';
import PageTitle from '../../components/pagetitle/PageTitle';
import SubscribeSectionS2 from '../../components/SubscribeSectionS2/SubscribeSectionS2';
import Footer from '../../components/footer/Footer';
import Scrollbar from '../../components/scrollbar/scrollbar';
import Logo from '../../images/logo.svg';
import ServiceSidebar from './sidebar';
import Simg2 from '../../images/service-single/img-3.jpg';

const OceanTransportSingle = () => {
    const serviceDetails = {
        title: 'Ocean Transport',
        simag: Simg2,
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
                                    
                                    <p>Our ocean transport services specialize in reliable coastal shipping solutions, connecting ports and coastal cities across the nation. We offer secure, scheduled sailings for bulk goods, containers, and oversized cargo, ensuring your shipments move efficiently along domestic sea routes. Our experienced team manages every aspect of your shipment, from documentation to safe loading and unloading at each port. By choosing our ocean transport, you benefit from cost-effective options for large volumes, reduced road congestion, and environmentally friendly logistics that support your supply chain’s sustainability and growth along the coast.</p>
                                    <br />
                                    <h3><strong>Why Choose Ocean Transport?</strong></h3>
                                    <p>Ocean transport is the most practical and economical choice for moving large quantities of goods domestically along the coast. It allows you to ship bulk commodities or oversized cargo safely and efficiently without the high costs associated with air freight. Coastal shipping also offers reliable scheduling, predictable transit times, and fewer restrictions on weight and size compared to road transport. With lower carbon emissions per ton-kilometer, ocean freight provides a greener alternative that supports your business’s sustainability goals while giving you a competitive advantage through reduced logistics costs.</p>
                                    <br />
                                    <h3><strong>Nationwide Reach</strong></h3>
                                    <p>Our coastal shipping network gives you comprehensive nationwide coverage along the country’s extensive shoreline, connecting major and secondary ports seamlessly. We make it easy to move cargo between key coastal regions, ensuring your products reach cities and towns near the sea quickly and securely. Our services are designed to support industries ranging from manufacturing to agriculture, providing an efficient link between suppliers and customers in every coastal area. With our reliable nationwide reach, your business can expand confidently, improve delivery times, and serve more markets across the country’s vibrant coastal corridors.</p>
                                </div>
                                {/* ...repeat the rest of the UI as in ServiceSinglePage.js... */}
                            </div>  
                        </div>
                        <div className="col-lg-4 col-12">
                            <ServiceSidebar onlyTypes={['Air Transport','Road Transport','Ocean Transport','Train Transport']} currentType="Ocean Transport" />
                        </div>
                    </div>
                </div>
            </div>
            <Footer hclass={'wpo-site-footer'} upperContactArea={true} />
            <Scrollbar />
        </Fragment>
    );
};
export default OceanTransportSingle; 