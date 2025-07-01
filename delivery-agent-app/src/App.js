import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar/Sidebar';
import Navbar from './components/Navbar/Navbar';
import DeliveryDashboard from './DeliveryDashboard';

function App() {
  const [activeTab, setActiveTab] = useState('pickup');

  return (
    <div className="app">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="main-content">
        <Navbar />
        <DeliveryDashboard activeTab={activeTab} />
      </div>
    </div>
  );
}

export default App;
