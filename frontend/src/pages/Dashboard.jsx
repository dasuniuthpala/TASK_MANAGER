import React, { useState } from 'react';
import { ADD_BUTTON, HEADER, WRAPPER } from '../assets/dummy';
import { Home as HomeIcon, Plus } from 'lucide-react';

const API_BASE ='http:localhost:4000/api/tasks'

const Dashboard = () => {
  
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectTask] = useState(null);
  const [filter, setFilter] = useState('all');

  return (
    <div className={WRAPPER}>
      <div className={HEADER}>
        <div className='min-w-0'>
          <h1 className="text-xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
            <HomeIcon className="text-purple-500 w-5 h-5 md:w-6 md:h-6 shrink-0" />
            <span className="truncate">Task Overview</span>
          </h1>
          <p className="text-gray-500 mt-1 ml-7 truncate">Manage your tasks efficiently.</p>
        </div>
        <button onClick={() => setShowModal(true)} className={ADD_BUTTON}>
          <Plus size={18} />
          Add New Task
        </button>
        
      </div>
      
    </div>
  );
};

export default Dashboard;
