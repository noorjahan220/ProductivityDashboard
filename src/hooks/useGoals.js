import { useState, useCallback } from 'react';
import axiosPublic from './useAxiosPublic';

const useGoals = (userEmail) => {
    const [goals, setGoals] = useState([]);
    const [editingGoal, setEditingGoal] = useState(null);
    const [editGoalText, setEditGoalText] = useState('');
    const [editGoalType, setEditGoalType] = useState('weekly');

    const fetchGoals = useCallback(async () => {
        try {
            const res = await axiosPublic.get('/goals', {
                params: { email: userEmail },
                headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' }
            });
            setGoals(res.data?.goals || []);
        } catch (error) {
            console.error('Failed to fetch goals:', error);
            setGoals([]);
        }
    }, [userEmail]);

    const addGoal = async (goalText, goalType) => {
        if (!goalText.trim() || !userEmail) return;
        try {
            const res = await axiosPublic.post('/goals', { 
                email: userEmail, 
                goal: goalText,
                type: goalType 
            });
            setGoals([...goals, res.data]);
        } catch (error) {
            console.error('Failed to add goal:', error);
            throw new Error('Failed to add goal. Please try again.');
        }
    };

    const deleteGoal = async (id) => {
        try {
            await axiosPublic.delete(`/goals/${id}`);
            setGoals(goals.filter(goal => goal._id !== id));
        } catch (error) {
            console.error('Failed to delete goal:', error);
            throw new Error('Failed to delete goal. Please try again.');
        }
    };

    const editGoal = (id, goal, type) => {
        setEditingGoal(id);
        setEditGoalText(goal);
        setEditGoalType(type);
    };

    const saveGoalEdit = async (id) => {
        if (!editGoalText.trim()) return;
        
        try {
            await axiosPublic.patch(`/goals/${id}`, { 
                goal: editGoalText.trim(), 
                type: editGoalType 
            });
            setGoals(prev => prev.map(goal => 
                goal._id === id 
                    ? { ...goal, goal: editGoalText.trim(), type: editGoalType } 
                    : goal
            ));
            cancelGoalEdit();
        } catch (error) {
            console.error('Failed to update goal:', error);
            throw new Error('Failed to update goal. Please try again.');
        }
    };

    const cancelGoalEdit = () => {
        setEditingGoal(null);
        setEditGoalText('');
        setEditGoalType('weekly');
    };

    return {
        goals,
        editingGoal,
        editGoalText,
        editGoalType,
        fetchGoals,
        addGoal,
        deleteGoal,
        editGoal,
        saveGoalEdit,
        cancelGoalEdit,
        setEditGoalText,
        setEditGoalType
    };
};

export default useGoals; 