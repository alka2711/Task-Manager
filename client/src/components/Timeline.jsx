import React, { useState, useEffect } from 'react';
import { Chart } from 'react-google-charts';

const Timeline = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/tasks'); // Adjust the API endpoint as necessary
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Process data for the calendar chart
  const generateChartData = () => {
    const data = [['Date', 'Event Type']];

    tasks.forEach((task) => {
      if (task.createdAt) {
        data.push([new Date(task.createdAt), 1]); // 1 indicates "Created Date"
      }
      if (task.dueDate) {
        data.push([new Date(task.dueDate), 2]); // 2 indicates "Due Date"
      }
    });

    return data;
  };

  const chartOptions = {
    title: 'Task Calendar',
    calendar: {
      cellSize: 10,
      yearLabel: {
        fontName: 'Times-Roman',
        fontSize: 32,
        color: '#1A8763',
        bold: true,
        italic: true,
      },
      monthLabel: {
        fontName: 'Times-Roman',
        fontSize: 12,
        color: '#981b48',
        bold: true,
        italic: true,
      },
      dayOfWeekLabel: {
        fontName: 'Times-Roman',
        fontSize: 12,
        color: '#981b48',
        bold: true,
        italic: true,
      },
    },
  };

  return (
    <div>
      <h2>Task Timeline</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Chart
          chartType="Calendar"
          width="100%"
          height="400px"
          data={generateChartData()}
          options={chartOptions}
        />
      )}
    </div>
  );
};

export default Timeline;