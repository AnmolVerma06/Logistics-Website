import React, { useState, useEffect } from 'react';

const CustomSlider = ({ children, autoplay = true, interval = 5000 }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const slides = React.Children.toArray(children);

    useEffect(() => {
        if (!autoplay) return;

        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, interval);

        return () => clearInterval(timer);
    }, [autoplay, interval, slides.length]);

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    const goToNextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const goToPrevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    return (
        <div className="custom-slider">
            <div className="slider-container">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`slide ${index === currentSlide ? 'active' : ''}`}
                        style={{
                            transform: `translateX(${(index - currentSlide) * 100}%)`,
                            transition: 'transform 0.5s ease-in-out'
                        }}
                    >
                        {slide}
                    </div>
                ))}
            </div>
            <div className="slider-controls">
                <button className="prev-btn" onClick={goToPrevSlide}>
                    <i className="ti-angle-left"></i>
                </button>
                <button className="next-btn" onClick={goToNextSlide}>
                    <i className="ti-angle-right"></i>
                </button>
            </div>
            <div className="slider-dots">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        className={`dot ${index === currentSlide ? 'active' : ''}`}
                        onClick={() => goToSlide(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default CustomSlider; 