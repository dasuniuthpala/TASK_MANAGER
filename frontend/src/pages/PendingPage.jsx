import React, { useState } from 'react';
import { layoutClasses, SORT_OPTIONS } from '../assets/dummy';
import { ListChecks } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import TaskItem from '../components/TaskItem'; // Still imported, but not directly used for rendering each task as per your original structure
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

  // Helper function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const options = { month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    } catch (error) {
      console.error("Error formatting date:", dateString, error);
      return dateString; // Return original if parsing fails
    }
  };

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

          {/* Add New Task box - Moved to be above the tasks and changed to full width */}
          <div
            className="w-full border-2 border-dashed border-purple-400 rounded-xl flex items-center justify-center cursor-pointer hover:border-purple-600 transition group bg-purple-50/30 py-8"
            onClick={() => setShowModal(true)}
          >
            <div className="flex items-center gap-2">
              <Plus className="text-purple-500 group-hover:text-purple-700" size={22} />
              <span className="text-purple-700 group-hover:text-purple-900 font-medium text-base">+ Add New Task</span>
            </div>
          </div>

          {/* Task cards - Changed to flex-col for vertical stacking */}
          <div className="flex flex-col gap-4">
            {sortedPendingTasks.map(task => (
              <div
                key={task._id || task.id}
                className="bg-white border border-purple-100 rounded-xl p-4 shadow-sm w-full relative" // Added relative here for the absolute overlay
              >
                {/* This overlay makes the entire task card clickable to open the modal for editing/updating */}
                <div
                    className="absolute inset-0 cursor-pointer"
                    onClick={() => setSelectedTask(task)} // This sets selectedTask, triggering update mode in TaskModal
                ></div>

                <div className="flex items-start justify-between relative z-10"> {/* Added relative z-10 for content above overlay */}
                  <div>
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={false} // Always false for pending tasks
                      onChange={() => { /* Handle completion here if needed, or rely on modal */ }}
                    />
                    <span className="text-purple-700 font-medium">{task.title || 'No Title'}</span>
                    <span className="text-sm text-gray-500 ml-2">{task.priority || 'No Priority'}</span>
                  </div>
                  <div className="text-right">
                    {/* Display dueDate if available, otherwise fallback */}
                    <span className="text-sm text-gray-500">
                        {task.dueDate ? formatDate(task.dueDate) : 'No Due Date'}
                    </span>
                    <div className="text-xs text-gray-400 mt-1">
                      {/* Display createdAt date */}
                      {task.createdAt && (
                        <span className="ml-2">Created {formatDate(task.createdAt)}</span>
                      )}
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
      {/* The TaskModal is opened in 'update' mode when selectedTask is set (by clicking a task card) */}
      {/* It's opened in 'add new' mode when showModal is true (by clicking the '+ Add New Task' box) */}
      <TaskModal
        isOpen={!!selectedTask || showModal}
        onClose={() => { setShowModal(false); setSelectedTask(null); refreshTasks(); }}
        taskToEdit={selectedTask}
      />
    </div>
  );
};

export default PendingPage;