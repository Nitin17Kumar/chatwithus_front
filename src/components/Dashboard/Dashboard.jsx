import React, { useEffect, useState } from 'react';
import UserList from '../userlist/UserList';
import MessageSection from '../message/MessageSection';
import Navbar from '../Navbar/Navbar';
import Settings from '../setting/Setting';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'; 

function Dashboard() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    navigate('/login');
  };

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found. Please log in.');
      return;
    }

    try {
      const response = await fetch('https://chatwithme-t7jo.onrender.com/api/users', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setUsers(data);

      if (data.length > 0 && !selectedUser) {
        handleUserClick(data[0]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(error.message);
    }
  };

  const fetchMessages = async (userId) => {
    if (!userId) return;

    const token = localStorage.getItem('token');
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`https://chatwithme-t7jo.onrender.com/api/messages/${userId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch messages: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user._id);
    setSelectedUserName(user.name);
    fetchMessages(user._id);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="dashboard-container">
      <Navbar setShowSettings={setShowSettings} handleLogout={handleLogout} />
      <div className="dashboard-content">
        <UserList users={users} onUserClick={handleUserClick} selectedUser={selectedUser} />
        <MessageSection
          selectedUserName={selectedUserName}
          messages={messages}
          loading={loading}
          error={error}
          setMessage={setMessage}
          message={message}
          selectedUser={selectedUser}
          fetchMessages={fetchMessages}
        />
      </div>
      {showSettings && (
        <div className="settings-modal">
          <Settings />
          
        </div>
      )}
    </div>
  );
}

export default Dashboard;
