import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Login = () => {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    try {
      console.log('Email:', email);
      console.log('Password:', password);
      const response = await axios.post('http://localhost:5555/api/auth/login', { email, password });
      console.log("Login response:", response);
      localStorage.setItem('token', response.data.token); // Store the token
      // Redirect or update UI after successful login
      window.location.href = '/';  // Or use React Router's `useHistory` to navigate
    } catch (err) {
      console.error("Login error:", err.response);
      setError(err.response?.data?.message || 'Invalid credentials');
    }
  };
  const handleBack = () => {
    console.log("Navigating back to homepage...");
    navigate('/');
  };
  
  return (
<div>
          {/* Back button */}
          <div className="flex justify-start mb-8">
          <button
            onClick={handleBack}
            className="px-4 py-2 border rounded-md bg-gray-600 text-white"
          >
            Back
          </button>
        </div>
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Login</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account? 
            <a href="/signup" className="text-blue-500 hover:text-blue-700">Sign up</a>
          </p>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Login;
