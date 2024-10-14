import React, { useState } from 'react';
import './Navbar.css'; 
import { FaCog, FaSignOutAlt, FaBars } from 'react-icons/fa'; 

function Navbar({ setShowSettings, handleLogout }) {
  const [showButtons, setShowButtons] = useState(false); 

  const toggleButtonVisibility = () => {
    setShowButtons(prev => !prev); 
  };

  return (
    <nav className="navbar">
      <h2>ChatWithUs</h2>
      <button className="toggle-button" onClick={toggleButtonVisibility}>
        <FaBars />
      </button>
      <div className={`right ${showButtons ? 'visible' : ''}`}>
        <button onClick={() => setShowSettings(prev => !prev)}>
          <FaCog /> Settings
        </button>
        <button onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
