import React, { useState, useEffect } from 'react';
import axios from 'axios';

import ESNavbar from './ESNavbar';

const ESTasksByMe = () => {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      const { data } = await axios.get('/api/task/assignertask', {
        params: {
          search: searchTerm,
          status: statusFilter,
        },
      });
      setTasks(data.tasks);
    };

    fetchTasks();
  }, [searchTerm, statusFilter]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleOpenPopup = async (task) => {
    try {
      const { data } = await axios.get(`/api/task/${task._id}/details`);
      setCurrentTask({
        ...task,
        submitter: data.submitter,
        githubLink: data.githubLink,
        taskLink: data.taskLink,
        // attachedFiles: data.attachedFiles,
      });
      setShowPopup(true);
    } catch (error) {
      console.error('Error fetching task details:', error);
      alert('Failed to fetch task details. Please try again.');
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setCurrentTask(null);
  };

  const handleApprove = async () => {
    try {
      const updatedTask = { ...currentTask, status: 'completed' };
      await axios.get(`/api/task/${currentTask._id}/approve`, updatedTask);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === currentTask._id ? { ...task, status: 'approved' } : task
        )
      );
      handleClosePopup(); // Close the popup after approval
    } catch (error) {
      console.error('Error approving task:', error);
      alert('Failed to approve the task. Please try again.');
    }
  };

  const mapStatus = (status) => {
    switch (status) {
      case 'pending':
        return 'Assigned';
      case 'completed':
        return 'Approved';
      case 'sent for review':
        return 'Received for review';
      default:
        return status; // No change if the status doesn't match any of the cases
    }
  };

  const filteredTasks = tasks.filter(
    (task) => !statusFilter || mapStatus(task.status) === statusFilter
  );

  return (
    <div>
      <ESNavbar />
      <div style={styles.container}>
        <div style={styles.content}>
          <h2 style={styles.heading}>Tasks</h2>
          <h3>Assigned By Me</h3>

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
              <option value="Assigned">Assigned</option>
              <option value="Approved">Approved</option>
              <option value="Received for review">Received for review</option>
            </select>
          </div>

          <div style={styles.taskContainer}>
            <ul style={styles.taskList}>
              {filteredTasks.map((task) => (
                <li key={task._id} style={styles.taskItem}>
                  <h3>{task.title}</h3>
                  <p style={styles.taskDescription}>{task.description}</p>
                  <p>Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>
                  <p>Assigned On: {new Date(task.createdAt).toLocaleDateString()}</p>
                  <div style={styles.divStyles}>
                    <p style={styles.psStyles}>{mapStatus(task.status)}</p>
                  </div>

                  <div style={styles.submitStyles}>
                    {task.status === 'sent for review' && (
                      <button onClick={() => handleOpenPopup(task)} style={styles.submitButton}>
                        View
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {showPopup && (
          <div style={styles.popup}>
            <div style={styles.popupContent}>
              <h3>Submission by: {currentTask.submitter}</h3>
              {currentTask.githubLink && (
                <p>
                  <a href={currentTask.githubLink} target="_blank" rel="noopener noreferrer">
                    GitHub Link
                  </a>
                </p>
              )}
              {currentTask.taskLink && (
                <p>
                  <a href={currentTask.taskLink} target="_blank" rel="noopener noreferrer">
                    Task Link
                  </a>
                </p>
              )}
              {/* {currentTask.attachedFiles.length > 0 && ( */}
                {/* <div>
                  <h4>Attached Files:</h4>
                  <ul>
                    {currentTask.attachedFiles.map((file, index) => (
                      <li key={index}>
                        <a href={file} target="_blank" rel="noopener noreferrer">
                          File {index + 1}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )} */}
              <button onClick={handleClosePopup} style={styles.button}>
                Close
              </button>
              <button onClick={handleApprove} style={styles.button}>
                Approve
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};





const styles = {
  container: {
    // display: 'flex',
    // flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f7f7f7',
    minHeight: '100vh',
    padding: '20px',
  },
  content: {
    width: '100%',
    // maxWidth: '1000px',
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
    justifyContent: 'space-around',
    marginBottom: '20px',
    marginTop: '20px',
  },
  searchInput: {
    padding: '10px',
    fontSize: '16px',
    width: '30%',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  filterSelect: {
    padding: '10px',
    fontSize: '16px',
    width: '30%',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  taskContainer: {
    width: '100%',
    // maxWidth: '1000px',
    display: 'flex',
    // flexWrap: 'wrap',
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
  taskDescription: {
    margin: '10px',
  },
  divStyles: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '5px',
    borderRadius: '15px',
    color: 'white',
  },
  psStyles: {
    backgroundColor: 'rgba(0, 51, 0, 0.7)',
    padding: '7px',
    minWidth: '70px',
    display: 'flex',
    justifyContent: 'space-around',
    borderRadius: '15px',
    color: 'white',
  },
  submitStyles: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: '10px',
  },
  submitButton: {
    padding: '10px',
    fontSize: '16px',
    backgroundColor: 'rgb(0, 51, 0)',
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
    width: '350px',
    textAlign: 'center',
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
  },
};

export default ESTasksByMe;



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Navbar from './Navbar';
// import CreateAssignTask from './CreateAssignTask.jsx';

// const TasksByMe = () => {
//   const [tasks, setTasks] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [sortOption, setSortOption] = useState('');
//   const [statusFilter, setStatusFilter] = useState('');
 
//   const [showPopup, setShowPopup] = useState(false);
//   const [currentTask, setCurrentTask] = useState(null);
// //   const [attachment, setAttachment] = useState('');
  
//   useEffect(() => {
//     const fetchLoggedInUser = async () => {
//       try {
//         // const user = await axios.get('/api/user');
//         setLoggedInUser(user.data.email);
//       } catch (error) {
//         console.error('Error fetching logged-in user:', error);
//       }
//     };

//     fetchLoggedInUser();
//   }, []);

//   useEffect(() => {
//     const fetchTasks = async () => {
//       const { data } = await axios.get('/api/task', {
//         params: {
//           search: searchTerm,
//         //   sort: sortOption,
//           status: statusFilter,
//         },
//       });
//       setTasks(data.tasks);
//     };

//     fetchTasks();
//   }, [searchTerm, statusFilter]);

//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value);
//   };


//   const handleStatusFilter = (e) => {
//     setStatusFilter(e.target.value);
//   };

//   const handleOpenPopup = (task) => {
//     setCurrentTask(task);
//     setShowPopup(true);
//   };

//   const handleClosePopup = () => {
//     setShowPopup(false);
//     setCurrentTask(null);
//     setAttachment('');
//   };

//   const handleSubmitTask = async () => {
//     if (!currentTask) {
//       console.error('No task selected');
//       return;
//     }

//   };

//   const sortTasks = (tasks) => {
//     if (sortOption === 'priority') {
//       return tasks.sort((a, b) => {
//         const priorityOrder = { High: 1, Medium: 2, Low: 3 };
//         return priorityOrder[a.priority] - priorityOrder[b.priority];
//       });
//     } else if (sortOption === 'dueDate') {
//       return tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
//     }
//     return tasks;
//   };

//   const filteredAndSortedTasks = sortTasks(
//     tasks
//       .filter((task) => !statusFilter || task.status === statusFilter)
//   );

//   return (
//     <div>
//       <Navbar />
//       <div style={styles.container}>
//         <div style={styles.content}>
//           <h2 style={styles.heading}>Tasks</h2>
//           <h3 >Assigned by Me</h3>
//           <div style={styles.searchSortContainer}>
//             <input
//               type="text"
//               placeholder="Search tasks..."
//               value={searchTerm}
//               onChange={handleSearch}
//               style={styles.searchInput}
//             />
//             <select value={statusFilter} onChange={handleStatusFilter} style={styles.filterSelect}>
//               <option value="">Filter by Status</option>
//               <option value="assigned">Assigned</option>
//               <option value="waiting for approval">Waiting for Approval</option>
//               <option value="approves">Approved</option>
//             </select>
           
//           </div>
           
//           <div style={styles.contentContainer}>
//             <div style={styles.taskContainer}>
//               <ul style={styles.taskList}>
//                 {filteredAndSortedTasks.map((task) => (
//                     console.log(task),
//                   <li key={task._id} style={styles.taskItem}>
//                     <h3>{task.title}</h3>
//                     <p style={styles.taskDescription}>{task.description}</p>
//                     <p>Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>
//                     <p>Assigned On: {new Date(task.createdAt).toLocaleDateString()}</p>

//                     <div style={styles.divStyles}>
//                       {/* <p style={styles.psStyles} >{task.priority}</p> */}
//                     <p style={styles.psStyles}> {task.status}</p>
//                     </div>
//                     {task.status !== 'approved' && task.status !== 'assigned' && (
                     
//                      <div style={styles.submitStyles}>
//                       <button onClick={() => handleOpenPopup(task)} style={styles.submitButton}>
//                         View
//                       </button>
//                      </div>
                     
//                     )}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//           {showPopup && (
//             <div style={styles.popup}>
//               <div style={styles.popupContent}>
//                 <h3>Submission by : ${}</h3>
//                 <div>
//                     attached files : {currentTask.attachment}
//                 </div>
//                 <button onClick={handleSubmitTask} style={styles.button}>Approve</button>
//                 <button onClick={handleClosePopup} style={styles.button}>Close</button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// const styles = {

//   divStyles: {
//     // backgroundColor: '#003300',
//     padding: '5px',
//     // width: '65px',
//     display: 'flex',
//     justifyContent: 'space-around',
//     borderRadius: '15px',
//     color: 'white', // Light grey background
//   },
//   submitStyles: {
//     display: 'flex',
//     justifyContent: 'space-around',
//     // marginTop: '10px',
//   },
//   psStyles: {
//     backgroundColor: 'rgba(0, 51, 0, 0.7)',
//     padding: '7px',
//     minWidth: '70px',
//     // width: '65px',
//     display: 'flex',
//     justifyContent: 'space-around',
//     borderRadius: '15px',
//     color: 'white', 
//   },
//   taskDescription: {
//     margin: '10px',
//   },
//   container: {
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#f7f7f7',
//     minHeight: '100vh',
//     padding: '20px',
//   },
//   content: {
//     width: '100%',
//     maxWidth: '1000px',
//     textAlign: 'center',
//   },
//   heading: {
//     marginTop: '5%',
//     marginBottom: '20px',
//     fontSize: '2rem',
//     color: '#003300',
//     fontWeight: 'bold',
//   },
//   searchSortContainer: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     marginBottom: '20px',
//     marginTop: '20px',
//   },
//   searchInput: {
//     padding: '10px',
//     fontSize: '16px',
//     width: '40%',
//     borderRadius: '5px',
//     border: '1px solid #ccc',
//   },
//   filterSelect: {
//     padding: '10px',
//     fontSize: '16px',
//     width: '25%',
//     borderRadius: '5px',
//     border: '1px solid #ccc',
//   },
//   sortSelect: {
//     padding: '10px',
//     fontSize: '16px',
//     width: '25%',
//     borderRadius: '5px',
//     border: '1px solid #ccc',
//   },
//   addButton: {
//     padding: '10px',
//     fontSize: '16px',
//     backgroundColor: 'rgb(0, 51, 0)',
//     color: 'white',
//     border: 'none',
//     borderRadius: '4px',
//     cursor: 'pointer',
//     marginBottom: '20px',
//   },
//   contentContainer: {
//     display: 'flex',
//     justifyContent: 'center',
//     flexWrap: 'wrap',
//   },
//   taskContainer: {
//     width: '100%',
//     maxWidth: '1000px',
//     display: 'flex',
//     flexWrap: 'wrap',
//     gap: '20px',
//     justifyContent: 'center',
//   },
//   taskList: {
//     listStyleType: 'none',
//     padding: 0,
//     display: 'flex',
//     flexWrap: 'wrap',
//     gap: '20px',
//     justifyContent: 'center',
//   },
//   taskItem: {
//     flex: '1 1 400px',
//     maxWidth: '400px',
//     padding: '15px',
//     border: '1px solid #ccc',
//     borderRadius: '8px',
//     backgroundColor: '#fff',
//     boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
//     textAlign: 'left',
//   },
//   submitButton: {
//     padding: '10px',
//     fontSize: '16px',
//     backgroundColor: 'rgb(0, 51, 0)',
//     color: 'white',
//     border: 'none',
//     borderRadius: '4px',
//     cursor: 'pointer',
//     marginTop: '10px',
//   },
//   modal: {
//     position: 'fixed',
//     top: 0,
//     left: 0,
//     width: '100%',
//     height: '100%',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     padding: '20px',
//     borderRadius: '8px',
//     width: '350px',
//     textAlign: 'center',
//   },
//   input: {
//     width: '100%',
//     padding: '10px',
//     fontSize: '16px',
//     marginBottom: '10px',
//     borderRadius: '4px',
//     border: '1px solid #ccc',
//   },
//   textarea: {
//     width: '100%',
//     padding: '10px',
//     fontSize: '16px',
//     marginBottom: '10px',
//     borderRadius: '4px',
//     border: '1px solid #ccc',
//     height: '100px',
//   },
//   button: {
//     padding: '10px',
//     fontSize: '16px',
//     backgroundColor: 'rgb(0, 51, 0)',
//     color: 'white',
//     border: 'none',
//     borderRadius: '4px',
//     cursor: 'pointer',
//     marginTop: '10px',
//     marginRight: '20px',
//   },
//   popup: {
//     position: 'fixed',
//     top: 0,
//     left: 0,
//     width: '100%',
//     height: '100%',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   popupContent: {
//     backgroundColor: 'white',
//     padding: '20px',
//     borderRadius: '8px',
//     width: '350px',
//     textAlign: 'center',
//   },
// };

// export default TasksByMe;