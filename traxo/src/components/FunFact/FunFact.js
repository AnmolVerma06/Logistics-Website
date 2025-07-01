import React, { useState, useEffect, useRef } from 'react';
import Shape from '../../images/funfact.png'

const FunFact = (props) => {
    const [counts, setCounts] = useState({
        happyCustomer: 0,
        activeProjects: 0,
        expertMembers: 0,
        winningAwards: 0
    });

    const targetRef = useRef(null);
    const observer = useRef(null);

    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const handleIntersect = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const duration = 2000; // 2 seconds
                    const steps = 60; // 60fps
                    const stepDuration = duration / steps;
                    let currentStep = 0;

                    const interval = setInterval(() => {
                        currentStep++;
                        const progress = currentStep / steps;

                        setCounts({
                            happyCustomer: Math.floor(6823 * progress),
                            activeProjects: Math.floor(1670 * progress),
                            expertMembers: Math.floor(190 * progress),
                            winningAwards: Math.floor(20 * progress)
                        });

                        if (currentStep >= steps) {
                            clearInterval(interval);
                        }
                    }, stepDuration);

                    if (observer.current) {
                        observer.current.disconnect();
                    }
                }
            });
        };

        observer.current = new IntersectionObserver(handleIntersect, options);

        if (targetRef.current) {
            observer.current.observe(targetRef.current);
        }

        return () => {
            if (observer.current) {
                observer.current.disconnect();
            }
        };
    }, []);

    return (
        <section className={"" + props.hclass}>
            <div className="container">
                <div className="row">
                    <div className="col col-xs-12">
                        <div className="wpo-fun-fact-grids clearfix" ref={targetRef}>
                            <div className="grid">
                                <div className="info">
                                    <h3>{counts.happyCustomer}</h3>
                                    <p>happy customer</p>
                                </div>
                            </div>
                            <div className="grid">
                                <div className="info">
                                    <h3>{counts.activeProjects}</h3>
                                    <p>Active Shipments</p>
                                </div>
                            </div>
                            <div className="grid">
                                <div className="info">
                                    <h3>{counts.expertMembers}</h3>
                                    <p>expert members</p>
                                </div>
                            </div>
                            <div className="grid">
                                <div className="info">
                                    <h3>{counts.winningAwards}</h3>
                                    <p>winning awards</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="shape">
                <img src={Shape} alt="" />
            </div>
        </section>
    )
}

export default FunFact;




