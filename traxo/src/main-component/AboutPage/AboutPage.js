import React, { Fragment } from 'react';
import HeaderTop from '../../components/HeaderTop/HeaderTop';
import Navbar from '../../components/Navbar/Navbar';
import PageTitle from '../../components/pagetitle/PageTitle'
import About from '../../components/about/about';
import ServiceSectionS3 from '../../components/ServiceSectionS3/ServiceSectionS3';
import VideoSection from '../../components/VideoSection/VideoSection';
// import ProjectSection from '../../components/ProjectSection/ProjectSection';
import CtaSection from '../../components/CtaSection/CtaSection';
import CalculationSection from '../../components/CalculationSection/CalculationSection';
// import PartnersSection from '../../components/PartnersSection/PartnersSection';
import TeamSection from '../../components/TeamSection/TeamSection';
import SubscribeSectionS2 from '../../components/SubscribeSectionS2/SubscribeSectionS2';
import Footer from '../../components/footer/Footer';
import Scrollbar from '../../components/scrollbar/scrollbar';
import Logo from '../../images/logo.svg'
import Shape from '../../images/d-boy.png'

const AboutPage = () => {
    return (
        <Fragment>
            <HeaderTop />
            <Navbar hclass={'wpo-site-header'} Logo={Logo} />
            <PageTitle pageTitle={'About Us'} pagesub={'About'} />
            <About hclass={'wpo-about-section section-padding'} />
            <ServiceSectionS3 />
            
            <CtaSection />
            
            <TeamSection />
           
            <Footer hclass={'wpo-site-footer'} upperContactArea={true} />
            <Scrollbar />
        </Fragment>
    )
};
export default AboutPage;
