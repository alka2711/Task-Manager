import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SimpleNavbar from './SimpleNavbar';

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
      navigate('/login');
    } catch (error) {
      console.error('Error registering user:', error);
      alert('Error registering user');
    }
  };

  return (
    <div>
      <SimpleNavbar />
      <div style={styles.container}>
        <h1 style={styles.heading}>Welcome to Task Manager</h1>
        <p style={styles.paragraph}>Manage your tasks efficiently and effectively.</p>
        
        <div style={styles.registerBox}>
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
    </div>
  );
};

const styles = {
  container: {
    // backgroundColor: '#fff', // White background
    color: '#006400', // Dark green text color
    backgroundColor: '#f7f7f7',  // Light grey background for the whole page
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
  paragraph: {
    marginBottom: '30px',
    fontSize: '1.2rem',
    color: '#333',
  },
  registerBox: {
    backgroundColor: '#ffffff', // White background for the registration box
    padding: '40px 30px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: '350px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    marginBottom: '15px',
    padding: '15px',  // Increased padding for bigger input fields
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    transition: 'border-color 0.3s',
    width: '100%',  // Ensures input fields take up the full width of the container
  },
  button: {
    padding: '12px',
    fontSize: '16px',
    backgroundColor: '#003300',  // Darker green background for the button
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  
  loginText: {
    marginTop: '15px',
    textAlign: 'center',
    fontSize: '1rem',
    color: '#555',
  },
  loginLink: {
    color: '#2d6a4f',  // Green color for the login link
    textDecoration: 'none',
    fontWeight: 'bold',
  },
};

export default Home;
