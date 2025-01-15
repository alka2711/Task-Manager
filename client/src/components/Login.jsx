import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import backgroundImage from '../assets/background.jpg'; // Adjust the path if necessary
import SimpleNavbar from './SimpleNavbar';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/user/login', { email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      alert('Invalid email or password');
    }
  };

  return (
    
    <div>
      <SimpleNavbar/>
      <div style={styles.container}>
      <h2 style={styles.heading}>Login</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Login</button>
      </form>
      <p style={styles.registerText}>
        Don't have an account? <Link to="/" style={styles.registerLink}>Register</Link>
      </p>
    </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundImage: `url(${backgroundImage})`, // Set the background image
    backgroundSize: 'cover',                   // Cover the entire container
    backgroundPosition: 'center',              // Center the image
    height: '100vh',                           // Full viewport height
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#333',                             // Text color
  },
  heading: {
    marginBottom: '20px',
    fontSize: '2rem',
    color: 'white',                            // Make the text stand out on the background
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '300px',
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Translucent white background for form
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',    // Slight shadow for better visibility
  },
  input: {
    marginBottom: '10px',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  registerText: {
    marginTop: '10px',
    textAlign: 'center',
    color: 'white',
  },
  registerLink: {
    color: '#007bff',
    textDecoration: 'none',
  },
};

export default Login;
