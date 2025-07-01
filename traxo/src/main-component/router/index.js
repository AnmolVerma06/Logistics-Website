import React from 'react';
import { BrowserRouter, Routes, Route, } from "react-router-dom";
import ScrollToTop from '../../utils/ScrollToTop';
import Homepage from '../HomePage/HomePage'
// import HomePage2 from '../HomePage2/HomePage2';
// import HomePage3 from '../HomePage3/HomePage3';
import AboutPage from '../AboutPage/AboutPage';
import ServicePages from '../ServicePage/ServicePage';
import ServicePagesS2 from '../ServicePageS2/ServicePageS2';
import ServicePagesS3 from '../ServicePageS3/ServicePageS3';
import ServiceSinglePage from '../ServiceSinglePage/ServiceSinglePage';
import ProjectPage from '../ProjectPage/ProjectPage';
import ProjectPageS2 from '../ProjectPageS2/ProjectPageS2';
import ProjectPageS3 from '../ProjectPageS3/ProjectPageS3';
import ProjectSinglePage from '../ProjectSinglePage/ProjectSinglePage';
// import ProductSinglePage from '../ProductSinglePage';
import CartPage from '../CartPage';
import CheckoutPage from '../CheckoutPage';
import OrderRecived from '../OrderRecived';
// import BlogPage from '../BlogPage/BlogPage'
// import BlogPageLeft from '../BlogPageLeft/BlogPageLeft'
// import BlogPageFullwidth from '../BlogPageFullwidth/BlogPageFullwidth'
// import BlogDetails from '../BlogDetails/BlogDetails'
// import BlogDetailsLeftSiide from '../BlogDetailsLeftSiide/BlogDetailsLeftSiide'
// import BlogDetailsFull from '../BlogDetailsFull/BlogDetailsFull'
import ContactPage from '../ContactPage/ContactPage';
import ErrorPage from '../ErrorPage/ErrorPage';
import ShopPage from '../ShopPage/ShopPage';
import TestimonialPage from '../TestimonialPage/TestimonialPage';
import TrackingPage from '../TrackingPage/TrackingPage';
import AdminDashboard from '../../admin/AdminDashboard';
import AirTransportSingle from '../ServiceSinglePage/AirTransportSingle';
import RoadTransportSingle from '../ServiceSinglePage/RoadTransportSingle';
import OceanTransportSingle from '../ServiceSinglePage/OceanTransportSingle';
import TrainTransportSingle from '../ServiceSinglePage/TrainTransportSingle';


const AllRoute = () => {

  return (
    <div className="App">
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="home" element={<Homepage />} />
         
          <Route path="about" element={<AboutPage />} />
          <Route path="service" element={<ServicePages />} />
          <Route path="service-s2" element={<ServicePagesS2 />} />
          <Route path="service-s3" element={<ServicePagesS3 />} />
          <Route path="service-single/:slug" element={<ServiceSinglePage />} />
          <Route path="project" element={<ProjectPage />} />
          <Route path="project-s2" element={<ProjectPageS2 />} />
          <Route path="project-s3" element={<ProjectPageS3 />} />
          <Route path="project-single" element={<ProjectSinglePage />} />

          <Route path='cart' element={<CartPage />} />
          <Route path='checkout' element={<CheckoutPage />} />
          <Route path='order_received' element={<OrderRecived />} />

          <Route path='contact' element={<ContactPage />} />
          <Route path='404' element={<ErrorPage />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path='testimonial' element={<TestimonialPage />} />
          <Route path='tracking' element={<TrackingPage />} />
          <Route path='/admin' element={<AdminDashboard />} />
          <Route path="/service-single/air-transport" element={<AirTransportSingle />} />
          <Route path="/service-single/road-transport" element={<RoadTransportSingle />} />
          <Route path="/service-single/ocean-transport" element={<OceanTransportSingle />} />
          <Route path="/service-single/train-transport" element={<TrainTransportSingle />} />
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default AllRoute;
