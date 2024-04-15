import React, { useState } from 'react';
import { Link } from "react-router-dom";
import './Login.css';

const Login = () => {
    const [formData, setFormData] = useState({
        loginid: '',
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
          await fetch('http://127.0.0.1:8080/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          })
          .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
        })
          .then(data => {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userid', data.userid);
                window.location.href = '/home';
          });
        } catch (error) {
          console.error('!! Error logging in', error);
          alert('!! Error logging in');
        }
      };

    return (
        <div className='login-container'>
            <></>
            <div className='form-container register-form'>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" name="loginid" value={formData.username} onChange={handleChange} placeholder="Email" />
                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" />
                <button className='submit btn' type="submit">Login</button>
            </form>
            <br/>
            <p className="register-link">New here?
                <Link to="/" style={{ color: "#80aeae" }}>Get in</Link>
            </p>
            </div>
        </div>
    );
};

// {/* onChange={(e) => setFormData({ ...formData, username: e.target.value })} */}

export default Login;