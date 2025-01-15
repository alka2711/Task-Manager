import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [attachment, setAttachment] = useState('');

  // Fetch tasks from API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await axios.get('/api/task', {
          params: {
            search: searchTerm,
            sort: sortOption,
          },
        });
        console.log('Fetched tasks:', data.tasks); // Debug log
        setTasks(data.tasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, [searchTerm, sortOption]);

  // Handle search input
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle sort selection
  const handleSort = (e) => {
    setSortOption(e.target.value);
  };

  // Open popup for a specific task
  const handleOpenPopup = (task) => {
    console.log('Opening popup for task:', task); // Debug log
    if (!task || !task._id) {
      console.error('Task is invalid:', task);
      return;
    }
    setCurrentTask(task);
    setShowPopup(true);
  };

  // Close the popup
  const handleClosePopup = () => {
    setShowPopup(false);
    setCurrentTask(null);
    setAttachment('');
  };

  // Submit a task
  const handleSubmitTask = async () => {
    if (!currentTask || !currentTask._id) {
      console.error('Invalid task for submission:', currentTask);
      return;
    }

    try {
      console.log('Submitting task:', currentTask); // Debug log
      await axios.post(`/api/task/submit/${currentTask._id}`, {
        attachment,
        status: 'sent for review',
      });
      handleClosePopup();

      // Refresh tasks after submission
      const { data } = await axios.get('/api/task', {
        params: {
          search: searchTerm,
          sort: sortOption,
        },
      });
      setTasks(data.tasks);
    } catch (error) {
      console.error('Error submitting task:', error);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Dashboard</h2>
      <div style={styles.searchSortContainer}>
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={handleSearch}
          style={styles.searchInput}
        />
        <select value={sortOption} onChange={handleSort} style={styles.sortSelect}>
          <option value="">Sort by</option>
          <option value="priority">Priority</option>
          <option value="status">Status</option>
        </select>
      </div>
      <ul style={styles.taskList}>
        {tasks.map((task) => (
          <li key={task._id} style={styles.taskItem}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Priority: {task.priority}</p>
            <p>Status: {task.status}</p>
            {/* Only show Submit button if task status is not 'sent for review' */}
            {task.status !== 'sent for review' && (
              <button onClick={() => handleOpenPopup(task)} style={styles.submitButton}>
                Submit
              </button>
            )}
          </li>
        ))}
      </ul>
      {showPopup && (
        <div style={styles.popup}>
          <div style={styles.popupContent}>
            <h3>Submit Task</h3>
            <input
              type="text"
              placeholder="Attachment link"
              value={attachment}
              onChange={(e) => setAttachment(e.target.value)}
              style={styles.input}
            />
            <div style={styles.buttonContainer}>
              <button onClick={handleSubmitTask} style={styles.button}>Submit Task</button>
              <button onClick={handleClosePopup} style={styles.button}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#f4f4f4',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    maxWidth: '1200px',
    margin: 'auto',
  },
  heading: {
    marginBottom: '20px',
    fontSize: '28px',
    color: '#333',
  },
  searchSortContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  searchInput: {
    padding: '10px',
    fontSize: '16px',
    width: '60%',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  sortSelect: {
    padding: '10px',
    fontSize: '16px',
    width: '35%',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  taskList: {
    listStyleType: 'none',
    padding: 0,
  },
  taskItem: {
    padding: '15px',
    marginBottom: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    backgroundColor: '#fff',
    transition: 'transform 0.2s',
  },
  taskItemHover: {
    transform: 'scale(1.05)',
  },
  submitButton: {
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '10px',
    alignSelf: 'flex-end',
  },
  popup: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupContent: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    width: '300px',
    textAlign: 'center',
  },
  input: {
    marginBottom: '10px',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    width: '100%',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
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
};

export default Dashboard;
