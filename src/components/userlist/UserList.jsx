import React from 'react';
import './UserList.css'; 

function UserList({ users, onUserClick, selectedUser }) {
  const currentUserId = localStorage.getItem('userId');

  const filteredUsers = users.filter(user => user._id !== currentUserId);

  return (
    <div className="user-list">
      <h2>Users</h2>
      {filteredUsers.length === 0 ? (
        <p>No users available.</p>
      ) : (
        filteredUsers.map((user) => (
          <div
            key={user._id}
            onClick={() => onUserClick(user)}
            className={`user-item ${selectedUser === user._id ? 'selected' : ''}`}
          >
            {user.name}
          </div>
        ))
      )}
    </div>
  );
}

export default UserList;
