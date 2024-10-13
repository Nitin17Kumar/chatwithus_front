import React from 'react';
import './MessageSection.css';

function MessageSection({
  selectedUserName,
  messages,
  loading,
  error,
  setMessage,
  message,
  selectedUser,
  fetchMessages
}) {
  const sendMessage = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!selectedUser) {
      console.error('No user selected for sending a message');
      return;
    }

    try {
      const response = await fetch('https://chatwithme-t7jo.onrender.com/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiver: selectedUser,
          content: message,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setMessage('');
      fetchMessages(selectedUser);
    } catch (error) {
      console.error('Error sending message:', error);
      alert(error.message);
    }
  };

  return (
    <div className="message-section">
      <h1>{selectedUserName || 'Select a user'}</h1>
      <div className="messages-container">
        {loading && <p className="loading-message">Loading messages...</p>}
        {error && <p className="error-message">{error}</p>}
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender._id === localStorage.getItem('userId') ? 'current-user-message' : 'receiver-message'}`}>
            <strong>{msg.sender.name || 'Unknown Sender'}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <form className="message-input-container" onSubmit={sendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          required
          className="message-input"
        />
        <button type="submit" className="send-button">Send</button>
      </form>
    </div>
  );
}

export default MessageSection;
