const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const app = express();

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/productivityDashboard', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// MongoDB Schemas
const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
    email: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const goalSchema = new mongoose.Schema({
    goal: { type: String, required: true },
    type: { type: String, enum: ['weekly', 'monthly'], required: true },
    email: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    photoUrl: { type: String }
});

const Task = mongoose.model('Task', taskSchema);
const Goal = mongoose.model('Goal', goalSchema);
const User = mongoose.model('User', userSchema);

// In-memory storage
const users = new Map();
const tasks = new Map();
const goals = new Map();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5000', 'http://127.0.0.1:5000'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Debug middleware - log all requests
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    if (req.body) console.log('Body:', req.body);
    next();
});

// Create uploads directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Auth endpoints
app.post('/register', upload.single('photo'), (req, res) => {
    try {
        const userData = JSON.parse(req.body.userData);
        const { email, password, name } = userData;

        console.log('Registering user:', { email, name });

        if (users.has(email)) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;
        users.set(email, { password, name, photoUrl });
        
        // Initialize empty arrays for tasks and goals
        if (!tasks.has(email)) {
            console.log('Initializing tasks for:', email);
            tasks.set(email, []);
        }
        
        if (!goals.has(email)) {
            console.log('Initializing goals for:', email);
            goals.set(email, []);
        }

        console.log('User registered successfully:', {
            email,
            tasksInitialized: tasks.has(email),
            goalsInitialized: goals.has(email)
        });

        res.status(201).json({
            email,
            name,
            photoUrl
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Registration failed' });
    }
});

app.post('/login', (req, res) => {
    console.log('Login attempt:', req.body);
    const { email, password } = req.body;
    const user = users.get(email);

    if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Ensure tasks and goals are initialized
    if (!tasks.has(email)) {
        console.log('Initializing tasks for user at login:', email);
        tasks.set(email, []);
    }
    
    if (!goals.has(email)) {
        console.log('Initializing goals for user at login:', email);
        goals.set(email, []);
    }

    res.json({
        email,
        name: user.name,
        photoUrl: user.photoUrl
    });
});

// Debug endpoint to check tasks
app.get('/debug/tasks', (req, res) => {
    const allTasks = {};
    tasks.forEach((value, key) => {
        allTasks[key] = value;
    });
    res.json({ tasks: allTasks });
});

// Task endpoints
app.get('/tasks', async (req, res) => {
    const { email } = req.query;
    console.log('GET /tasks - Email:', email);
    
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const tasks = await Task.find({ email }).sort({ createdAt: -1 });
        console.log('Found tasks for user:', tasks);
        res.json({ tasks });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Failed to fetch tasks', error: error.message });
    }
});

app.post('/tasks', async (req, res) => {
    try {
        console.log('POST /tasks - Request body:', req.body);
        const { email, title } = req.body;
        
        if (!email || !title) {
            console.log('Missing required fields:', { email, title });
            return res.status(400).json({ 
                message: 'Email and title are required',
                received: { email, title }
            });
        }

        const newTask = new Task({
            title,
            email,
            completed: false
        });

        const savedTask = await newTask.save();
        console.log('Task added successfully:', savedTask);
        res.status(201).json(savedTask);
    } catch (error) {
        console.error('Error adding task:', error);
        res.status(500).json({ 
            message: 'Failed to add task',
            error: error.message 
        });
    }
});

app.patch('/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { email, title, completed } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (completed !== undefined) updateData.completed = completed;

        const task = await Task.findOneAndUpdate(
            { _id: id, email },
            updateData,
            { new: true }
        );

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        console.log('Task updated:', task);
        res.json(task);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ message: 'Failed to update task', error: error.message });
    }
});

app.delete('/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const task = await Task.findOneAndDelete({ _id: id, email });
        
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        console.log('Task deleted:', task);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ message: 'Failed to delete task', error: error.message });
    }
});

// Goal endpoints
app.get('/goals', async (req, res) => {
    const { email } = req.query;
    console.log('GET /goals - Email:', email);
    
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const goals = await Goal.find({ email }).sort({ createdAt: -1 });
        console.log('Found goals for user:', goals);
        res.json({ goals });
    } catch (error) {
        console.error('Error fetching goals:', error);
        res.status(500).json({ message: 'Failed to fetch goals', error: error.message });
    }
});

app.post('/goals', async (req, res) => {
    try {
        console.log('POST /goals - Request body:', req.body);
        const { email, goal, type } = req.body;
        
        if (!email || !goal || !type) {
            console.log('Missing required fields:', { email, goal, type });
            return res.status(400).json({ 
                message: 'Email, goal and type are required',
                received: { email, goal, type }
            });
        }

        const newGoal = new Goal({
            goal,
            type,
            email
        });

        const savedGoal = await newGoal.save();
        console.log('Goal added successfully:', savedGoal);
        res.status(201).json(savedGoal);
    } catch (error) {
        console.error('Error adding goal:', error);
        res.status(500).json({ 
            message: 'Failed to add goal',
            error: error.message 
        });
    }
});

app.patch('/goals/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { email, goal, type } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const updateData = {};
        if (goal !== undefined) updateData.goal = goal;
        if (type !== undefined) updateData.type = type;

        const updatedGoal = await Goal.findOneAndUpdate(
            { _id: id, email },
            updateData,
            { new: true }
        );

        if (!updatedGoal) {
            return res.status(404).json({ message: 'Goal not found' });
        }

        console.log('Goal updated:', updatedGoal);
        res.json(updatedGoal);
    } catch (error) {
        console.error('Error updating goal:', error);
        res.status(500).json({ message: 'Failed to update goal', error: error.message });
    }
});

app.delete('/goals/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const goal = await Goal.findOneAndDelete({ _id: id, email });
        
        if (!goal) {
            return res.status(404).json({ message: 'Goal not found' });
        }

        console.log('Goal deleted:', goal);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting goal:', error);
        res.status(500).json({ message: 'Failed to delete goal', error: error.message });
    }
});

const PORT = process.env.PORT || 5000;

// Handle server startup errors
const server = app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
}).on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`⚠️ Port ${PORT} is already in use. Please try a different port or close the application using this port.`);
    } else {
        console.error('⚠️ Server error:', error);
    }
    process.exit(1);
}); 