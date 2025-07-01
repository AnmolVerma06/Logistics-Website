import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar/Sidebar';
import Navbar from './components/Navbar/Navbar';
import AdminDashboard from './AdminDashboard';
import { SearchProvider } from './SearchContext';

function App() {
  const [activeTab, setActiveTab] = useState('orders');

  return (
    <SearchProvider>
      <div className="app">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="main-content">
          <Navbar />
          <AdminDashboard activeTab={activeTab} />
        </div>
      </div>
    </SearchProvider>
  );
}

export default App;
