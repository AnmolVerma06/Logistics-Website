import React, { Fragment } from 'react';
import HeaderTop from '../../components/HeaderTop/HeaderTop'
import Navbar from '../../components/Navbar/Navbar'
import PageTitle from '../../components/pagetitle/PageTitle'
import TrackingForm from '../../components/Tracking/TrackingForm';
import SubscribeSectionS2 from '../../components/SubscribeSectionS2/SubscribeSectionS2';
import Footer from '../../components/footer/Footer';
import Scrollbar from '../../components/scrollbar/scrollbar'
import Logo from '../../images/logo.svg'

const TrackingPage = (props) => {


    return (
        <Fragment>
            <HeaderTop />
            <Navbar hclass={'wpo-site-header'} Logo={Logo} />
            <PageTitle pageTitle={'Tracking'} pagesub={'Tracking'} />
            <section className="wpo-calculation-section-s3 section-padding" >
                <div className="container">
                    <div className="wpo-calculation-section-wrapper">
                        <div className="row align-items-center">
                            <div className="col-lg-10 col-md-12 col-12">
                                <TrackingForm />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer hclass={'wpo-site-footer'} upperContactArea={true} />
            <Scrollbar />
        </Fragment>
    )
};
export default TrackingPage;



