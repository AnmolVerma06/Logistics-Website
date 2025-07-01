import React from 'react';
import ContactForm from '../ContactFrom/ContactForm'
import ContactMap from './ContactMap';


const Contactpage = () => {

    return (
        <div>
            <ContactMap />
            <section className="wpo-contact-pg-section section-padding pt-0">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">
                            <div className="wpo-contact-form-area">
                                <div className="wpo-contact-title">
                                    <h2>Have Any Question?</h2>
                                    <p>Need a quote or help with delivery? Our friendly team is ready to assist you.</p>
                                </div>
                                <ContactForm />
                            </div>
                        </div>
                        <div className="col col-lg-4">
                            <div className="office-info">
                                <div className="office-info-item">
                                    <div className="office-info-icon">
                                        <div className="icon">
                                            <i className="fi flaticon-phone-call"></i>
                                        </div>
                                    </div>
                                    <div className="office-info-text">
                                        <h2>Call Us:</h2>
                                        <p>+91 7991589875</p>
                                    </div>
                                </div>
                                <div className="office-info-item">
                                    <div className="office-info-icon">
                                        <div className="icon">
                                            <i className="fi flaticon-email-3"></i>
                                        </div>
                                    </div>
                                    <div className="office-info-text">
                                        <h2>E-mail Us:</h2>
                                        <p>traxo@gmail.com</p>
                                    </div>
                                </div>
                                <div className="office-info-item">
                                    <div className="office-info-icon">
                                        <div className="icon">
                                            <i className="fi flaticon-clock"></i>
                                        </div>
                                    </div>
                                    <div className="office-info-text">
                                        <h2>Opening Hours:</h2>
                                        <p>09:00 am to 10:00 pm</p>
                                    </div>
                                </div>
                                <div className="office-info-item">
                                    <div className="office-info-icon">
                                        <div className="icon">
                                            <i className="fi flaticon-location-1"></i>
                                        </div>
                                    </div>
                                    <div className="office-info-text">
                                        <h2>Our Location:</h2>
                                        <p>Indira Nagar, Kanpur</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )


}

export default Contactpage;
