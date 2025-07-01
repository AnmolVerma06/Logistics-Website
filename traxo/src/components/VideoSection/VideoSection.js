import React from 'react';
// import VideoModal from '../ModalVideo/VideoModal';

const VideoSection = () => {
    return (
        <section className="wpo-video-section">
            <div className="container">
                <div className="wpo-video-item">
                    <div className="row">
                        <div className="col-lg-6 col-md-8 col-12">
                            <div className="video-text-wrap">
                                <div className="wpo-viedo-text">
                                    <h2>Check our intro video and easy to get our services.</h2>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-4 col-12">
                            <div className="wpo-video-icon">
                                {/* <VideoModal/> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div> 
        </section>
    );
};

export default VideoSection;