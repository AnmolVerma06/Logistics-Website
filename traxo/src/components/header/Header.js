import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import MobileMenu from '../MobileMenu/MobileMenu'
import { totalPrice } from "../../utils";
import { connect } from "react-redux";
import { removeFromCart } from "../../store/actions/action";



const Header = (props) => {
    const [menuActive, setMenuState] = useState(false);
    const [cartActive, setcartState] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [authTab, setAuthTab] = useState('login'); // 'login' or 'signup'
    const [loginForm, setLoginForm] = useState({ email: '', password: '' });
    const [signupForm, setSignupForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [loginError, setLoginError] = useState('');
    const [signupError, setSignupError] = useState('');
    const [userName, setUserName] = useState(() => {
        const stored = localStorage.getItem('userName');
        return stored && stored !== 'undefined' ? stored : '';
    });

    const SubmitHandler = (e) => {
        e.preventDefault()
    }

    const ClickHandler = () => {
        window.scrollTo(10, 0);
    }

    const { carts } = props;

    const handleLoginChange = (e) => {
        setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
        setLoginError('');
    };
    const handleSignupChange = (e) => {
        setSignupForm({ ...signupForm, [e.target.name]: e.target.value });
        setSignupError('');
    };
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoginError('');
        if (!loginForm.email || !loginForm.password) {
            setLoginError('Please fill in all fields.');
            return;
        }
        try {
            const res = await fetch('https://logistics-website-67n1.onrender.com/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginForm),
            });
            const data = await res.json();
            if (!res.ok) {
                setLoginError(data.error || 'Login failed');
            } else {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userName', data.name);
                setUserName(data.name);
                setShowAuthModal(false);
                window.dispatchEvent(new Event('user-login'));
            }
        } catch (err) {
            setLoginError('Network error');
        }
    };
    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        setSignupError('');
        if (!signupForm.name || !signupForm.email || !signupForm.password || !signupForm.confirmPassword) {
            setSignupError('Please fill in all fields.');
            return;
        }
        if (signupForm.password !== signupForm.confirmPassword) {
            setSignupError('Passwords do not match.');
            return;
        }
        try {
            const res = await fetch('https://logistics-website-67n1.onrender.com/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: signupForm.name, email: signupForm.email, password: signupForm.password }),
            });
            const data = await res.json();
            if (!res.ok) {
                setSignupError(data.error || 'Signup failed');
            } else {
                setAuthTab('login');
                setSignupError('Signup successful! Please login.');
            }
        } catch (err) {
            setSignupError('Network error');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        setUserName('');
        setShowUserDropdown(false);
        window.dispatchEvent(new Event('user-logout'));
    };

    return (
        <header id="header">
            <div className={"" + props.hclass}>
                <nav className="navigation navbar navbar-expand-lg navbar-light">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-3 col-md-3 col-3 d-lg-none dl-block">
                                <MobileMenu />
                            </div>
                            <div className="col-md-6 col-6 d-lg-none dl-block">
                                <div className="navbar-header">
                                    <Link onClick={ClickHandler} className="navbar-brand" to="/home"><img src={props.Logo}
                                        alt="" /></Link>
                                </div>
                            </div>
                            <div className="col-lg-7 col-md-1 col-1">
                                <div id="navbar" className="collapse navbar-collapse navigation-holder">
                                    <button className="menu-close"><i className="ti-close"></i></button>
                                    <ul className="nav navbar-nav mb-2 mb-lg-0">
                                        <li className="menu-item-has-children">
                                            <Link onClick={ClickHandler} to="/home">Home</Link>
                                           
                                        </li>
                                        <li><Link onClick={ClickHandler} to="/about">About</Link></li>
                                        <li className="menu-item-has-children">
                                            <Link onClick={ClickHandler} to="#">Services</Link>
                                            <ul className="sub-menu">
                                                <li><Link onClick={ClickHandler} to="/service-single/air-transport">Air Transport</Link></li>
                                                <li><Link onClick={ClickHandler} to="/service-single/road-transport">Road Transport</Link></li>
                                                <li><Link onClick={ClickHandler} to="/service-single/ocean-transport">Ocean Transport</Link></li>
                                                <li><Link onClick={ClickHandler} to="/service-single/train-transport">Train Transport</Link></li>
                                            </ul>
                                        </li>
                                       
                                       
                                        
                                        <li><Link onClick={ClickHandler} to="/contact">Contact</Link></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-lg-5 col-md-2 col-2">
                                <div className="header-right">
                                    
                                        
                                    {/* User Dropdown or Login/SignUp Button */}
                                    {userName ? (
                                        <div style={{ position: 'relative', display: 'inline-block' }}>
                                            <button
                                                className="theme-btn"
                                                style={{ marginLeft: 'auto', minWidth: 120 }}
                                                onClick={() => setShowUserDropdown((prev) => !prev)}
                                            >
                                                {userName} &#x25BC;
                                            </button>
                                            {showUserDropdown && (
                                                <div style={{
                                                    position: 'absolute',
                                                    right: 0,
                                                    top: '100%',
                                                    background: '#fff',
                                                    border: '1px solid #ddd',
                                                    borderRadius: 8,
                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                                    zIndex: 10000,
                                                    minWidth: 120,
                                                }}>
                                                    <button
                                                        onClick={handleLogout}
                                                        style={{
                                                            width: '100%',
                                                            padding: '0.7rem 1rem',
                                                            background: 'none',
                                                            border: 'none',
                                                            textAlign: 'left',
                                                            cursor: 'pointer',
                                                            fontSize: '1rem',
                                                        }}
                                                    >
                                                        Logout
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <Link
                                            onClick={e => { e.preventDefault(); setShowAuthModal(true); }}
                                            className="theme-btn"
                                            to="#auth"
                                            style={{ marginLeft: 'auto' }}
                                        >
                                            Login/SignUp
                                        </Link>
                                    )}
                                    <div className="close-form">
                                        <Link onClick={ClickHandler} className="theme-btn" to="/tracking">Tracking now</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>

            {/* Auth Modal */}
            {showAuthModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    background: 'rgba(0,0,0,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999
                }}>
                    <div style={{
                        background: '#fff',
                        borderRadius: '16px',
                        padding: '2.5rem 2rem 2rem 2rem',
                        minWidth: '350px',
                        maxWidth: '95vw',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                        position: 'relative',
                        width: '100%',
                        maxWidth: '400px',
                        animation: 'fadeIn .2s',
                    }}>
                        <button
                            onClick={() => setShowAuthModal(false)}
                            style={{
                                position: 'absolute',
                                top: '1.2rem',
                                right: '1.2rem',
                                background: 'none',
                                border: 'none',
                                fontSize: '1.7rem',
                                color: '#888',
                                cursor: 'pointer',
                                fontWeight: 700
                            }}
                            aria-label="Close"
                        >
                            &times;
                        </button>
                        <div style={{display: 'flex', justifyContent: 'center', marginBottom: '2rem'}}>
                            <button
                                onClick={() => setAuthTab('login')}
                                style={{
                                    flex: 1,
                                    padding: '0.75rem 0',
                                    border: 'none',
                                    background: authTab === 'login' ? '#3498db' : '#f5f7fa',
                                    color: authTab === 'login' ? '#fff' : '#333',
                                    fontWeight: 600,
                                    borderRadius: '8px 0 0 8px',
                                    fontSize: '1rem',
                                    cursor: 'pointer',
                                    transition: 'background 0.2s',
                                }}
                            >
                                Login
                            </button>
                            <button
                                onClick={() => setAuthTab('signup')}
                                style={{
                                    flex: 1,
                                    padding: '0.75rem 0',
                                    border: 'none',
                                    background: authTab === 'signup' ? '#27ae60' : '#f5f7fa',
                                    color: authTab === 'signup' ? '#fff' : '#333',
                                    fontWeight: 600,
                                    borderRadius: '0 8px 8px 0',
                                    fontSize: '1rem',
                                    cursor: 'pointer',
                                    transition: 'background 0.2s',
                                }}
                            >
                                Sign Up
                            </button>
                        </div>
                        {authTab === 'login' ? (
                            <form style={{display: 'flex', flexDirection: 'column', gap: '1.2rem'}} onSubmit={handleLoginSubmit}>
                                <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                                    <label htmlFor="login-email" style={{fontWeight: 500}}>Email</label>
                                    <input
                                        id="login-email"
                                        name="email"
                                        type="email"
                                        value={loginForm.email}
                                        onChange={handleLoginChange}
                                        placeholder="Enter your email"
                                        style={{padding: '0.8rem', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1rem'}}
                                        required
                                    />
                                </div>
                                <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                                    <label htmlFor="login-password" style={{fontWeight: 500}}>Password</label>
                                    <input
                                        id="login-password"
                                        name="password"
                                        type="password"
                                        value={loginForm.password}
                                        onChange={handleLoginChange}
                                        placeholder="Enter your password"
                                        style={{padding: '0.8rem', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1rem'}}
                                        required
                                    />
                                </div>
                                {loginError && <div style={{color: 'red', fontSize: '0.95rem', textAlign: 'center'}}>{loginError}</div>}
                                <button type="submit" className="theme-btn" style={{padding: '0.9rem', borderRadius: '6px', fontWeight: 600, fontSize: '1.1rem', marginTop: '0.5rem'}}>Login</button>
                            </form>
                        ) : (
                            <form style={{display: 'flex', flexDirection: 'column', gap: '1.2rem'}} onSubmit={handleSignupSubmit}>
                                <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                                    <label htmlFor="signup-name" style={{fontWeight: 500}}>Name</label>
                                    <input
                                        id="signup-name"
                                        name="name"
                                        type="text"
                                        value={signupForm.name}
                                        onChange={handleSignupChange}
                                        placeholder="Enter your name"
                                        style={{padding: '0.8rem', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1rem'}}
                                        required
                                    />
                                </div>
                                <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                                    <label htmlFor="signup-email" style={{fontWeight: 500}}>Email</label>
                                    <input
                                        id="signup-email"
                                        name="email"
                                        type="email"
                                        value={signupForm.email}
                                        onChange={handleSignupChange}
                                        placeholder="Enter your email"
                                        style={{padding: '0.8rem', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1rem'}}
                                        required
                                    />
                                </div>
                                <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                                    <label htmlFor="signup-password" style={{fontWeight: 500}}>Password</label>
                                    <input
                                        id="signup-password"
                                        name="password"
                                        type="password"
                                        value={signupForm.password}
                                        onChange={handleSignupChange}
                                        placeholder="Create a password"
                                        style={{padding: '0.8rem', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1rem'}}
                                        required
                                    />
                                </div>
                                <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                                    <label htmlFor="signup-confirm-password" style={{fontWeight: 500}}>Confirm Password</label>
                                    <input
                                        id="signup-confirm-password"
                                        name="confirmPassword"
                                        type="password"
                                        value={signupForm.confirmPassword}
                                        onChange={handleSignupChange}
                                        placeholder="Confirm your password"
                                        style={{padding: '0.8rem', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1rem'}}
                                        required
                                    />
                                </div>
                                {signupError && <div style={{color: 'red', fontSize: '0.95rem', textAlign: 'center'}}>{signupError}</div>}
                                <button type="submit" className="theme-btn" style={{padding: '0.9rem', borderRadius: '6px', fontWeight: 600, fontSize: '1.1rem', marginTop: '0.5rem', background: '#27ae60'}}>Sign Up</button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </header>
    )
}
const mapStateToProps = (state) => {
    return {
        carts: state.cartList.cart,
    };
};


export default connect(mapStateToProps, { removeFromCart })(Header);

















