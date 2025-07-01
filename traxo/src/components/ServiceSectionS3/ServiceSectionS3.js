import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SectionTitle from '../SectionTitle/SectionTitle';
import Services from "../../api/Services";

const ServiceSectionS3 = () => {
    const ClickHandler = () => {
        window.scrollTo(10, 0);
    }

    // Responsive slidesToShow
    const getSlidesToShow = () => {
        if (window.innerWidth < 767) return 1;
        if (window.innerWidth < 1199) return 2;
        return 3;
    };

    const [current, setCurrent] = useState(0);
    const [slidesToShow, setSlidesToShow] = useState(getSlidesToShow());
    const total = Services.slice(7, 11).length;

    useEffect(() => {
        const handleResize = () => setSlidesToShow(getSlidesToShow());
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Auto-play
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % total);
        }, 3000);
        return () => clearInterval(interval);
    }, [total]);

    // Calculate visible slides
    const getVisibleSlides = () => {
        let slides = [];
        for (let i = 0; i < slidesToShow; i++) {
            slides.push(Services.slice(7, 11)[(current + i) % total]);
        }
        return slides;
    };

    const prevSlide = () => {
        setCurrent((prev) => (prev - 1 + total) % total);
    };
    const nextSlide = () => {
        setCurrent((prev) => (prev + 1) % total);
    };

    return (
        <div className="wpo-service-area-s3 section-padding">
            <div className="container">
                <SectionTitle subtitle={'Our Services'} title={'Best solutions here'} />
                <div className="wpo-service-wrap">
                    <div className="service-active custom-carousel" style={{position: 'relative'}}>
                        <button className="carousel-arrow left" onClick={prevSlide} aria-label="Previous">
                            <i className="fa fa-arrow-left"></i>
                        </button>
                        <div className="carousel-track" style={{ display: 'flex', transition: 'all 0.5s' }}>
                            {getVisibleSlides().map((service, idx) => (
                                <div className="col-lg-6 col-md-12 col-12" key={idx} style={{ flex: `0 0 ${100 / slidesToShow}%` }}>
                                    <div className="wpo-service-item ">
                                        <div className="wpo-service-img">
                                            <img src={service.image} alt="" />
                                        </div>
                                        <div className="wpo-service-content">
                                            <div className="icon">
                                                <i className={service.icon}></i>
                                            </div>
                                            <h2>{service.title}</h2>
                                            <p>{service.description}</p>
                                            <Link to={`/service-single/${service.slug}`} onClick={ClickHandler}>Read More</Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="carousel-arrow right" onClick={nextSlide} aria-label="Next">
                            <i className="fa fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
            </div>
            <style>{`
                .carousel-arrow {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    z-index: 2;
                    width: 64px;
                    height: 64px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.7);
                    border: none;
                    box-shadow: 0 4px 16px 0 rgba(0,0,0,0.08), 0 0 0 8px rgba(255,109,90,0.07);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: background 0.2s, box-shadow 0.2s;
                    font-size: 24px;
                    outline: none;
                }
                .carousel-arrow.left {
                    left: -48px;
                }
                .carousel-arrow.right {
                    right: -48px;
                }
                .carousel-arrow i {
                    color: #ff6d5a;
                    font-size: 28px;
                }
                .carousel-arrow:hover {
                    background: #fff;
                    box-shadow: 0 8px 24px 0 rgba(0,0,0,0.12), 0 0 0 8px rgba(255,109,90,0.13);
                }
                @media (max-width: 1400px) {
                    .carousel-arrow.left { left: -24px; }
                    .carousel-arrow.right { right: -24px; }
                }
                @media (max-width: 1199px) {
                    .carousel-track > div { flex: 0 0 50% !important; }
                    .carousel-arrow.left { left: -16px; }
                    .carousel-arrow.right { right: -16px; }
                }
                @media (max-width: 991px) {
                    .carousel-arrow.left, .carousel-arrow.right { display: none; }
                }
                @media (max-width: 767px) {
                    .carousel-track > div { flex: 0 0 100% !important; }
                }
            `}</style>
        </div>
    );
};

export default ServiceSectionS3;