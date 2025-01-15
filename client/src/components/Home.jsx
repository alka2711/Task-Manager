import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/user/register', { name, email, password, role });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/dashboard');
    } catch (error) {
      console.error('Error registering user:', error);
      alert('Error registering user');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome to Task Manager</h1>
      <p style={styles.paragraph}>Manage your tasks efficiently and effectively.</p>
      
      <div style={styles.registerBox}>
        {/* <h2 style={styles.registerHeading}>Register</h2> */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={styles.input}
          />
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
          <button type="submit" style={styles.button}>Register</button>
        </form>
        <p style={styles.loginText}>
          Already have an account? <Link to="/login" style={styles.loginLink}>Login</Link>
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
    backgroundColor: '#f5f5f5',
    color: '#333',
  },
  heading: {
    marginBottom: '20px',
    fontSize: '2rem',
  },
  paragraph: {
    marginBottom: '20px',
    fontSize: '1.2rem',
  },
  linksContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  link: {
    margin: '0 10px',
    color: '#007bff',
    textDecoration: 'none',
  },
  registerBox: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    width: '300px',
  },
  registerHeading: {
    marginBottom: '20px',
    fontSize: '1.5rem',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
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
  loginText: {
    marginTop: '10px',
    textAlign: 'center',
  },
  loginLink: {
    color: '#007bff',
    textDecoration: 'none',
  },
};

export default Home;