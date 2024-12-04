import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleBack = () => {
    navigate('/'); // Navigate back to the Home page
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate password
    const { password } = formData;
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setError("Password must contain at least one uppercase letter.");
      return;
    }
    if (!/[a-z]/.test(password)) {
      setError("Password must contain at least one lowercase letter.");
      return;
    }
    if (!/[0-9]/.test(password)) {
      setError("Password must contain at least one number.");
      return;
    }
    if (!/[!@#$%^&*]/.test(password)) {
      setError("Password must contain at least one special character (!@#$%^&*).");
      return;
    }
  
    try {
      // Sending the form data to backend for signup
      const response = await axios.post('http://localhost:5555/api/auth/register', formData);
  
      // On success, redirect to login page
      if (response.status === 201) {
        navigate('/login');
      }
    } catch (err) {
      // Handle any errors (like email already registered)
      setError(err.response ? err.response.data.message : 'Something went wrong');
    }
  };
  

  return (
    <div>
    <div className="flex justify-start mb-8">
        <button
          onClick={handleBack}
          className="px-4 py-2 border rounded-md bg-gray-600 text-white"
        >
          Back
        </button>
      </div>
    <div style={styles.container}>
    
      <h2 style={styles.heading}>Sign Up</h2>
      {error && <div style={styles.error}>{error}</div>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>
        <button type="submit" style={styles.button}>Sign Up</button>
      </form>
      <p style={styles.footer}>
        Already have an account? <a href="/login" style={styles.link}>Log in</a>
      </p>
    </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f7f7f7',
  },
  heading: {
    color: '#333',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '300px',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  inputGroup: {
    marginBottom: '15px',
  },
  label: {
    fontSize: '14px',
    color: '#555',
    marginBottom: '5px',
  },
  input: {
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    width: '100%',
  },
  button: {
    padding: '12px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    fontSize: '16px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  buttonHover: {
    backgroundColor: '#45a049',
  },
  error: {
    color: '#ff4d4d',
    marginBottom: '15px',
    fontWeight: 'bold',
  },
  footer: {
    marginTop: '20px',
    fontSize: '14px',
    color: '#777',
  },
  link: {
    color: '#4CAF50',
    textDecoration: 'none',
  }
};

export default Signup;
