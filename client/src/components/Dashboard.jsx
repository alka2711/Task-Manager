import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [showModal, setShowModal] = useState(false); // Track if modal is visible
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: '',
    dueDate: '',
    assignTo: 'self', // default value
    userId: '', // Store user ID when a user is selected
  });

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
    setShowModal(true); // Show the modal
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close the modal
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can add code to submit the task here, e.g., sending a POST request to the API
    console.log('New Task Submitted:', newTask);
    setShowModal(false); // Close modal after submit
  };

  return (
    <div>
      <Navbar />
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
          <button onClick={handleAddTask} style={styles.addButton}>Create Task</button>
        </div>
        <ul style={styles.taskList}>
          {tasks.map((task) => (
            <li key={task._id} style={styles.taskItem}>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p>Priority: {task.priority}</p>
              <p>Status: {task.status}</p>
            </li>
          ))}
        </ul>
        {showModal && (
          <div style={styles.modal}>
            <div style={styles.modalContent}>
              <span style={styles.closeModal} onClick={handleCloseModal}>&times;</span>
              <h3>Add New Task</h3>
              <form onSubmit={handleSubmit}>
                <label>
                  Title:
                  <input
                    type="text"
                    name="title"
                    value={newTask.title}
                    onChange={handleInputChange}
                    required
                    style={styles.input}
                  />
                </label>
                <label>
                  Description:
                  <textarea
                    name="description"
                    value={newTask.description}
                    onChange={handleInputChange}
                    required
                    style={styles.input}
                  />
                </label>
                <label>
                  Priority:
                  <select
                    name="priority"
                    value={newTask.priority}
                    onChange={handleInputChange}
                    required
                    style={styles.input}
                  >
                    <option value="">Select priority</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </label>
                <label>
                  Due Date:
                  <input
                    type="date"
                    name="dueDate"
                    value={newTask.dueDate}
                    onChange={handleInputChange}
                    required
                    style={styles.input}
                  />
                </label>
                <label>
                  Assign To:
                  <select
                    name="assignTo"
                    value={newTask.assignTo}
                    onChange={handleInputChange}
                    required
                    style={styles.input}
                  >
                    <option value="self">Self</option>
                    <option value="user">User(s)</option>
                  </select>
                </label>

                {newTask.assignTo === 'user' && (
                  <label>
                    User ID:
                    <input
                      type="text"
                      name="userId"
                      value={newTask.userId}
                      onChange={handleInputChange}
                      required
                      style={styles.input}
                      placeholder="Enter User ID"
                    />
                  </label>
                )}

                <button type="submit" style={styles.submitButton}>Submit</button>
              </form>
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
    padding: '10px 15px',
    fontSize: '16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
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
  modal: {
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '4px',
    width: '400px',
  },
  closeModal: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    fontSize: '30px',
    cursor: 'pointer',
  },
  input: {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    fontSize: '16px',
  },
  submitButton: {
    padding: '10px 15px',
    fontSize: '16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default Dashboard;
