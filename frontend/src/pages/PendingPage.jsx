import React, { useState } from 'react';
import { layoutClasses, SORT_OPTIONS } from '../assets/dummy';
import { ListChecks } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import TaskItem from '../components/TaskItem';
import { Plus, Clock } from 'lucide-react';
import TaskModal from '../components/TaskModal';


const PendingPage = () => {
  const { tasks = [], refreshTasks } = useOutletContext();
  const [sortBy, setSortBy] = useState('newest');
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);

  

  const sortedPendingTasks = React.useMemo(() => {
    const filtered = tasks.filter(
      t => !t.completed || (typeof t.completed === 'string' && t.completed.toLowerCase() === 'no')
    );
    return filtered.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      const order = { high: 3, medium: 2, low: 1 };
      return order[b.priority.toLowerCase()] - order[a.priority.toLowerCase()];
    });
  }, [tasks, sortBy]);

  return (
    <div className={layoutClasses.container}>
      <div className={layoutClasses.headerWrapper}>
        <div>
          <h1 className='text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2'>
            <ListChecks className='text-purple-500' /> Pending Task
          </h1>
          <p className='text-sm text-gray-500 mt-1 ml-7'>
            {sortedPendingTasks.length} task{sortedPendingTasks.length !== 1 && 's'}{' '}
            needing your attention
          </p>
        </div>
      </div>
      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-4 md:p-6 mb-6">
        <div className="flex flex-col gap-4">
          {/* Sort bar */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="w-4 h-4 text-purple-500">🔍</span>
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            {SORT_OPTIONS.map(opt => (
              <button
                key={opt.id}
                className={layoutClasses.tabButton(sortBy === opt.id)}
                onClick={() => setSortBy(opt.id)}
              >
                {opt.icon} {opt.label}
              </button>
            ))}
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className={layoutClasses.select + ' md:hidden'}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="priority">By Priority</option>
            </select>
          </div>
          {/* Add box and tasks row */}
          <div className="flex flex-row gap-4 items-stretch">
            <div
              className="flex-1 max-w-xs min-w-[220px] border-2 border-dashed border-purple-400 rounded-xl flex items-center justify-center cursor-pointer hover:border-purple-600 transition group bg-purple-50/30"
              style={{ minHeight: '110px' }}
              onClick={() => setShowModal(true)}
            >
              <div className="flex items-center gap-2">
                <Plus className="text-purple-500 group-hover:text-purple-700" size={22} />
                <span className="text-purple-700 group-hover:text-purple-900 font-medium text-base">+ Add New Task</span>
              </div>
            </div>
            {/* Task cards */}
            {sortedPendingTasks.map(task => (
              <div
                key={task._id || task.id}
                className="bg-white border border-purple-100 rounded-xl p-4 shadow-sm flex-1 max-w-xs min-w-[220px]"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={false}
                      onChange={() => {}}
                    />
                    <span className="text-purple-700 font-medium">{task.title || 'Task1'}</span>
                    <span className="text-sm text-gray-500 ml-2">{task.priority || 'Medium'}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-500">hi task</span>
                    <div className="text-xs text-gray-400 mt-1">
                      <span>Jul 16</span>
                      <span className="ml-2">Created Jul 15</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Empty state if no tasks */}
          {sortedPendingTasks.length === 0 && (
            <div className={layoutClasses.emptyState + ' mt-6'}>
              <div className="max-w-xs mx-auto py-6">
                <div className={layoutClasses.emptyIconBg}>
                  <Clock className="w-8 h-8 text-purple-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  All caught up!
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  No pending tasks - great work!
                </p>
                <button onClick={() => setShowModal(true)}
                  className={layoutClasses.emptyBtn}> Create New Task</button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Task Modal */}
      <TaskModal
        isOpen={!!selectedTask || showModal}
        onClose={() => { setShowModal(false); setSelectedTask(null); refreshTasks(); }}
        taskToEdit={selectedTask}
      />
    </div>
  );
};

export default PendingPage;