import React from 'react';
import ReactDOM from 'react-dom/client';
import AllRoute from './main-component/router';
import reportWebVitals from './reportWebVitals';
// import { ParallaxProvider } from 'react-scroll-parallax';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/font-awesome.min.css';
import './css/themify-icons.css';
import './css/animate.css';
import './css/flaticon.css';
import './sass/style.scss';


// import { PersistGate } from "redux-persist/integration/react";
import { Provider } from 'react-redux';
import { store } from './store';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <AllRoute />
        </Provider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
