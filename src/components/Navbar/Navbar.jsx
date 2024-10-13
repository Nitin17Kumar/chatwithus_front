import React, { useState } from 'react';
import './Navbar.css'; // Import the CSS file
import { FaCog, FaSignOutAlt, FaBars } from 'react-icons/fa'; // Import icons

function Navbar({ setShowSettings, handleLogout }) {
  const [showButtons, setShowButtons] = useState(false); // State to toggle button visibility

  const toggleButtonVisibility = () => {
    setShowButtons(prev => !prev); // Toggle button visibility
  };

  return (
    <nav className="navbar">
      <h2>ChatWithUs</h2>
      <button className="toggle-button" onClick={toggleButtonVisibility}>
        <FaBars /> {/* Hamburger icon */}
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
