import React, { useState, useEffect, useRef } from 'react';
import './Settings.css'; // Import CSS file for styling
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

function Settings() {
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    phoneNumber: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true); // State to manage visibility
  const userId = localStorage.getItem('userId'); // Get user ID from localStorage
  const settingsRef = useRef(null); // Ref for settings container
  const navigate = useNavigate(); // Create navigate function

  // Fetch user details on component mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://chatwithme-t7jo.onrender.com/api/users`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }

        const data = await response.json();
        console.log(data);
        setUserDetails(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  const validatePhoneNumber = (phoneNumber) => {
    const regex = /^[0-9]{10}$/; // Simple regex for 10-digit phone numbers
    return regex.test(phoneNumber);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validate phone number
    if (!validatePhoneNumber(userDetails.phoneNumber)) {
      setError('Phone number must be 10 digits long');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`https://chatwithme-t7jo.onrender.com/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(userDetails),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user details');
      }

      setSuccess('User details updated successfully!');
      
      // Redirect after a timeout
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`https://chatwithme-t7jo.onrender.com/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete account');
      }

      // Clear local storage and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      window.location.href = '/login'; 
    } catch (error) {
      setError(error.message);
    }
  };

  // Close settings when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        console.log('Clicked outside settings');
        setIsOpen(false); // Close the settings
        navigate('/dashboard'); // Navigate to the dashboard
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [navigate]); // Add navigate to the dependency array

  // Render nothing if settings are closed
  if (!isOpen) return null;

  return (
    <div className="settings-container" ref={settingsRef}>
      <h1 className="settings-title">Settings</h1>
      {loading ? (
        <p className="loading-message">Loading user details...</p>
      ) : (
        <form onSubmit={handleUpdate} className="settings-form">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={userDetails.name}
            onChange={handleChange}
            required
            className="form-input"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={userDetails.email}
            onChange={handleChange}
            required
            className="form-input"
          />
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={userDetails.phoneNumber}
            onChange={handleChange}
            className="form-input"
          />
          <button type="submit" className="update-button">Update Details</button>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <button type="button" onClick={handleDelete} className="delete-account-button">
            Delete Account
          </button>
        </form>
      )}
    </div>
  );
}

export default Settings;
