import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import Analytics from './Analytics'; // Import the Analytics component
// import CreateTask from './CreateTask.jsx';
import CreateAssignTask from './CreateAssignTask.jsx';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: '',
    dueDate: '',
    assignTo: 'self',
    userIds: '',
  });
  const [showPopup, setShowPopup] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [attachment, setAttachment] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      const { data } = await axios.get('/api/task', {
        params: {
          search: searchTerm,
          sort: sortOption,
        },
      });
      setTasks(data.tasks);
    };

    fetchTasks();
  }, [searchTerm, sortOption]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (e) => {
    setSortOption(e.target.value);
  };

  const handleAddTask = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/task', newTask);
      setShowModal(false);
      // Refresh tasks after submission
      const { data } = await axios.get('/api/task', {
        params: {
          search: searchTerm,
          sort: sortOption,
        },
      });
      setTasks(data.tasks);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleOpenPopup = (task) => {
    setCurrentTask(task);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setCurrentTask(null);
    setAttachment('');
  };

  const handleSubmitTask = async () => {
    if (!currentTask) {
      console.error('No task selected');
      return;
    }

    try {
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
    <div>
      <Navbar />
      <br />
      <br />
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
        <div>
        <button onClick={handleAddTask} style={styles.addButton}>Create Task 
        </button>
        {showModal && (
          <div style={styles.modal}>
            <div style={styles.modalContent}>
          <CreateAssignTask  onClose = {handleCloseModal}/> 
          </div>
          </div>
        )}
        </div>
        <div style={styles.contentContainer}>
          <div style={styles.taskContainer}>
            <ul style={styles.taskList}>
              {tasks.map((task) => (
                <li key={task._id} style={styles.taskItem}>
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                  <p>Priority: {task.priority}</p>
                  <p>Status: {task.status}</p>
                  <p>Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>
                  {task.status !== 'sent for review' && task.status !== 'completed' && (
                    <button onClick={() => handleOpenPopup(task)} style={styles.submitButton}>
                      Submit
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div style={styles.analyticsContainer}>
            <Analytics />
          </div>
        </div>
        
           
        
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
              <button onClick={handleSubmitTask} style={styles.button}>Submit Task</button>
              <button onClick={handleClosePopup} style={styles.button}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    
  },
  heading: {
    
    marginBottom: '20px',
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
  },
  sortSelect: {
    padding: '10px',
    fontSize: '16px',
    width: '35%',
  },
  addButton: {
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#003000', // Dark green button color
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom: '20px',
  },
  contentContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  taskContainer: {
    width: '60%',
  },
  analyticsContainer: {
    width: '35%',
  },
  taskList: {
    listStyleType: 'none',
    padding: 0,
  },
  taskItem: {
    padding: '10px',
    marginBottom: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  submitButton: {
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#003000', // Dark green button color
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    marginBottom: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    marginBottom: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    height: '100px',
  },
  button: {
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#003000', // Dark green button color
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
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
    width: '400px',
  },
};

export default Dashboard;
