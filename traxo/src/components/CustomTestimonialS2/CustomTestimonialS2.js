import React, { useState, useEffect } from 'react';
import SectionTitle from '../SectionTitle/SectionTitle';
import sImg1 from '../../images/testimonial/1.jpg';
import sImg2 from '../../images/testimonial/2.jpg';
import sImg3 from '../../images/testimonial/3.jpg';

const testimonials = [
    {
        id: '01',
        img: sImg1,
        Des: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.The point of using Lorem Ipsum is that it has a more- or - less normal distribution making it look like readable a reader will be distracted by the readable content.",
        title: 'Harry Abraham',
        sub: "UI/UX Designer",
    },
    {
        id: '02',
        img: sImg2,
        Des: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.The point of using Lorem Ipsum is that it has a more- or - less normal distribution making it look like readable a reader will be distracted by the readable content.",
        title: 'Jenelia Orkid',
        sub: "Fashion Designer",
    },
    {
        id: '03',
        img: sImg3,
        Des: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.The point of using Lorem Ipsum is that it has a more- or - less normal distribution making it look like readable a reader will be distracted by the readable content.",
        title: 'Cathi Falcon',
        sub: "CEO Barta",
    },
];

const CustomTestimonialS2 = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 991);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 991);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => {
                if (isMobile) {
                    return (prev + 1) % testimonials.length;
                } else {
                    const maxSlides = Math.ceil(testimonials.length / 2);
                    return (prev + 1) % maxSlides;
                }
            });
        }, 5000);

        return () => clearInterval(interval);
    }, [isMobile, testimonials.length]);

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => {
            if (isMobile) {
                return (prev + 1) % testimonials.length;
            } else {
                const maxSlides = Math.ceil(testimonials.length / 2);
                return (prev + 1) % maxSlides;
            }
        });
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => {
            if (isMobile) {
                return (prev - 1 + testimonials.length) % testimonials.length;
            } else {
                const maxSlides = Math.ceil(testimonials.length / 2);
                return (prev - 1 + maxSlides) % maxSlides;
            }
        });
    };

    // Calculate the dynamic width of the testimonial-slider-wrapper
    const wrapperWidth = isMobile ? testimonials.length * 100 : testimonials.length * 50;

    return (
        <section className="wpo-testimonial-section-s2">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-12 col-md-12 col-12">
                        <div className="wpo-testimonial-right">
                            <SectionTitle subtitle={'HAPPY CUSTOMER'} title={'What clients say?'} />
                            
                            <div className="testimonial-slider-container">
                                <div className="testimonial-slider-wrapper" style={{
                                    width: `${wrapperWidth}%`,
                                    transform: `translateX(-${currentSlide * (isMobile ? 100 : 50)}%)`,
                                    transition: 'transform 0.5s ease-in-out'
                                }}>
                                    {testimonials.map((testimonial, index) => (
                                        <div className="wpo-testimonial-item" key={index} style={{
                                            width: isMobile ? '100%' : '50%',
                                            flexShrink: 0,
                                            padding: '0 15px',
                                            boxSizing: 'border-box'
                                        }}>
                                            <div className="wpo-testimonial-slide">
                                                <div className="wpo-testimonial-slide-inner">
                                                    <ul>
                                                        <li><i className="fa fa-star"></i></li>
                                                        <li><i className="fa fa-star"></i></li>
                                                        <li><i className="fa fa-star"></i></li>
                                                        <li><i className="fa fa-star"></i></li>
                                                        <li><i className="fa fa-star"></i></li>
                                                    </ul>
                                                    <p>{testimonial.Des}</p>
                                                </div>
                                                <div className="wpo-testimonial-client">
                                                    <div className="wpo-testimonial-client-img">
                                                        <img src={testimonial.img} alt="" />
                                                    </div>
                                                    <div className="wpo-testimonial-client-text">
                                                        <h4>{testimonial.title}</h4>
                                                        <span>{testimonial.sub}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="slider-controls">
                                    <button className="prev-btn" onClick={prevSlide}>
                                        <i className="fa fa-angle-left"></i>
                                    </button>
                                    <button className="next-btn" onClick={nextSlide}>
                                        <i className="fa fa-angle-right"></i>
                                    </button>
                                </div>

                                <div className="slider-dots">
                                    {Array.from({ length: isMobile ? testimonials.length : Math.ceil(testimonials.length / 2) }).map((_, index) => (
                                        <button
                                            key={index}
                                            className={`dot ${index === currentSlide ? 'active' : ''}`}
                                            onClick={() => goToSlide(index)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CustomTestimonialS2; 