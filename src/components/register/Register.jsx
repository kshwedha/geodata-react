import './Register.css';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Register = () => {

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8080/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert('Account created successfully!');
        formData.email = "";
        formData.password = "";
        formData.username = "";
        window.location.href = '/login';
        return;
      } else {
        throw new Error('Failed to create account');
      }
    } catch (error) {
      console.error('Error creating account:', error);
      alert('Failed to create account');
    }
  };

  return (
    <div className='register-container'>
        <h1>Create User Space</h1>
    <div className='form-container register-form'>
      <form onSubmit={handleSubmit}>
      <div id='form-group'>
            <label className='form-label' htmlFor="username">
                Username
            <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            />
            </label>
        </div>
        <br />
        <div>
            <label className='form-label' htmlFor="email">
                Email
            <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            />
          </label>
        </div>
          <br />
        <div>
            <label className='form-label' htmlFor="password">
                Password
            <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            />
            </label>
        </div>
      <br />
      <button className='submit btn' type="submit">Create Account</button>
      </form>

      <div className='invalid-feedback' id='feedback'></div>
      <p className='login-link'>
      User already? <Link to='/login' style={{ color: "#80aeae" }}>login here</Link>
      </p>
      <p className='forgot-password-link'>
        <a href="/forgot-password">Forgot your password?</a>
      </p>
    </div>
    </div>
  );
};

export default Register;
