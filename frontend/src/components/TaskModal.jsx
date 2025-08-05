import React, { useCallback, useEffect, useState } from 'react';
import { DEFAULT_TASK } from '../assets/dummy';
import { PlusCircle, X, AlignLeft, Flag, CheckCircle, Save } from 'lucide-react';
import { baseControlClasses, priorityStyles } from '../assets/dummy';
import TaskItem from '../components/TaskItem';
import { validateTaskTitle, validateTaskDescription, validateDueDate, validatePriority } from '../utils/validation';
import { API_ENDPOINTS } from '../config/api';

const TaskModal = ({ isOpen, onClose, taskToEdit, onSave, onLogout }) => {
  const [taskData, setTaskData] = useState(DEFAULT_TASK);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (!isOpen) return;
    if (taskToEdit) {
      const normalized = taskToEdit.completed === "Yes" || taskToEdit.completed === true ? "Yes" : "No";
      setTaskData({
        ...DEFAULT_TASK,
        title: taskToEdit.title || "",
        description: taskToEdit.description || "",
        priority: taskToEdit.priority || "Low",
        dueDate: taskToEdit.dueDate?.split("T")[0] || "",
        completed: normalized,
        id: taskToEdit._id,
      });
    } else {
      setTaskData(DEFAULT_TASK);
    }
    setError(null);
    setFieldErrors({});
  }, [isOpen, taskToEdit]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setTaskData(prev => ({ ...prev, [name]: value }));
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: null }));
    }
  }, [fieldErrors]);

  const validateForm = () => {
    const errors = {};
    
    // Validate title
    const titleValidation = validateTaskTitle(taskData.title);
    if (!titleValidation.isValid) {
      errors.title = titleValidation.errors[0];
    }
    
    // Validate description
    const descValidation = validateTaskDescription(taskData.description);
    if (!descValidation.isValid) {
      errors.description = descValidation.errors[0];
    }
    
    // Validate due date
    const dateValidation = validateDueDate(taskData.dueDate);
    if (!dateValidation.isValid) {
      errors.dueDate = dateValidation.errors[0];
    }
    
    // Validate priority
    const priorityValidation = validatePriority(taskData.priority);
    if (!priorityValidation.isValid) {
      errors.priority = priorityValidation.errors[0];
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const getHeaders = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No auth Token Found');
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }, []);

  const handleSubmit = useCallback(async (e) => {
  e.preventDefault();
  
  if (!validateForm()) {
    return;
  }
  
  setLoading(true);
  setError(null);
  try {
    const isEdit = Boolean(taskData.id);
    const url = isEdit ? `${API_ENDPOINTS.TASKS}/${taskData.id}/gp` : API_ENDPOINTS.TASKS_GP;
    const resp = await fetch(url, {
      method: isEdit ? 'PUT' : 'POST',
      headers: getHeaders(),
      body: JSON.stringify(taskData), 
    });
    // handle response...
    if (!resp.ok) {
      const data = await resp.json();
      setError(data.message || 'Failed to save task');
    } else {
      onSave && onSave();
    }
  } catch (error) {
    setError('An error occurred while saving the task.');
    console.error(error);
  }
  setLoading(false);
}, [taskData, today, getHeaders,onLogout, onSave, onClose]);

    if(!isOpen) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/20 backdrop-blur-sm p-4">
      <div className="bg-white border border-purple-100 rounded-xl max-w-md w-full shadow-lg relative p-6 animate-fadeIn">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            {taskData.id ? (
              <span className="text-purple-500">Save</span>
            ) : null}
            {taskData.id ? (
              <PlusCircle className="text-purple-500 w-5 h-5" />
            ) : null}
            {taskData.id ? "Edit Task" : "Create New Task"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-purple-100 rounded-lg transition-colors text-gray-500 hover:text-purple-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* FORM TO FILL TO CREATE A TASK*/}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Task Title
            </label>
            <div className={`flex items-center border rounded-lg px-3 py-2.5 focus-within:ring-2 transition-all duration-200 ${fieldErrors.title ? 'border-red-300 focus-within:border-red-500 focus-within:ring-red-500' : 'border-purple-100 focus-within:ring-purple-500 focus-within:border-purple-500'}`}>
              <input
                type="text"
                name="title"
                value={taskData.title}
                onChange={handleChange}
                className="w-full focus:outline-none text-sm"
                placeholder="Enter task title"
              />
            </div>
            {fieldErrors.title && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.title}</p>
            )}
          </div>
          <div>
            <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
              <AlignLeft className="w-4 h-4 text-purple-500" />
              Description
            </label>
            <textarea
              name="description"
              rows={3}
              onChange={handleChange}
              value={taskData.description}
              className={`${baseControlClasses} ${fieldErrors.description ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
              placeholder="Add details about your task"
            />
            {fieldErrors.description && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.description}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
                <Flag className="w-4 h-4 text-purple-500" />
                Priority
              </label>
              <select
                name="priority"
                value={taskData.priority}
                onChange={handleChange}
                className={`${baseControlClasses} ${priorityStyles[taskData.priority]} ${fieldErrors.priority ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
              {fieldErrors.priority && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.priority}</p>
              )}
            </div>
            <div>
              <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
                <Flag className="w-4 h-4 text-purple-500" />
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                min={today}
                value={taskData.dueDate}
                onChange={handleChange}
                className={`${baseControlClasses} ${fieldErrors.dueDate ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`} 
              >
              </input>
              {fieldErrors.dueDate && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.dueDate}</p>
              )}
            </div>
          </div>
          <div>
            <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-2">
              <CheckCircle className="w-4 h-4 text-purple-500" />
              Status
            </label>
            <div className="flex gap-4">
              {[{ val: 'Yes', label: 'Completed' }, { val: 'No', label: 'In Progress' }].map(({ val, label }) => (
                <label key={val} className="flex items-center">
                  <input
                    type="radio"
                    name="completed"
                    value={val}
                    checked={taskData.completed === val}
                    onChange={handleChange}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 hover:shadow-md transition-all duration-200"
          >
            {loading ? (
              'Saving...'
            ) : taskData.id ? (
              <>
                <Save className="w-4 h-4" /> Update Task
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" /> Create Task
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
