import React, { useState, useEffect } from 'react';
import SectionTitle from '../SectionTitle/SectionTitle';
import sImg1 from '../../images/testimonial/1.png'
import sImg2 from '../../images/testimonial/2.png'
import sImg3 from '../../images/testimonial/3.png'

import Img1 from '../../images/testimonial/img-1.png'
import Img2 from '../../images/testimonial/img-2.png'
import Img3 from '../../images/testimonial/img-3.png'
import Img4 from '../../images/testimonial/img-4.png'
import Img5 from '../../images/testimonial/img-5.png'
import Img6 from '../../images/testimonial/img-6.png'
import Img7 from '../../images/testimonial/img-7.png'
import Img8 from '../../images/testimonial/img-8.png'
import Img9 from '../../images/testimonial/img-9.png'
import Shape from '../../images/testimonial/shape.png'

const testimonials = [
    {
        id: '01',
        img: sImg1,
        Des: "When we needed urgent air freight for a critical pharmaceutical shipment, they delivered beyond expectations. The package arrived a day ahead of schedule, and their customer support team checked in with us regularly to ensure everything was on track. We trust them completely for all our sensitive shipments.",
        title: 'Harry Abraham',
        sub: "Pharmaceutical Supplier",
    },
    {
        id: '02',
        img: sImg2,
        Des: "As someone who ships personal parcels regularly, I've dealt with many frustrating courier experiences. With them, the process was so easy—booking was simple, and the delivery was fast. They exceeded my expectations by ensuring my fragile items were delivered safely",
        title: 'Jenelia Orkid',
        sub: "Private Customer",
    },
    {
        id: '03',
        img: sImg3,
        Des: "I urgently needed to send legal papers to my parents in another city. They picked up the documents the same day I booked and delivered them securely the next morning. Communication was excellent throughout, which made the entire experience stress-free.",
        title: 'Cathi Falcon',
        sub: "Private Customer",
    },
];

const CustomTestimonial = (props) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Auto-play functionality
    useEffect(() => {
        const interval = setInterval(() => {
            if (!isTransitioning) {
                nextSlide();
            }
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(interval);
    }, [currentSlide, isTransitioning]);

    const nextSlide = () => {
        if (!isTransitioning) {
            setIsTransitioning(true);
            setCurrentSlide((prev) => (prev + 1) % testimonials.length);
            setTimeout(() => setIsTransitioning(false), 300);
        }
    };

    const prevSlide = () => {
        if (!isTransitioning) {
            setIsTransitioning(true);
            setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
            setTimeout(() => setIsTransitioning(false), 300);
        }
    };

    const goToSlide = (index) => {
        if (!isTransitioning && index !== currentSlide) {
            setIsTransitioning(true);
            setCurrentSlide(index);
            setTimeout(() => setIsTransitioning(false), 300);
        }
    };

    return (
        <section className="wpo-testimonial-section">
            <div className="container-fluid">
                <div className="row align-items-center">
                    <div className="col-lg-5 col-md-10 col-10" style={{maxHeight: "650px",overflow: "hidden",position: "relative",}}>
                        <div className="wpo-testimonial-left">
                            <div className="wpo-testimonial-image-left">
                                <div className="image-1">
                                    <img src={Img1} alt="" />
                                </div>
                                <div className="image-2 floating-item">
                                    <img src={Img2} alt="" />
                                </div>
                                <div className="image-3">
                                    <img src={Img3} alt="" />
                                </div>
                                <div className="image-4 floating-item">
                                    <img src={Img4} alt="" />
                                </div>
                                <div className="image-5 floating-item">
                                    <img src={Img5} alt="" />
                                </div>
                                <div className="image-6">
                                    <img src={Img6} alt="" />
                                </div>
                                <div className="image-7 floating-item">
                                    <img src={Img7} alt="" />
                                </div>
                                <div className="image-8 floating-item">
                                    <img src={Img8} alt="" />
                                </div>
                                <div className="image-9">
                                    <img src={Img9} alt="" />
                                </div>
                            </div>
                            <div className="left-shape">
                                <img src={Shape} alt="" />
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-7 col-md-12 col-12">
                        <div className="wpo-testimonial-right">
                            <SectionTitle subtitle={'HAPPY CUSTOMER'} title={'What clients say?'} />
                            <div className="wpo-testimonial-wrap">
                                <div className="custom-testimonial-slider">
                                    {/* Only show the current testimonial */}
                                    <div className="wpo-testimonial-slide single-slide">
                                        <ul>
                                            <li><i className="fa fa-star"></i></li>
                                            <li><i className="fa fa-star"></i></li>
                                            <li><i className="fa fa-star"></i></li>
                                            <li><i className="fa fa-star"></i></li>
                                            <li><i className="fa fa-star"></i></li>
                                        </ul>
                                        <p>{testimonials[currentSlide].Des}</p>
                                        <div className="wpo-testimonial-client">
                                            <div className="wpo-testimonial-client-img">
                                                <img src={testimonials[currentSlide].img} alt="" />
                                            </div>
                                            <div className="wpo-testimonial-client-text">
                                                <h4>{testimonials[currentSlide].title}</h4>
                                                <span>{testimonials[currentSlide].sub}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Controls below the card */}
                                    <div className="testimonial-controls">
                                        <button 
                                            className="testimonial-nav-btn prev-btn" 
                                            onClick={prevSlide}
                                            aria-label="Previous testimonial"
                                        >
                                            <i className="fa fa-angle-left"></i>
                                        </button>
                                        <div className="testimonial-dots">
                                            {testimonials.map((_, index) => (
                                                <button
                                                    key={index}
                                                    className={`testimonial-dot ${index === currentSlide ? 'active' : ''}`}
                                                    onClick={() => goToSlide(index)}
                                                    aria-label={`Go to testimonial ${index + 1}`}
                                                />
                                            ))}
                                        </div>
                                        <button 
                                            className="testimonial-nav-btn next-btn" 
                                            onClick={nextSlide}
                                            aria-label="Next testimonial"
                                        >
                                            <i className="fa fa-angle-right"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                .custom-testimonial-slider {
                    position: relative;
                    overflow: visible;
                }
                .single-slide {
                    width: 100%;
                    transition: all 0.3s ease-in-out;
                }
                .testimonial-controls {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 24px;
                    margin-top: 32px;
                }
                .testimonial-nav-btn {
                    background: #fff;
                    border: none;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
                    transition: all 0.3s;
                    font-size: 20px;
                }
                .testimonial-nav-btn:hover {
                    background: #f5f5f5;
                }
                .testimonial-dots {
                    display: flex;
                    gap: 10px;
                }
                .testimonial-dot {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    border: none;
                    background: #ddd;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .testimonial-dot.active {
                    background: #007bff;
                    transform: scale(1.2);
                }
                .testimonial-dot:hover {
                    background: #007bff;
                }
                @media (max-width: 991px) {
                    .testimonial-controls {
                        margin-top: 20px;
                    }
                }
            `}</style>
        </section>
    );
}

export default CustomTestimonial; 