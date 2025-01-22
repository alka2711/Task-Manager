import React, { useState, useEffect } from 'react';
import Navbar from './Navbar'; // Import the Navbar component
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Profile = () => {
  const [user, setUser] = useState({
    username: '',
    email: '',
  });
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for error handling
  const [taskStats, setTaskStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    overdueTasks: 0,
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get('/api/user/profile'); // Ensure this endpoint is correct
        console.log('User details fetched:', response.data);
        setUser({
          username: response.data.name,
          email: response.data.email,
        });
      } catch (err) {
        console.error('Error fetching user details:', err);
        setError('Failed to load user details');
      } finally {
        setLoading(false);
      }
    };

    const fetchTaskStats = async () => {
      try {
        const response = await axios.get('/api/tasks/stats'); // Ensure this endpoint is correct
        setTaskStats(response.data);
      } catch (err) {
        console.error('Error fetching task stats:', err);
      }
    };

    fetchUserDetails();
    fetchTaskStats();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get('/api/user/logout'); // Ensure this endpoint is correct
      localStorage.removeItem('userInfo');
      window.location.href = '/'; // Redirect to home or login page
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  const data = {
    labels: ['Total Tasks', 'Completed Tasks', 'In Progress', 'Overdue'],
    datasets: [
      {
        label: 'Tasks',
        data: [taskStats.totalTasks, taskStats.completedTasks, taskStats.inProgressTasks, taskStats.overdueTasks],
        backgroundColor: 'rgb(0, 51, 0)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Task Statistics',
      },
    },
  };

  return (
    <div>
      <Navbar /> {/* Include the Navbar at the top */}
      <div style={styles.container}>
        <h1 style={styles.heading}>My Profile</h1> {/* Add heading */}
        <div style={styles.boxContainer}>
          <div style={styles.box1}>
            <FontAwesomeIcon icon={faUserCircle} size="4x" style={styles.icon} />
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p style={{ color: 'red' }}>{error}</p>
            ) : (
              <div style={styles.userInfo}>
                <p style={styles.username}>{user.username}</p>
                <p style={styles.useremail}>{user.email}</p>
              </div>
            )}
            <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
          </div>
          <div style={styles.nestedBoxContainer}>
            <div style={styles.box}>
              <Bar data={data} options={options} />
            </div>
            <div style={styles.box}>
              <h2 style={styles.settingsHeading}>Settings</h2>
              <div style={styles.settingOptions}>
                <a href="/change-username" style={{ color: '#003300', textDecoration: 'none', display: 'block', margin: '10px 0' }}>
                  1. Change Username
                </a>
                <a href="/change-password" style={{ color: '#003300', textDecoration: 'none', display: 'block', margin: '10px 0' }}>
                  2. Change Password
                </a>
              </div>
              <div style={styles.settingButtons}>
                {/* Add setting buttons content here */}
              </div>
            </div>
          </div>
        </div>
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
    padding: '20px',
  },
  heading: {
    fontSize: '2rem',
    color: '#003300',
    marginBottom: '20px',
    marginTop: '5%',
  },
  boxContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '20px',
    marginTop: '20px',
  },
  nestedBoxContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  box1: {
    width: '300px',
    height: '700px',
    backgroundColor: '#f0f0f0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    fontSize: '1rem',
    color: '#003300',
    padding: '20px',
  },
  icon: {
    marginTop: '20px',
  },
  userInfo: {
    textAlign: 'center',
    marginTop: '10px', // Add margin to position below the icon
  },
  username: {
    fontSize: '1.5rem',
    margin: '10px 0',
  },
  useremail: {
    fontSize: '1rem',
    color: '#555',
  },
  logoutButton: {
    marginTop: 'auto', // Push the button to the bottom
    padding: '10px 20px',
    fontSize: '1rem',
    backgroundColor: 'rgb(0, 51, 0)',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom: '20px',
  },
  box: {
    width: '600px',
    height: '340px',
    backgroundColor: '#f0f0f0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    fontSize: '1rem',
    color: '#003300',
    padding: '20px',
  },
  settingsHeading: {
    textAlign: 'center',
    width: '100%',
  },
  settingOptions: {
    marginTop: '20px',
    padding: '10px',
    backgroundColor: '#e0e0e0',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  settingButtons: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'space-around',
  },
};

export default Profile;