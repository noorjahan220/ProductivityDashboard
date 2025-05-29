import React from 'react';
import { Trash2, Edit, Check, X } from 'lucide-react';

const GoalList = ({
    goals,
    editingGoal,
    editGoalText,
    editGoalType,
    onEditGoal,
    onSaveEdit,
    onCancelEdit,
    onEditTextChange,
    onEditTypeChange,
    onDeleteGoal
}) => {
    const renderGoalItem = (goal) => (
        <div
            key={goal._id}
            className="flex items-center justify-between p-3 mb-2 bg-white rounded-lg dark:bg-gray-800"
        >
            {editingGoal === goal._id ? (
                <div className="flex items-center flex-1 space-x-2">
                    <input
                        type="text"
                        value={editGoalText}
                        onChange={(e) => onEditTextChange(e.target.value)}
                        className="flex-1 p-1 border rounded dark:bg-gray-700 dark:text-white"
                        autoFocus
                    />
                    <select
                        value={editGoalType}
                        onChange={(e) => onEditTypeChange(e.target.value)}
                        className="p-1 border rounded dark:bg-gray-700 dark:text-white"
                    >
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                    </select>
                    <button
                        onClick={() => onSaveEdit(goal._id)}
                        className="p-1 text-green-600 hover:text-green-800"
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
                    <div className="flex-1">
                        <p>{goal.goal}</p>
                        <p className="text-sm text-gray-500 capitalize">{goal.type}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => onEditGoal(goal._id, goal.goal, goal.type)}
                            className="p-1 text-blue-600 hover:text-blue-800"
                        >
                            <Edit size={20} />
                        </button>
                        <button
                            onClick={() => onDeleteGoal(goal._id)}
                            className="p-1 text-red-600 hover:text-red-800"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                </>
            )}
        </div>
    );

    return (
        <div className="mt-4">
            {goals.map(renderGoalItem)}
        </div>
    );
};

export default GoalList; 