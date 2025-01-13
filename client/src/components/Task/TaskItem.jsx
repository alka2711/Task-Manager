import React from 'react';

const TaskItem = ({ task, onToggleCompletion, onDelete }) => {
    return (
        <li>
            <span>
                <strong>{task.title}</strong> - {task.assignee} - Due: {task.deadline}
            </span>
            <button onClick={() => onToggleCompletion(task.id)}>
                {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
            </button>
            <button onClick={() => onDelete(task.id)}>Delete</button>
        </li>
    );
};

export default TaskItem;
