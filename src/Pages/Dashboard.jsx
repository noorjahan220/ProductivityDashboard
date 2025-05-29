import React, { useEffect, useState, useCallback, useMemo, useContext } from 'react';
import { Check, Trash2, Plus, Target, Calendar, TrendingUp, CheckCircle2, LogIn, Quote, Edit, Moon, Sun, X } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useNavigate } from 'react-router-dom';
import axiosPublic from '../hooks/useAxiosPublic.jsx';
import { AuthContext } from '../Provider/AuthProvider';

const Dashboard = () => {
    const { user, logOut } = useContext(AuthContext);
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [goals, setGoals] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [newGoal, setNewGoal] = useState({ goal: '', type: 'weekly' });
    const [loading, setLoading] = useState(true);
    const [quote, setQuote] = useState({ text: '', author: '' });
    const [editingTask, setEditingTask] = useState(null);
    const [editTaskText, setEditTaskText] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [editingGoal, setEditingGoal] = useState(null);
    const [editGoalText, setEditGoalText] = useState('');
    const [editGoalType, setEditGoalType] = useState('weekly');
    const [error, setError] = useState(null);

    const completedTasks = useMemo(() => tasks.filter(task => task?.completed).length, [tasks]);
    const totalTasks = useMemo(() => tasks.length, [tasks]);
    const completionRate = useMemo(() => totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0, [completedTasks, totalTasks]);
    const weeklyGoals = useMemo(() => goals.filter(g => g?.type === 'weekly').length, [goals]);
    const monthlyGoals = useMemo(() => goals.filter(g => g?.type === 'monthly').length, [goals]);

    const fetchTasks = useCallback(async () => {
        try {
            const res = await axiosPublic.get('/tasks', {
                params: { email: user?.email }
            });
            if (res.data && Array.isArray(res.data.tasks)) {
                setTasks(res.data.tasks);
            } else {
                setTasks([]);
            }
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
            setError('Failed to load tasks. Please try again.');
            setTasks([]);
        }
    }, [user?.email]);

    const fetchGoals = useCallback(async () => {
        try {
            const res = await axiosPublic.get('/goals', {
                params: { email: user?.email }
            });
            if (res.data && Array.isArray(res.data.goals)) {
                setGoals(res.data.goals);
            } else {
                setGoals([]);
            }
        } catch (error) {
            console.error('Failed to fetch goals:', error);
            setError('Failed to load goals. Please try again.');
            setGoals([]);
        }
    }, [user?.email]);

    const fetchQuote = useCallback(async () => {
        try {
            const response = await axiosPublic.get('https://api.quotable.io/random', {
                params: { tags: 'inspirational,success,wisdom' }
            });
            if (response.data) {
                setQuote({ text: response.data.content, author: response.data.author });
            }
        } catch (error) {
            const fallbackQuotes = [
                { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
                { text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.', author: 'Winston Churchill' },
                { text: 'The future depends on what you do today.', author: 'Mahatma Gandhi' },
                { text: "Don't watch the clock; do what it does. Keep going.", author: 'Sam Levenson' },
                { text: 'Believe you can and you\'re halfway there.', author: 'Theodore Roosevelt' }
            ];
            setQuote(fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)]);
        }
    }, []);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') setIsDarkMode(true);
    }, []);

    useEffect(() => {
        if (user?.email) {
            setLoading(true);
            Promise.all([fetchTasks(), fetchGoals()])
                .then(() => fetchQuote())
                .catch(error => {
                    console.error('Error fetching data:', error);
                    setError('Failed to load data. Please refresh the page.');
                })
                .finally(() => setLoading(false));
        }
    }, [user?.email, fetchTasks, fetchGoals, fetchQuote]);

    const addTask = async () => {
        if (!newTask.trim() || !user?.email) return;
        
        try {
            const res = await axiosPublic.post('/tasks', {
                title: newTask.trim(),
                email: user.email
            });
            
            setTasks(prev => [...prev, {
                _id: res.data._id,
                title: newTask.trim(),
                completed: false,
                email: user.email
            }]);
            setNewTask('');
        } catch (error) {
            console.error('Failed to add task:', error);
            setError('Failed to add task. Please try again.');
        }
    };

    const deleteTask = async (id) => {
        try {
            await axiosPublic.delete(`/tasks/${id}`, { 
                params: { email: user?.email }
            });
            setTasks(prev => prev.filter(task => task._id !== id));
        } catch (error) {
            console.error('Failed to delete task:', error);
            setError('Failed to delete task. Please try again.');
        }
    };

    const completeTask = async (id, completed) => {
        try {
            await axiosPublic.patch(`/tasks/${id}`, { 
                email: user?.email,
                completed: !completed 
            });
            setTasks(prev => prev.map(task => 
                task._id === id ? { ...task, completed: !completed } : task
            ));
        } catch (error) {
            console.error('Failed to update task:', error);
            setError('Failed to update task. Please try again.');
        }
    };

    const saveTaskEdit = async (id) => {
        if (!editTaskText.trim()) return;
        try {
            await axiosPublic.patch(`/tasks/${id}`, { 
                email: user?.email,
                title: editTaskText.trim()
            });
            setTasks(prev => prev.map(task => 
                task._id === id ? { ...task, title: editTaskText.trim() } : task
            ));
            setEditingTask(null);
            setEditTaskText('');
        } catch (error) {
            console.error('Failed to update task:', error);
            setError('Failed to update task. Please try again.');
        }
    };

    const addGoal = async () => {
        if (!newGoal.goal.trim() || !user?.email) return;
        
        try {
            const res = await axiosPublic.post('/goals', {
                email: user.email,
                goal: newGoal.goal.trim(),
                type: newGoal.type
            });
            
            setGoals(prev => [...prev, {
                _id: res.data._id,
                goal: newGoal.goal.trim(),
                type: newGoal.type,
                email: user.email
            }]);
            setNewGoal({ goal: '', type: 'weekly' });
        } catch (error) {
            console.error('Failed to add goal:', error);
            setError('Failed to add goal. Please try again.');
        }
    };

    const deleteGoal = async (id) => {
        try {
            await axiosPublic.delete(`/goals/${id}`, {
                params: { email: user?.email }
            });
            setGoals(prev => prev.filter(goal => goal._id !== id));
        } catch (error) {
            console.error('Failed to delete goal:', error);
            setError('Failed to delete goal. Please try again.');
        }
    };

    const saveGoalEdit = async (id) => {
        if (!editGoalText.trim()) return;
        
        try {
            await axiosPublic.patch(`/goals/${id}`, { 
                email: user?.email,
                goal: editGoalText.trim(),
                type: editGoalType
            });
            setGoals(prev => prev.map(goal => 
                goal._id === id ? { ...goal, goal: editGoalText.trim(), type: editGoalType } : goal
            ));
            setEditingGoal(null);
            setEditGoalText('');
            setEditGoalType('weekly');
        } catch (error) {
            console.error('Failed to update goal:', error);
            setError('Failed to update goal. Please try again.');
        }
    };

    const toggleTheme = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        localStorage.setItem('theme', newMode ? 'dark' : 'light');
    };

    const handleLogout = async () => {
        try {
            await logOut();
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
            setError('Failed to logout. Please try again.');
        }
    };

    const onDragEnd = useCallback(async (result) => {
        if (!result.destination) return;
        
        const { source, destination, draggableId } = result;
        
        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }
        
        const newTasks = Array.from(tasks);
        const [reorderedItem] = newTasks.splice(source.index, 1);
        newTasks.splice(destination.index, 0, reorderedItem);
        
        setTasks(newTasks);
        
        try {
            await axiosPublic.patch(`/tasks/reorder`, {
                taskId: draggableId,
                newIndex: destination.index,
                email: user?.email
            });
        } catch (error) {
            console.error('Failed to update task order:', error);
            setTasks(tasks);
            setError('Failed to reorder tasks. Please try again.');
        }
    }, [tasks, user?.email]);

    if (!user) {
        navigate('/login');
        return null;
    }
    
    if (loading) return (
        <div className="min-h-screen bg-gradient-to-br from-primary-light to-primary-dark flex items-center justify-center text-white text-xl">
            Loading your dashboard...
        </div>
    );

    return (
        <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="fixed left-0 top-0 h-full w-16 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col items-center py-4 space-y-4">
                    <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        {isDarkMode ? <Sun size={24} className="text-gray-600 dark:text-gray-300" /> : <Moon size={24} className="text-gray-600 dark:text-gray-300" />}
                    </button>
                    <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mt-auto">
                        <LogIn size={24} className="text-gray-600 dark:text-gray-300" />
                    </button>
                </div>

                <div className="pl-20 pr-4 py-4">
                    <div className="max-w-7xl mx-auto">
                        {error && (
                            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
                                {error}
                                <button onClick={() => setError(null)} className="float-right">
                                    <X size={16} />
                                </button>
                            </div>
                        )}

                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Welcome back, <span className="text-primary-light">{user.email?.split('@')[0]}</span>
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">Here's your productivity overview</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold opacity-90">Tasks Progress</h3>
                                        <p className="text-3xl font-bold mt-2">{completedTasks}/{totalTasks}</p>
                                    </div>
                                    <CheckCircle2 size={32} className="opacity-80" />
                                </div>
                                <div className="bg-white/20 rounded-lg p-2 text-center text-sm font-medium">
                                    {completionRate}% Completed
                                </div>
                            </div>
                            
                            <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold opacity-90">Active Goals</h3>
                                        <p className="text-3xl font-bold mt-2">{goals.length}</p>
                                    </div>
                                    <Target size={32} className="opacity-80" />
                                </div>
                                <div className="bg-white/20 rounded-lg p-2 text-center text-sm font-medium">
                                    {weeklyGoals} Weekly · {monthlyGoals} Monthly
                                </div>
                            </div>
                            
                            <div className="card bg-gradient-to-br from-amber-500 to-amber-600 text-white">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold opacity-90">Daily Inspiration</h3>
                                    <Quote size={32} className="opacity-80" />
                                </div>
                                <p className="text-sm italic opacity-90">"{quote.text}"</p>
                                <p className="text-xs mt-2 opacity-75">— {quote.author}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="card bg-white dark:bg-gray-800 shadow-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center">
                                        <Calendar size={20} className="text-primary-light mr-3" />
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Daily Tasks</h2>
                                    </div>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">{completedTasks} of {totalTasks} done</span>
                                </div>

                                <div className="flex gap-2 mb-6">
                                    <input
                                        type="text"
                                        value={newTask}
                                        placeholder="Add a new task..."
                                        onChange={(e) => setNewTask(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && addTask()}
                                        className="input-primary flex-1"
                                    />
                                    <button onClick={addTask} className="btn-primary px-4">
                                        <Plus size={20} />
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    {tasks.length > 0 ? (
                                        <DragDropContext onDragEnd={onDragEnd}>
                                            <Droppable droppableId="taskList">
                                                {(provided) => (
                                                    <div
                                                        {...provided.droppableProps}
                                                        ref={provided.innerRef}
                                                        className="space-y-2"
                                                    >
                                                        {tasks.map((task, index) => (
                                                            <Draggable
                                                                key={task._id}
                                                                draggableId={task._id}
                                                                index={index}
                                                            >
                                                                {(provided, snapshot) => (
                                                                    <div
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                        className={`group bg-white dark:bg-gray-800 rounded-lg border-2 ${
                                                                            task.completed ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/30'
                                                                            : 'border-gray-200 dark:border-gray-700'
                                                                        } ${snapshot.isDragging ? 'shadow-lg ring-2 ring-primary-light ring-opacity-50'
                                                                            : 'hover:border-primary-light dark:hover:border-primary-light'
                                                                        } transition-all`}
                                                                    >
                                                                        <div className="flex items-center p-3 gap-3">
                                                                            <div className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                                                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                                                                    <path d="M4 4h2v2H4V4zm6 0h2v2h-2V4zM4 9h2v2H4V9zm6 0h2v2h-2V9z" />
                                                                                </svg>
                                                                            </div>
                                                                            
                                                                            <div className="flex-1 flex items-center gap-3">
                                                                                <button
                                                                                    onClick={() => completeTask(task._id, task.completed)}
                                                                                    className={`flex-none w-5 h-5 rounded-full border-2 transition-colors ${
                                                                                        task.completed ? 'bg-emerald-500 border-emerald-500'
                                                                                        : 'border-gray-300 dark:border-gray-600 hover:border-emerald-500'
                                                                                    }`}
                                                                                >
                                                                                    {task.completed && <Check size={16} className="text-white" />}
                                                                                </button>
                                                                                
                                                                                {editingTask === task._id ? (
                                                                                    <div className="flex-1 flex gap-2">
                                                                                        <input
                                                                                            type="text"
                                                                                            value={editTaskText}
                                                                                            onChange={(e) => setEditTaskText(e.target.value)}
                                                                                            className="flex-1 px-2 py-1 rounded border dark:bg-gray-700"
                                                                                            autoFocus
                                                                                        />
                                                                                        <button onClick={() => saveTaskEdit(task._id)} className="text-emerald-500">
                                                                                            <Check size={16} />
                                                                                        </button>
                                                                                        <button onClick={() => setEditingTask(null)} className="text-red-500">
                                                                                            <X size={16} />
                                                                                        </button>
                                                                                    </div>
                                                                                ) : (
                                                                                    <>
                                                                                        <span className={`flex-1 ${task.completed ? 'line-through text-gray-500' : ''}`}>
                                                                                            {task.title}
                                                                                        </span>
                                                                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                                            <button onClick={() => { setEditingTask(task._id); setEditTaskText(task.title); }} className="text-gray-500 hover:text-gray-700">
                                                                                                <Edit size={16} />
                                                                                            </button>
                                                                                            <button onClick={() => deleteTask(task._id)} className="text-red-500 hover:text-red-700">
                                                                                                <Trash2 size={16} />
                                                                                            </button>
                                                                                        </div>
                                                                                    </>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </Draggable>
                                                        ))}
                                                        {provided.placeholder}
                                                    </div>
                                                )}
                                            </Droppable>
                                        </DragDropContext>
                                    ) : (
                                        <div className="text-center p-12 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700">
                                            <Calendar size={48} className="mx-auto mb-4 text-gray-400" />
                                            <p className="text-lg text-gray-600 dark:text-gray-400">No tasks yet. Add your first task above!</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="card bg-white dark:bg-gray-800 shadow-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center">
                                        <TrendingUp size={20} className="text-purple-500 mr-3" />
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Goals</h2>
                                    </div>
                                </div>

                                <div className="flex gap-2 mb-6">
                                    <input
                                        type="text"
                                        value={newGoal.goal}
                                        placeholder="Add a new goal..."
                                        onChange={(e) => setNewGoal({ ...newGoal, goal: e.target.value })}
                                        onKeyPress={(e) => e.key === 'Enter' && addGoal()}
                                        className="input-primary flex-1"
                                    />
                                    <select
                                        value={newGoal.type}
                                        onChange={(e) => setNewGoal({ ...newGoal, type: e.target.value })}
                                        className="input-primary w-32"
                                    >
                                        <option value="weekly">Weekly</option>
                                        <option value="monthly">Monthly</option>
                                    </select>
                                    <button onClick={addGoal} className="btn-primary px-4">
                                        <Plus size={20} />
                                    </button>
                                </div>

                                <div className="max-h-[400px] overflow-y-auto">
                                    {goals.length > 0 ? (
                                        goals.map(goal => (
                                            <div key={goal._id} className="flex justify-between items-center p-4 mb-3 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-sm hover:border-primary-light dark:hover:border-primary-light transition-all">
                                                {editingGoal === goal._id ? (
                                                    <div className="flex-1 flex gap-2">
                                                        <input
                                                            type="text"
                                                            value={editGoalText}
                                                            onChange={(e) => setEditGoalText(e.target.value)}
                                                            onKeyPress={(e) => e.key === 'Enter' && saveGoalEdit(goal._id)}
                                                            className="input-primary flex-1"
                                                            autoFocus
                                                        />
                                                        <select
                                                            value={editGoalType}
                                                            onChange={(e) => setEditGoalType(e.target.value)}
                                                            className="input-primary w-32"
                                                        >
                                                            <option value="weekly">Weekly</option>
                                                            <option value="monthly">Monthly</option>
                                                        </select>
                                                        <button onClick={() => saveGoalEdit(goal._id)} className="px-3 py-1 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600">
                                                            Save
                                                        </button>
                                                        <button onClick={() => setEditingGoal(null)} className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600">
                                                            Cancel
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <span className="text-base text-gray-900 dark:text-white font-medium">
                                                            {goal.goal}
                                                            <span className="ml-2 px-2 py-1 text-sm bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 rounded-md">
                                                                {goal.type}
                                                            </span>
                                                        </span>
                                                        <div className="flex gap-1">
                                                            <button onClick={() => { setEditingGoal(goal._id); setEditGoalText(goal.goal); setEditGoalType(goal.type); }} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                                                                <Edit size={16} className="text-gray-500" />
                                                            </button>
                                                            <button onClick={() => deleteGoal(goal._id)} className="p-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30">
                                                                <Trash2 size={16} className="text-red-500" />
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center p-12 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700">
                                            <Target size={48} className="mx-auto mb-4 text-gray-400" />
                                            <p className="text-lg text-gray-600 dark:text-gray-400">No goals yet. Set your first goal above!</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;