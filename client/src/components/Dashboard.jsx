import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import Analytics from './Analytics'; // Import the Analytics component

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
    <div style={styles.container}>
      <Navbar />
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
      <button onClick={handleAddTask} style={styles.addButton}>Create Task</button>
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
                {task.status !== 'sent for review' && (
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
      {showModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3>Create Task</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={newTask.title}
                onChange={handleInputChange}
                style={styles.input}
              />
              <textarea
                name="description"
                placeholder="Description"
                value={newTask.description}
                onChange={handleInputChange}
                style={styles.textarea}
              />
              <select
                name="priority"
                value={newTask.priority}
                onChange={handleInputChange}
                style={styles.input}
              >
                <option value="" disabled>Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <input
                type="date"
                name="dueDate"
                value={newTask.dueDate}
                onChange={handleInputChange}
                style={styles.input}
              />
              <select
                name="assignTo"
                value={newTask.assignTo}
                onChange={handleInputChange}
                style={styles.input}
              >
                <option value="self">Assign to Self</option>
                <option value="others">Assign to Others</option>
              </select>
              {newTask.assignTo === 'others' && (
                <input
                  type="text"
                  name="userIds"
                  placeholder="Enter User IDs (comma separated)"
                  value={newTask.userIds}
                  onChange={handleInputChange}
                  style={styles.input}
                />
              )}
              <button type="submit" style={styles.button}>Create</button>
              <button type="button" onClick={handleCloseModal} style={styles.button}>Close</button>
            </form>
          </div>
        </div>
      )}
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
    backgroundColor: '#007bff',
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
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  modal: {
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
  modalContent: {
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
  textarea: {
    marginBottom: '10px',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    width: '100%',
    height: '100px',
  },
  button: {
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '10px',
    marginRight: '10px',
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
};

export default Dashboard;