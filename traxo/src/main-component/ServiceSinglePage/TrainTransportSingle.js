import React, { Fragment } from 'react';
import HeaderTop from '../../components/HeaderTop/HeaderTop';
import Navbar from '../../components/Navbar/Navbar';
import PageTitle from '../../components/pagetitle/PageTitle';

import Footer from '../../components/footer/Footer';
import Scrollbar from '../../components/scrollbar/scrollbar';
import Logo from '../../images/logo.svg';
import ServiceSidebar from './sidebar';
import Simg7 from '../../images/service-single/img-5.jpg';

const TrainTransportSingle = () => {
    const serviceDetails = {
        title: 'Train Transport',
        simag: Simg7,
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
                                    
                                    <p>Our train transport services provide an efficient, secure, and reliable way to move your goods across the country. Leveraging the extensive national rail network, we offer consistent schedules and high-capacity freight options perfect for bulk shipments. Whether you need to transport raw materials, finished products, or oversized cargo, our rail solutions minimize delays and ensure safe delivery. By integrating train transport into your supply chain, you gain access to predictable transit times, reduced congestion on roads, and competitive pricing—keeping your operations on track while meeting your delivery commitments.</p>
                                    <br />
                                    <h3><strong>Why Choose Train Transport?</strong></h3>
                                    <p>Train transport is the ideal choice when you need to move large volumes of goods economically and reliably over long distances. Unlike road transport, rail can handle heavier and bulkier shipments with fewer size and weight restrictions. Rail freight also offers excellent schedule consistency, reducing the risk of delays caused by traffic or weather. Additionally, trains are less affected by seasonal road closures or congestion, ensuring uninterrupted service. Choosing train transport provides your business with stability, cost efficiency, and dependable performance—essential advantages in today’s fast-paced supply chains.</p> 
                                    <br />
                                    <h3><strong>Efficient and Sustainable</strong></h3>
                                    <p>Rail freight stands out as one of the most environmentally friendly modes of transportation, producing significantly lower carbon emissions compared to trucks or planes. By moving cargo by train, you can cut greenhouse gases, reduce fuel consumption, and contribute to your sustainability goals without sacrificing efficiency. Our train transport solutions combine energy-efficient locomotives with optimized logistics planning to move more goods with less impact. This makes rail not only a smart economic choice but also a responsible one—helping your business operate sustainably while maintaining competitive delivery timelines and costs.</p>

                                </div>
                                {/* ...repeat the rest of the UI as in ServiceSinglePage.js... */}
                            </div>
                        </div>
                        <div className="col-lg-4 col-12">
                            <ServiceSidebar onlyTypes={['Air Transport', 'Road Transport', 'Ocean Transport', 'Train Transport']} currentType="Train Transport" />
                        </div>
                    </div>
                </div>
            </div>
            <Footer hclass={'wpo-site-footer'} upperContactArea={true} />
            <Scrollbar />
        </Fragment>
    );
};
export default TrainTransportSingle; 