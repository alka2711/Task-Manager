import React from 'react';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, onToggleCompletion, onDelete, graphData }) => {
    return (
        <div>
            <h3>Task List</h3>
            <ul>
                {tasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
                    .map((task) => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            onToggleCompletion={onToggleCompletion}
                            onDelete={onDelete}
                        />
                    ))}
            </ul>

            <div>
                <h4>Task Completion Graph</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 20px)' }}>
                    {graphData.map((day, index) => (
                        <div
                            key={index}
                            style={{
                                width: 20,
                                height: 20,
                                backgroundColor: day.completed ? '#4caf50' : '#ccc',
                                margin: 2,
                            }}
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TaskList;
