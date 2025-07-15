import React, { useState } from 'react'
import { layoutClasses } from '../assets/dummy'
import { ListChecks } from 'lucide-react'
import { useOutletContext } from 'react-router-dom'

const API_BASE = 'http://localhost:4000/api/tasks'

const PendingPage = () => {
  const { tasks = [], refreshTasks } = useOutletContext();
  const [sortBy, setSortBy] = useState('newest');
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const getHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error("No auth token found");
  return { 'Content-Type' : 'application/json', Authorization: `Bearer ${token}` };
  };

  return (
    <div className={layoutClasses.container}>
      <div className={layoutClasses.headerWrapper}>
        <div>
          <h1 className='text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2'>
            <ListChecks className='text-purple-500' /> Pending Task
          </h1>
          <p className='text-sm text-gray-500 mt-1 ml-7'>
            {sortBy}
          </p>
        </div>
      </div>
    </div>
  )
}

export default PendingPage

