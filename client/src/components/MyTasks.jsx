import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const { data } = await axios.get('/api/task');
      setTasks(data.tasks);
    };

    fetchTasks();
  }, []);

  return (
    <div>
      <h1>My Tasks</h1>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>{task.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default MyTasks;