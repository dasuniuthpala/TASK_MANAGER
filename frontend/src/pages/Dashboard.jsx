import React from 'react';
import { useOutletContext } from 'react-router-dom';

const Dashboard = () => {
  const { tasks, refreshTasks } = useOutletContext();

  return (
    <div className="py-4">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      <p className="text-gray-600 mt-2">Manage your tasks here.</p>
    </div>
  );
};

export default Dashboard;
