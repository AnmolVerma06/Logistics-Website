import React from "react";
import { Link } from "react-router-dom";
import SectionTitle from "../SectionTitle/SectionTitle";
import blogs from '../../api/blogs'

const ClickHandler = () => {
    window.scrollTo(10, 0);
}

const BlogSection = (props) => {

    return (
        <section className="wpo-blog-section section-padding">
            <div className="container">
                <SectionTitle subtitle={'Latest News'} title={'Latest News & Article'} />
                <div className="wpo-blog-items">
                    <div className="row">
                        {blogs.slice(0,3).map((bloge, bkye) => (
                            <div className="col col-lg-4 col-md-6 col-12" key={bkye}>
                            <div className="wpo-blog-item" >
                                <div className="wpo-blog-img">
                                        <img src={bloge.screens} alt="" />
                                </div>
                                <div className="wpo-blog-content">
                                    <div className="wpo-blog-content-top">
                                        <span>Transport</span>
                                            <h2><Link onClick={ClickHandler} to="#">{bloge.title}</Link>
                                        </h2>
                                            <p>{bloge.description}</p>
                                        <ul>
                                            <li>02 Oct 2024</li>
                                            <li>By Kiara Cradock</li>
                                        </ul>
                                            <button className="b-btn" style={{border:'none',background:'none',padding:0,margin:0,cursor:'pointer'}} disabled>Read More</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}


export default BlogSection;

