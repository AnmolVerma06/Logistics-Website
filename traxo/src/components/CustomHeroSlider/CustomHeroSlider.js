import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import hero1 from '../../images/slider/slide-1.jpg';
import hero2 from '../../images/slider/slide-3.jpg';
import hero3 from '../../images/slider/slide-2.jpg';
import hero4 from '../../images/slider/slide-4.jpg';

const slides = [
    {
        image: hero1,
        title: "Sailing Coasts, Delivering With Precision",
        description: "Move your goods quickly and reliably along the nation’s coastline. Our coastal shipping ensures safe, efficient deliveries to key ports and coastal cities."
    },
    {
        image: hero2,
        title: "Nationwide Air Freight, Always On-Time",
        description: "Speed up urgent shipments with reliable domestic air cargo services that connect every major city with guaranteed punctuality."
    },
    {
        image: hero3,
        title: "Nationwide Logistics, Every Mile Covered",
        description: "From urban centers to rural towns, we provide flexible road transport tailored to your business needs for smooth, reliable deliveries."
    },
    {
        image: hero4,
        title: "Eco-Friendly, Efficient Rail Logistics",
        description: "Choose sustainable rail transport to reduce your carbon footprint while enjoying fast, secure deliveries across domestic routes."
    }
];

const CustomHeroSlider = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => clearInterval(timer);
    }, []);

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    const goToNextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const goToPrevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const ClickHandler = () => {
        window.scrollTo(10, 0);
    };

    return (
        <section className="wpo-hero-slider wpo-hero-slider-s1">
            <div className="hero-slider-container">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`slide-inner slide-bg-image ${index === currentSlide ? 'active' : ''}`}
                        style={{
                            backgroundImage: `url(${slide.image})`,
                            opacity: index === currentSlide ? 1 : 0,
                            transform: `translateX(${(index - currentSlide) * 100}%)`,
                            transition: 'all 0.5s ease-in-out'
                        }}
                    >
                        <div className="gradient-overlay"></div>
                        <div className="vector-1"></div>
                        <div className="vector-2"></div>
                        <div className="vector-3"></div>
                        <div className="vector-4"></div>
                        <div className="vector-5"></div>
                        <div className="vector-6"></div>
                        <div className="vector-7"></div>
                        <div className="vector-8"></div>
                        <div className="container">
                            <div className="slide-content">
                                <div className="slide-title">
                                    <h2>{slide.title}</h2>
                                </div>
                                <div className="slide-text">
                                    <p>{slide.description}</p>
                                </div>
                                <div className="clearfix"></div>
                                <div className="slide-btns">
                                    <Link onClick={ClickHandler} to="/service-single/air-transport" className="theme-btn-s2">
                                        All Services
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
        </section>
    );
};

export default CustomHeroSlider; 