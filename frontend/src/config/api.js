// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const API_ENDPOINTS = {
  // Base URLs
  BASE: API_BASE_URL,
  TASKS: `${API_BASE_URL}/api/tasks`,
  USERS: `${API_BASE_URL}/api/user`,
  
  // Specific endpoints
  TASKS_GP: `${API_BASE_URL}/api/tasks/gp`,
  USER_REGISTER: `${API_BASE_URL}/api/user/register`,
  USER_LOGIN: `${API_BASE_URL}/api/user/login`,
  USER_ME: `${API_BASE_URL}/api/user/me`,
  USER_PROFILE: `${API_BASE_URL}/api/user/profile`,
  USER_PASSWORD: `${API_BASE_URL}/api/user/password`,
};

export default API_BASE_URL;
