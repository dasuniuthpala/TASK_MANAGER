// Validation utility functions

export const validateEmail = (email) => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (password.length > 128) {
    errors.push('Password cannot exceed 128 characters');
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateName = (name) => {
  const errors = [];
  
  if (!name || name.trim().length === 0) {
    errors.push('Name is required');
  } else if (name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  } else if (name.trim().length > 50) {
    errors.push('Name cannot exceed 50 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateTaskTitle = (title) => {
  const errors = [];
  
  if (!title || title.trim().length === 0) {
    errors.push('Title is required');
  } else if (title.trim().length > 100) {
    errors.push('Title cannot exceed 100 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateTaskDescription = (description) => {
  const errors = [];
  
  if (description && description.length > 500) {
    errors.push('Description cannot exceed 500 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateDueDate = (dueDate) => {
  const errors = [];
  
  if (dueDate) {
    const date = new Date(dueDate);
    const today = new Date().setHours(0, 0, 0, 0);
    
    if (isNaN(date.getTime())) {
      errors.push('Invalid date format');
    } else if (date.getTime() < today) {
      errors.push('Due date cannot be in the past');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validatePriority = (priority) => {
  const validPriorities = ['Low', 'Medium', 'High'];
  const errors = [];
  
  if (priority && !validPriorities.includes(priority)) {
    errors.push('Priority must be Low, Medium, or High');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
