import React from 'react';
import './Sidebar.css';
import Logo from '../Logo/Logo';

const Sidebar = ({ activeTab, setActiveTab }) => {
    return (
        <div className="sidebar">
            <div className="logo">
                <Logo />
                <div className="logo-text">
                    <h2>Traxo.</h2>
                    <p>Delivery Panel</p>
                </div>
            </div>
            <nav className="nav">
                <ul>
                    <li 
                        className={activeTab === 'pickup' ? 'active' : ''}
                        onClick={() => setActiveTab('pickup')}
                    >
                        {/* Box Arrow Up Icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                        <span>To Be Picked Up</span>
                    </li>
                    <li 
                        className={activeTab === 'delivery' ? 'active' : ''}
                        onClick={() => setActiveTab('delivery')}
                    >
                        {/* Truck Icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                        <span>To Be Delivered</span>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar; 