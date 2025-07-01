import React, { useContext } from 'react';
import { SearchContext } from '../../SearchContext';
import './Navbar.css';

const Navbar = () => {
    const { searchTerm, setSearchTerm } = useContext(SearchContext);

    return (
        <div className="navbar">
            <input
                type="text"
                className="navbar-search"
                placeholder="Search Order ID..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{
                    padding: '6px 12px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    marginRight: '16px',
                    fontSize: '1rem',
                    flex: 1,
                    maxWidth: '300px'
                }}
            />
            <div className="profile">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6c757d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </div>
        </div>
    );
};

export default Navbar; 