import React, { Fragment } from 'react';
import HeaderTop from '../../components/HeaderTop/HeaderTop';
import Navbar from '../../components/Navbar/Navbar';
import PageTitle from '../../components/pagetitle/PageTitle'
import CustomTestimonial from '../../components/Testimonial/CustomTestimonial';
import BlogSection from '../../components/BlogSection/BlogSection';
import Footer from '../../components/footer/Footer';
import Scrollbar from '../../components/scrollbar/scrollbar';
import Logo from '../../images/logo.svg'


const TestimonialPage = () => {
    return (
        <Fragment>
            <HeaderTop />
            <Navbar hclass={'wpo-site-header'} Logo={Logo} />
            <PageTitle pageTitle={'Testimonial'} pagesub={'Testimonial'} />
            <CustomTestimonial />
            <BlogSection />
            <Footer />
            <Scrollbar />
        </Fragment>
    )
};
export default TestimonialPage;