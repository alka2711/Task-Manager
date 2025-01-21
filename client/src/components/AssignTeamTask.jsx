import React, { useState } from 'react';
import axios from 'axios';

const AssignTeamTask = ({ selectedTeam, onClose }) => {
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: '',
    dueDate: '',
    teamName: selectedTeam ? selectedTeam.name : '', // Store team name instead of userEmails
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/task/teamAssign', newTask);
      console.log(response.data);
      // Handle success (e.g., show a success message, clear the form, etc.)
      onClose(); // Close the popup on success
    } catch (error) {
      console.error(error);
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <div style={styles.modal}>
      <div style={styles.modalContent}>
        <h3>Assign Task</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={newTask.title}
            onChange={handleInputChange}
            style={styles.input}
          />
          <br />
          <textarea
            name="description"
            placeholder="Description"
            value={newTask.description}
            onChange={handleInputChange}
            style={styles.textarea}
          />
          <br />
          <select
            name="priority"
            value={newTask.priority}
            onChange={handleInputChange}
            style={styles.input}
          >
            <option value="">Select Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <br />
          <input
            type="date"
            name="dueDate"
            value={newTask.dueDate}
            onChange={handleInputChange}
            style={styles.input}
          />
          <br />
          
          <br />
          <button type="submit" style={styles.button}>Assign</button>
          <button type="button" onClick={onClose} style={styles.button}>Close</button>
        </form>
      </div>
    </div>
  );
};

const styles = {
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
    width: '400px',
  },
  input: {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '4px',
    border: '1px solid #ccc',
    height: '100px',
  },
  button: {
    padding: '10px 20px',
    margin: '10px 5px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#003300',
    color: 'white',
    cursor: 'pointer',
  },
};

export default AssignTeamTask;
