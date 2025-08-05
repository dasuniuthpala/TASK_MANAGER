import Task from '../models/taskModel.js';

// Create a new task
export async function createTask(req, res) {
    const { title, description, priority, dueDate, completed } = req.body;
    
    // Validation
    if (!title || title.trim().length === 0) {
        return res.status(400).json({ success: false, message: 'Title is required and cannot be empty' });
    }
    
    if (title.length > 100) {
        return res.status(400).json({ success: false, message: 'Title cannot exceed 100 characters' });
    }
    
    if (description && description.length > 500) {
        return res.status(400).json({ success: false, message: 'Description cannot exceed 500 characters' });
    }
    
    if (priority && !['Low', 'Medium', 'High'].includes(priority)) {
        return res.status(400).json({ success: false, message: 'Priority must be Low, Medium, or High' });
    }
    
    if (dueDate) {
        const date = new Date(dueDate);
        if (isNaN(date.getTime())) {
            return res.status(400).json({ success: false, message: 'Invalid due date format' });
        }
        if (date < new Date().setHours(0, 0, 0, 0)) {
            return res.status(400).json({ success: false, message: 'Due date cannot be in the past' });
        }
    }
    
    try {
        const task = await Task.create({
            title: title.trim(),
            description: description?.trim() || '',
            priority: priority || 'Low',
            dueDate,
            completed: completed === 'Yes' || completed === true,
            owner: req.user.id
        });
        res.status(201).json({ success: true, task });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Failed to create task: ' + error.message });
    }
}

// Get all tasks for the current user
export async function getTasks(req, res) {
    try {
        const tasks = await Task.find({ owner: req.user.id }).sort({ createdAt: -1 });
        res.json({ success: true, tasks });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Failed to fetch tasks: ' + error.message });
    }
}

// Get a single task by ID (if owned by user)
export async function getTaskById(req, res) {
    const { id } = req.params;
    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user.id });
        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }
        res.json({ success: true, task });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Failed to get task: ' + error.message });
    }
}

// UPDATE A TASK
export async function updateTask(req, res) {
    const { title, description, priority, dueDate, completed } = req.body;
    
    // Validation
    if (title !== undefined) {
        if (!title || title.trim().length === 0) {
            return res.status(400).json({ success: false, message: 'Title cannot be empty' });
        }
        if (title.length > 100) {
            return res.status(400).json({ success: false, message: 'Title cannot exceed 100 characters' });
        }
    }
    
    if (description !== undefined && description.length > 500) {
        return res.status(400).json({ success: false, message: 'Description cannot exceed 500 characters' });
    }
    
    if (priority !== undefined && !['Low', 'Medium', 'High'].includes(priority)) {
        return res.status(400).json({ success: false, message: 'Priority must be Low, Medium, or High' });
    }
    
    if (dueDate !== undefined && dueDate) {
        const date = new Date(dueDate);
        if (isNaN(date.getTime())) {
            return res.status(400).json({ success: false, message: 'Invalid due date format' });
        }
        if (date < new Date().setHours(0, 0, 0, 0)) {
            return res.status(400).json({ success: false, message: 'Due date cannot be in the past' });
        }
    }
    
    try {
        const data = { ...req.body };
        if (data.title) data.title = data.title.trim();
        if (data.description) data.description = data.description.trim();
        if (data.completed !== undefined) {
            data.completed = data.completed === 'Yes' || data.completed === true;
        }
        
        const updated = await Task.findOneAndUpdate(
            { _id: req.params.id, owner: req.user.id },
            data,
            { new: true, runValidators: true }
        );
        if (!updated) return res.status(404).json({
            success: false, message: 'Task not found or not yours'
        });
        res.json({ success: true, task: updated });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

// Delete a task (if owned by user)
export async function deleteTask(req, res) {
    const { id } = req.params;
    try {
        const deleted = await Task.findOneAndDelete({ _id: id, owner: req.user.id });
        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Task not found or not yours' });
        }
        res.json({ success: true, message: 'Task deleted' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

// Toggle task completion (if owned by user)
export async function toggleCompleteTask(req, res) {
    const { id } = req.params;
    try {
        const task = await Task.findOne({ _id: id, owner: req.user.id });
        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found or not yours' });
        }
        task.completed = !task.completed;
        await task.save();
        res.json({ success: true, task });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
} 