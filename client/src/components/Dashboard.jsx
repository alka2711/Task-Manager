import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import Analytics from './Analytics'; // Import the Analytics component
import CreateAssignTask from './CreateAssignTask.jsx';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: '',
    dueDate: '',
    userEmails: '', // Change to userEmails
  });
  const [showPopup, setShowPopup] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [attachment, setAttachment] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      try {
        // Example: Fetch user details from session or API
        const user = await axios.get('/api/auth/user'); // Adjust endpoint to your backend
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
          status: statusFilter,
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
    tasks.filter((task) => !statusFilter || task.status === statusFilter)
  );

  return (
    <div>
      <Navbar />

      <div style={styles.analyticsContainer}>
          <Analytics />
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
    backgroundColor: '#f7f7f7', // Light grey background
    minHeight: '100vh',
  },
  content: {
    padding: '20px',
  },
  heading: {
    marginBottom: '20px',
    fontSize: '2rem',
    color: '#003300', // Dark green color
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
    backgroundColor: 'rgb(0, 51, 0)', // Dark green button
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom: '20px',
  },
  contentContainer: {
     // White background for content
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap', // Allows content to adjust
  },
  taskContainer: {
    
    width: '100%', // Full width on small screens
    maxWidth: '60%', // Max width for larger screens
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
  },
  analyticsContainer: {
    // marginTop: '5%',
    width: '100%', // Full width on small screens
    maxWidth: '35%', // Max width for larger screens
  },
  taskList: {
    
    listStyleType: 'none',
    padding: 0,
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
  },
  taskItem: {
    
    flex: '1 1 300px', // Fixed width for task items
    maxWidth: '300px', // Ensure task items do not exceed this width
    padding: '15px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#B2D3C2', // White background for tasks
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  submitButton: {
    
    padding: '7px',
    fontSize: '16px',
    backgroundColor: 'rgb(0, 51, 0)', // Dark green submit button
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    // marginTop: '10px',
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
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    marginBottom: '10px',
    borderRadius: '4px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    height: '100px',
  },
  button: {
    padding: '10px',
    fontSize: '16px',
    backgroundColor: 'rgb(0, 51, 0)', // Dark green button
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
    width: '350px',
    textAlign: 'center',
  },
};

export default Dashboard;