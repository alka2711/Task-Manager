import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart } from 'react-google-charts';

const Analytics = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await axios.get('/api/task');
        setTasks(data.tasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  // Process data for the calendar chart
  const generateChartData = (dateField, eventType) => {
    const data = [['Date', 'Event Type', { role: 'tooltip', type: 'string' }]];

    tasks.forEach((task) => {
      const date = new Date(task[dateField]);
      if (date.getFullYear() === 2025) {
        data.push([date, eventType, task.title]);
      }
    });

    return data;
  };

  const assignedAtData = generateChartData('createdAt', 1);
  const dueAtData = generateChartData('dueDate', 2);

  const combinedData = [
    ['Date', 'Event Type', { role: 'tooltip', type: 'string' }],
    ...assignedAtData.slice(1), // Remove header row
    ...dueAtData.slice(1), // Remove header row
  ];

  const chartOptions = {
    title: 'Task Calendar for 2025',
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
    colorAxis: {
      colors: ['#34c759', '#ff3b30'], // Green for createdAt, Red for dueDate
      minValue: 1,
      maxValue: 2,
    },
    tooltip: { isHtml: true },
  };

  // Data for the pie chart
  const pendingCount = tasks.filter(task => task.status === 'pending').length;
  const completedCount = tasks.filter(task => task.status === 'completed').length;
  const reviewCount = tasks.filter(task => task.status === 'sent for review').length;

  const pieData = [
    ['Task Status', 'Count'],
    ['Pending', pendingCount],
    ['Completed', completedCount],
    ['Sent for Review', reviewCount],
  ];

  const pieOptions = {
    title: 'Task Completion Status',
    pieHole: 0.4,
    slices: [
      { color: '#ffce56' }, // Yellow for pending
      { color: '#34c759' }, // Green for completed
      { color: '#ff3b30' }, // Red for sent for review
    ],
  };

  return (
    <div>
      <h2>Task Calendar for 2025</h2>
      <Chart
        chartType="Calendar"
        width="100%"
        height="400px"
        data={combinedData}
        options={chartOptions}
      />
      <h2>Task Completion Status</h2>
      <Chart
        chartType="PieChart"
        width="100%"
        height="400px"
        data={pieData}
        options={pieOptions}
      />
    </div>
  );
};

export default Analytics;