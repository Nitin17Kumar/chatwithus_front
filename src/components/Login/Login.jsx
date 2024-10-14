import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css'; 

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(''); 
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();
  
  const changeHandler = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError(''); 
    setLoading(true); 

    try {
      const response = await fetch('https://chatwithme-t7jo.onrender.com/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json(); 
        throw new Error(errorData.message || 'Failed to log in.');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.id);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error logging in:', error);
      setError(error.message); 
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="login-container">
      
      <form onSubmit={submitHandler} className='form-login'>
      <h1>Login</h1>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={changeHandler}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={changeHandler}
          required
        />
        <button type="submit" disabled={loading} className='button-login'>Login</button>
        <br/>  
        <br/>      
        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
      
      
    </div>
  );
}

export default Login;
