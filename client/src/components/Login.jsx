import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
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
      <SimpleNavbar />
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
    backgroundColor: '#f7f7f7',  // Light grey background
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    marginBottom: '20px',
    fontSize: '2.5rem',
    color: '#003300',  // Green color for heading
    fontWeight: 'bold',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '350px',
    backgroundColor: '#ffffff',  // White background for form
    padding: '40px 30px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  input: {
    marginBottom: '15px',
    padding: '15px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    width: '100%',  // Full width input
  },
  button: {
    padding: '12px',
    fontSize: '16px',
    backgroundColor: '#003300',  // Green background for the button
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  
  registerText: {
    marginTop: '15px',
    textAlign: 'center',
    fontSize: '1rem',
    color: '#555',
  },
  registerLink: {
    color: '#2d6a4f',  // Green color for the register link
    textDecoration: 'none',
    fontWeight: 'bold',
  },
};

export default Login;
