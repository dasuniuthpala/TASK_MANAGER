import { UserPlus } from 'lucide-react'
import React, { useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { validateEmail, validatePassword, validateName } from '../utils/validation'
import { API_ENDPOINTS } from '../config/api'

// --- Copied from dummy.jsx ---
const FIELDS = [
  { name: "name", type: "text", placeholder: "Full Name", icon: UserPlus },
  { name: "email", type: "email", placeholder: "Email", icon: UserPlus },
  { name: "password", type: "password", placeholder: "Password", icon: UserPlus },
];
const Inputwrapper =
  "flex items-center border border-purple-100 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500 transition-all duration-200";
// --- End copy ---

const INITIAL_FORM = { name: "", email: "", password: "" }
const MESSAGE_SUCCESS = "text-green-600 bg-green-50 border border-green-200 px-3 py-2 rounded mb-4 text-sm"
const MESSAGE_ERROR = "text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded mb-4 text-sm"
const BUTTONCLASSES = "w-full bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white text-sm font-semibold py-2.5 rounded-lg hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2"

const SignUp = () => {
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ text: "", type: "" })
  const [errors, setErrors] = useState({})

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value })
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  const validateForm = () => {
    const newErrors = {};
    
    // Validate name
    const nameValidation = validateName(formData.name);
    if (!nameValidation.isValid) {
      newErrors.name = nameValidation.errors[0];
    }
    
    // Validate email
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Validate password
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.errors[0];
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true)
    setMessage({ text: "", type: "" })

    try {
      const { data } = await axios.post(API_ENDPOINTS.USER_REGISTER, formData)
      console.log("Signup Successful", data)
      setMessage({ text: "Registration successful! You can now log in.", type: "success" })
      setFormData(INITIAL_FORM)
      setErrors({})
    } catch (err) {
      console.error("Signup error:", err)
      setMessage({
        text: err.response?.data?.message || "An error occurred. Please try again.",
        type: "error"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md w-full bg-white shadow-lg border border-purple-100 rounded-xl p-8">
      <div className="mb-6 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-fuchsia-500 to-purple-600 rounded-full mx-auto flex items-center justify-center mb-4">
          <UserPlus className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">
          Create Account
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Join TaskFlow to manage your tasks
        </p>
      </div>

      {message.text && (
        <div className={message.type === 'success' ? MESSAGE_SUCCESS : MESSAGE_ERROR}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className='space-y-4'>
        {FIELDS.map(({ name, type, placeholder, icon: Icon }) => (
          <div key={name} className="space-y-1">
            <div className={`${Inputwrapper} ${errors[name] ? 'border-red-300 focus-within:border-red-500 focus-within:ring-red-500' : ''}`}>
              <Icon className='text-purple-500 w-5 h-5 mr-2' />
              <input
                type={type}
                placeholder={placeholder}
                value={formData[name]}
                onChange={handleChange}
                name={name}
                className='w-full focus:outline-none text-sm text-gray-700'
                autoComplete={type === 'password' ? 'off' : undefined}
              />
            </div>
            {errors[name] && (
              <p className="text-red-500 text-xs ml-1">{errors[name]}</p>
            )}
          </div>
        ))}
        
        <button type="submit" className={BUTTONCLASSES} disabled={loading}>
          {loading ? "Signing Up..." : <><UserPlus className="w-4 h-4" /> Sign Up</>}
        </button>
      </form>
      <p className="text-center text-sm text-gray-600 mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-purple-600 hover:underline font-medium">Log in</Link>
      </p>
      <button
        type="button"
        onClick={() => {
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          window.location.reload();
        }}
        className="w-full mt-2 bg-red-100 text-red-600 font-semibold py-2.5 rounded-lg hover:bg-red-200 transition-all duration-200"
      >
        Log out (for testing)
      </button>
    </div>
  )
}

export default SignUp
