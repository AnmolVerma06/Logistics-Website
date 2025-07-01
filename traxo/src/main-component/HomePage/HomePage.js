import React, { Fragment } from 'react';
import HeaderTop from '../../components/HeaderTop/HeaderTop';
import Navbar from '../../components/Navbar/Navbar';
import CustomHeroSlider from '../../components/CustomHeroSlider/CustomHeroSlider';
import FunFact from '../../components/FunFact/FunFact';
import About from '../../components/about/about';
import ServiceSectionS3 from '../../components/ServiceSectionS3/ServiceSectionS3';
// import PartnersSection from '../../components/PartnersSection/PartnersSection';
import CalculationSection from '../../components/CalculationSection/CalculationSection';
import CtaSection from '../../components/CtaSection/CtaSection';
import CustomTestimonial from '../../components/Testimonial/CustomTestimonial';
//import BlogSection from '../../components/BlogSection/BlogSection';
import Footer from '../../components/footer/Footer';
import Scrollbar from '../../components/scrollbar/scrollbar';
import Logo from '../../images/logo.svg';


const HomePage = () => {
    return (
        <Fragment>
            <HeaderTop />
            <Navbar hclass={'wpo-site-header'} Logo={Logo} />
            <CustomHeroSlider />
            <FunFact hclass={'wpo-fun-fact-section'} />
            <About hclass={'wpo-about-section section-padding'} />
            <CtaSection />
            <ServiceSectionS3 />
            <CalculationSection hclass={'wpo-calculation-section-s2'}/>
            
            
            <CustomTestimonial />
           
            
            <Footer hclass={'wpo-site-footer'} upperContactArea={true} />
            <Scrollbar />
        </Fragment>
    );
};

export default HomePage;