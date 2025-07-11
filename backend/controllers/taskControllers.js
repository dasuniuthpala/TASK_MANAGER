import Task from '../models/taskModel.js';

// Create a new task
export async function createTask(req, res) {
    const { title, description, priority, dueDate, completeted } = req.body;
    if (!title) {
        return res.status(400).json({ success: false, message: 'Title is required' });
    }
    try {
        const task = await Task.create({
            title,
            description,
            priority,
            dueDate,
            completeted: completeted === 'Yes' || completeted ===true,
            owner: req.user.id
        });
        res.status(201).json({ success: true, task });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: ' error message' });
    }
}

// Get all tasks for the current user
export async function getTasks(req, res) {
    try {
        const tasks = await Task.find({ owner: req.user.id }).sort({ createdAt: -1 });
        res.json({ success: true, tasks });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'error message' });
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
        res.status(500).json({ success: false, message: 'error message' });
    }
}

// UPDATE A TASK
export async function updateTask(req, res) {
    try {
        const data = { ...req.body };
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
            return res.status(404).json({ success: false, message: 'Task not found or not use' });
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
            return res.status(404).json({ success: false, message: 'Task not found or not use' });
        }
        task.completeted = !task.completeted;
        await task.save();
        res.json({ success: true, task });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
} 