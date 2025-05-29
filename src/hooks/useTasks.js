import { useState, useCallback } from 'react';
import axiosPublic from './useAxiosPublic';

const useTasks = (userEmail) => {
    const [tasks, setTasks] = useState([]);
    const [editingTask, setEditingTask] = useState(null);
    const [editTaskText, setEditTaskText] = useState('');

    const fetchTasks = useCallback(async () => {
        try {
            const res = await axiosPublic.get('/tasks', {
                params: { email: userEmail },
                headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' }
            });
            setTasks(res.data?.tasks || []);
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
            setTasks([]);
        }
    }, [userEmail]);

    const addTask = async (newTaskText) => {
        if (!newTaskText.trim() || !userEmail) return;
        
        const newTaskData = {
            _id: Date.now().toString(),
            title: newTaskText,
            completed: false,
            email: userEmail
        };
        
        setTasks(prev => [...prev, newTaskData]);
        
        try {
            const res = await axiosPublic.post('/tasks', newTaskData);
            setTasks(prev => prev.map(task => task._id === newTaskData._id ? res.data : task));
        } catch (error) {
            console.error('Failed to add task:', error);
            setTasks(prev => prev.filter(task => task._id !== newTaskData._id));
            throw new Error('Failed to add task. Please try again.');
        }
    };

    const deleteTask = async (id) => {
        try {
            await axiosPublic.delete(`/tasks/${id}`, { params: { email: userEmail } });
            setTasks(tasks.filter(task => task._id !== id));
        } catch (error) {
            console.error('Failed to delete task:', error);
            throw new Error('Failed to delete task. Please try again.');
        }
    };

    const completeTask = async (id, completed) => {
        setTasks(prev => prev.map(task => task._id === id ? { ...task, completed: !completed } : task));
        
        try {
            await axiosPublic.patch(`/tasks/${id}`, { completed: !completed, email: userEmail });
        } catch (error) {
            console.error('Failed to update task:', error);
            setTasks(prev => prev.map(task => task._id === id ? { ...task, completed: completed } : task));
            throw new Error('Failed to update task. Please try again.');
        }
    };

    const editTask = (id, title) => {
        setEditingTask(id);
        setEditTaskText(title);
    };

    const saveTaskEdit = async (id) => {
        if (!editTaskText.trim()) return;
        try {
            await axiosPublic.patch(`/tasks/${id}`, { title: editTaskText.trim(), email: userEmail });
            setTasks(tasks.map(task => task._id === id ? { ...task, title: editTaskText.trim() } : task));
            setEditingTask(null);
            setEditTaskText('');
        } catch (error) {
            console.error('Failed to update task:', error);
            throw new Error('Failed to update task. Please try again.');
        }
    };

    const cancelTaskEdit = () => {
        setEditingTask(null);
        setEditTaskText('');
    };

    return {
        tasks,
        editingTask,
        editTaskText,
        fetchTasks,
        addTask,
        deleteTask,
        completeTask,
        editTask,
        saveTaskEdit,
        cancelTaskEdit,
        setEditTaskText
    };
};

export default useTasks; 