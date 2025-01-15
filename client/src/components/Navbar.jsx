import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={styles.navbar}>
      <div style={styles.navbarBrand}>
        <Link to="/" style={styles.link}>Task Manager</Link>
      </div>
      {/* <div style={styles.navbarLinks}>
        <Link to="/login" style={styles.link}>Login</Link>
        <Link to="/register" style={styles.link}>Register</Link>
      </div> */}
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: '#333',
    color: 'white',
  },
  navbarBrand: {
    fontSize: '1.5rem',
  },
  navbarLinks: {
    display: 'flex',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    marginLeft: '1rem',
  },
  linkHover: {
    textDecoration: 'underline',
  },
};

export default Navbar;