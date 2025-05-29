// src/Pages/AddTask.jsx

import React, { useState } from 'react';
import axios from 'axios';

const AddTask = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const task = { title, description };
      const res = await axios.post('http://localhost:5000/tasks', task);
      console.log('Task added:', res.data);
      setTitle('');
      setDescription('');
    } catch (err) {
      console.error('Failed to add task:', err);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add New Task</h2>
      <form onSubmit={handleAddTask} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            className="w-full border px-3 py-2 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add Task
        </button>
      </form>
    </div>
  );
};

export default AddTask;
