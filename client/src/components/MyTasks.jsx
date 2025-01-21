import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import CreateAssignTask from './CreateAssignTask.jsx';

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [taskTypeFilter, setTaskTypeFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: '',
    dueDate: '',
    userEmails: '',
  });
  const [showPopup, setShowPopup] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [attachment, setAttachment] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [assignee, setAssignee] = useState('self'); // New state for assignee

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      try {
        const user = await axios.get('/api/auth/user');
        setLoggedInUser(user.data.email);
      } catch (error) {
        console.error('Error fetching logged-in user:', error);
      }
    };

    fetchLoggedInUser();
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      const { data } = await axios.get('/api/task', {
        params: {
          search: searchTerm,
          sort: sortOption,
          status: statusFilter,
        },
      });
      setTasks(data.tasks);
    };

    fetchTasks();
  }, [searchTerm, sortOption, statusFilter]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (e) => {
    setSortOption(e.target.value);
  };

  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleTaskTypeFilter = (e) => {
    setTaskTypeFilter(e.target.value);
  };

  const handleAddTask = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
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
      const { data } = await axios.get('/api/task', {
        params: {
          search: searchTerm,
          sort: sortOption,
          status: statusFilter,
        },
      });
      setTasks(data.tasks);
    } catch (error) {
      console.error('Error submitting task:', error);
    }
  };

  const sortTasks = (tasks) => {
    if (sortOption === 'priority') {
      return tasks.sort((a, b) => {
        const priorityOrder = { High: 1, Medium: 2, Low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
    } else if (sortOption === 'dueDate') {
      return tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    }
    return tasks;
  };

  const filteredAndSortedTasks = sortTasks(
    tasks
      .filter((task) => !statusFilter || task.status === statusFilter)
      .filter((task) => {
        if (taskTypeFilter === 'personal') {
          return task.team.length === 1;
        } else if (taskTypeFilter === 'assigned') {
          return task.team.length > 1;
        }
        return true;
      })
  );

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.content}>
          <h2 style={styles.heading}>My Tasks</h2>
          <div style={styles.searchSortContainer}>
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={handleSearch}
              style={styles.searchInput}
            />
            <select value={statusFilter} onChange={handleStatusFilter} style={styles.filterSelect}>
              <option value="">Filter by Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="sent for review">Sent for Review</option>
            </select>
            <select value={sortOption} onChange={handleSort} style={styles.sortSelect}>
              <option value="">Sort by</option>
              <option value="priority">Priority</option>
              <option value="dueDate">Due Date</option>
            </select>
            <select value={taskTypeFilter} onChange={handleTaskTypeFilter} style={styles.filterSelect}>
              <option value="">Filter by Task Type</option>
              <option value="personal">Personal Tasks</option>
              <option value="assigned">Assigned Tasks</option>
            </select>
          </div>
          <div>
            <button onClick={handleAddTask} style={styles.addButton}>Create Task</button>
            {showModal && (
              <div style={styles.modal}>
                <div style={styles.modalContent}>
                <CreateAssignTask onClose={handleCloseModal} />
                </div>
              </div>
            )}
          </div>
          <div style={styles.contentContainer}>
            <div style={styles.taskContainer}>
              <ul style={styles.taskList}>
                {filteredAndSortedTasks.map((task) => (
                  <li key={task._id} style={styles.taskItem}>
                    <h3>{task.title}</h3>
                    <p style={styles.taskDescription}>{task.description}</p>
                    <p>Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>
                    <div style={styles.divStyles}>
                      <p style={styles.psStyles} >{task.priority}</p>
                    <p style={styles.psStyles}> {task.status}</p>
                    </div>
                    {task.status !== 'sent for review' && task.status !== 'completed' && (
                     
                     <div style={styles.submitStyles}>
                      <button onClick={() => handleOpenPopup(task)} style={styles.submitButton}>
                        Submit
                      </button>
                     </div>
                     
                    )}
                  </li>
                ))}
              </ul>
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
    </div>
  );
};

const styles = {

  divStyles: {
    // backgroundColor: '#003300',
    padding: '5px',
    // width: '65px',
    display: 'flex',
    justifyContent: 'space-around',
    borderRadius: '15px',
    color: 'white', // Light grey background
  },
  submitStyles: {
    display: 'flex',
    justifyContent: 'space-around',
    // marginTop: '10px',
  },
  psStyles: {
    backgroundColor: 'rgba(0, 51, 0, 0.7)',
    padding: '7px',
    minWidth: '70px',
    // width: '65px',
    display: 'flex',
    justifyContent: 'space-around',
    borderRadius: '15px',
    color: 'white', 
  },
  taskDescription: {
    margin: '10px',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f7f7f7',
    minHeight: '100vh',
    padding: '20px',
  },
  content: {
    width: '100%',
    maxWidth: '1000px',
    textAlign: 'center',
  },
  heading: {
    marginTop: '5%',
    marginBottom: '20px',
    fontSize: '2rem',
    color: '#003300',
    fontWeight: 'bold',
  },
  searchSortContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  searchInput: {
    padding: '10px',
    fontSize: '16px',
    width: '40%',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  filterSelect: {
    padding: '10px',
    fontSize: '16px',
    width: '25%',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  sortSelect: {
    padding: '10px',
    fontSize: '16px',
    width: '25%',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  addButton: {
    padding: '10px',
    fontSize: '16px',
    backgroundColor: 'rgb(0, 51, 0)',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom: '20px',
  },
  contentContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  taskContainer: {
    width: '100%',
    maxWidth: '1000px',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    justifyContent: 'center',
  },
  taskList: {
    listStyleType: 'none',
    padding: 0,
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    justifyContent: 'center',
  },
  taskItem: {
    flex: '1 1 400px',
    maxWidth: '400px',
    padding: '15px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'left',
  },
  submitButton: {
    padding: '10px',
    fontSize: '16px',
    backgroundColor: 'rgb(0, 51, 0)',
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
    width: '350px',
    textAlign: 'center',
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
    backgroundColor: 'rgb(0, 51, 0)',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '10px',
    marginRight: '20px',
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
    width: '350px',
    textAlign: 'center',
  },
};

export default MyTasks;