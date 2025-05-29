import React from 'react';

const StatsCard = ({ title, value, icon: Icon, gradient, description }) => {
    return (
        <div className={`p-4 rounded-lg ${gradient} text-white`}>
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <p className="text-2xl font-bold">{value}</p>
                    {description && (
                        <p className="mt-1 text-sm opacity-90">{description}</p>
                    )}
                </div>
                {Icon && (
                    <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                        <Icon size={24} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatsCard; 