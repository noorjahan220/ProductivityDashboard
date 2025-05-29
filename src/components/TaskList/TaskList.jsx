import React from 'react';
import { Check, Trash2, Edit, X } from 'lucide-react';
import { Draggable } from 'react-beautiful-dnd';

const TaskList = ({ 
    tasks, 
    editingTask, 
    editTaskText, 
    onEditTask, 
    onSaveEdit, 
    onCancelEdit, 
    onEditTextChange, 
    onDeleteTask, 
    onCompleteTask 
}) => {
    const renderTaskItem = (task, index) => (
        <Draggable key={task._id} draggableId={task._id} index={index}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`flex items-center justify-between p-3 mb-2 rounded-lg ${
                        task.completed ? 'bg-green-100 dark:bg-green-900' : 'bg-white dark:bg-gray-800'
                    }`}
                >
                    {editingTask === task._id ? (
                        <div className="flex items-center flex-1">
                            <input
                                type="text"
                                value={editTaskText}
                                onChange={(e) => onEditTextChange(e.target.value)}
                                className="flex-1 p-1 mr-2 border rounded dark:bg-gray-700 dark:text-white"
                                autoFocus
                            />
                            <button
                                onClick={() => onSaveEdit(task._id)}
                                className="p-1 mr-1 text-green-600 hover:text-green-800"
                            >
                                <Check size={20} />
                            </button>
                            <button
                                onClick={() => onCancelEdit()}
                                className="p-1 text-red-600 hover:text-red-800"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    ) : (
                        <>
                            <span className={`flex-1 ${task.completed ? 'line-through text-gray-500' : ''}`}>
                                {task.title}
                            </span>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => onCompleteTask(task._id, task.completed)}
                                    className={`p-1 ${
                                        task.completed
                                            ? 'text-green-600 hover:text-green-800'
                                            : 'text-gray-400 hover:text-gray-600'
                                    }`}
                                >
                                    <Check size={20} />
                                </button>
                                <button
                                    onClick={() => onEditTask(task._id, task.title)}
                                    className="p-1 text-blue-600 hover:text-blue-800"
                                >
                                    <Edit size={20} />
                                </button>
                                <button
                                    onClick={() => onDeleteTask(task._id)}
                                    className="p-1 text-red-600 hover:text-red-800"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </Draggable>
    );

    return (
        <div className="mt-4">
            {tasks.map((task, index) => renderTaskItem(task, index))}
        </div>
    );
};

export default TaskList; 