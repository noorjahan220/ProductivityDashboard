import React from 'react';

const Dashboard = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">Welcome to your Dashboard</h2>
      <p>This is a protected route. Only logged-in users can access this.</p>
    </div>
  );
};

export default Dashboard;
