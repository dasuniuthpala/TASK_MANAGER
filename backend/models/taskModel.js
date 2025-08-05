import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        minlength: [1, 'Title cannot be empty'],
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
        type: String,
        default: '',
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    priority: {
        type: String,
        enum: {
            values: ['Low', 'Medium', 'High'],
            message: 'Priority must be Low, Medium, or High'
        },
        default: 'Low'
    },
    dueDate: {
        type: Date,
        validate: {
            validator: function(value) {
                if (!value) return true; // Allow null/undefined
                return value >= new Date().setHours(0, 0, 0, 0);
            },
            message: 'Due date cannot be in the past'
        }
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: [true, 'Owner is required']
    },
    completed: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Task = mongoose.models.Task || mongoose.model('Task',taskSchema);
export default Task;