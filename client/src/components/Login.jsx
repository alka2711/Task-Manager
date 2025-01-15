import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

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
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f5f5f5',
    color: '#333',
  },
  heading: {
    marginBottom: '20px',
    fontSize: '2rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '300px',
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
  },
  registerLink: {
    color: '#007bff',
    textDecoration: 'none',
  },
};

export default Login;