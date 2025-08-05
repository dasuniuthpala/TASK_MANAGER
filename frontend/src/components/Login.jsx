import React, { useEffect, useState } from 'react'
import { LogIn, Eye, EyeOff, User, Mail, Lock } from 'lucide-react'
import { toast, ToastContainer } from 'react-toastify'
import { INPUTWRAPPER } from '../assets/dummy'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'
import { Link } from 'react-router-dom';
import { validateEmail } from '../utils/validation'
import { API_ENDPOINTS } from '../config/api'

const INITIAL_FORM = { email: '', password: '' }

const Login = ({ onSubmit, onSwitchMode }) => {
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    console.log('Session check: token in localStorage:', token)
    if (token) {
      (async () => {
        try {
          const { data } = await axios.get(API_ENDPOINTS.USER_ME, {
            headers: { Authorization: `Bearer ${token}` },
          })
          console.log('Session check: /api/user/me response:', data)
          if (data.success && data.user && data.user.id) {
            localStorage.setItem('userId', data.user.id)
            onSubmit?.({ token, userId: data.user.id, ...data.user })
            toast.success('Session restored. Redirecting...')
            navigate('/')
          } else {
            localStorage.removeItem('token')
            localStorage.removeItem('userId')
            setCheckingSession(false)
          }
        } catch (err) {
          console.log('Session check: error', err)
          localStorage.removeItem('token')
          localStorage.removeItem('userId')
          setCheckingSession(false)
        }
      })()
    } else {
      setCheckingSession(false)
    }
  }, [onSubmit, navigate]) // Add onSubmit and navigate to deps

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return;
    }
    
    if (!rememberMe) {
      toast.error('You must enable "Remember Me" to login.')
      return
    }
    setLoading(true)
    try {
      const { data } = await axios.post(API_ENDPOINTS.USER_LOGIN, formData)
      if (!data.token) throw new Error(data.message || 'Login failed')
      localStorage.setItem('token', data.token)
      localStorage.setItem('userId', data.user.id)
      setFormData(INITIAL_FORM)
      setErrors({})
      onSubmit?.({ token: data.token, userId: data.user.id, ...data.user })
      toast.success('Login successful! Redirecting...')
      setTimeout(() => navigate('/'), 1000)
    } catch (err) {
      const msg = err.response?.data?.message || err.message
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSwitchMode = () => {
    toast.dismiss()
    onSwitchMode?.()
  }

  // Only email and password fields
  const fields = [
    { name: 'email', type: 'email', placeholder: 'Email', icon: Mail },
    { name: 'password', type: 'password', placeholder: 'Password', icon: Lock, isPassword: true },
  ];

  if (checkingSession) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
      </div>
    )
  }

  return (
    <div className="max-w-md bg-white w-full shadow-lg border border-purple-100 rounded-xl p-8 mx-auto">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
      <div className="mb-6 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-fuchsia-500 to-purple-600 rounded-full mx-auto flex items-center justify-center mb-4">
          <LogIn className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
        <p className="text-gray-500 text-sm mt-1">Sign in to continue to TaskFlow</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map(({ name, type, placeholder, icon: Icon, isPassword }) => (
          <div key={name} className="space-y-1">
            <div className={`${INPUTWRAPPER} relative ${errors[name] ? 'border-red-300 focus-within:border-red-500 focus-within:ring-red-500' : ''}`}>
              <Icon className='text-purple-500 w-5 h-5' />
              <input
                type={isPassword ? (showPassword ? 'text' : 'password') : type}
                placeholder={placeholder}
                value={formData[name]}
                onChange={handleChange}
                name={name}
                className="w-full focus:outline-none text-sm text-gray-700 pl-2 pr-10 bg-transparent"
                autoComplete="off"
              />
              {isPassword && (
                <button
                  type="button"
                  className="ml-2 text-gray-500 hover:text-purple-500 transition-colors absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={0}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              )}
            </div>
            {errors[name] && (
              <p className="text-red-500 text-xs ml-1">{errors[name]}</p>
            )}
          </div>
        ))}
        <div className="flex items-center mb-2">
          <input
            id="rememberMe"
            type="checkbox"
            checked={rememberMe}
            onChange={e => setRememberMe(e.target.checked)}
            className="h-4 w-4 text-purple-500 focus:ring-purple-400 border-gray-300 rounded"
            required
          />
          <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">Remember Me</label>
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white text-sm font-semibold py-2.5 rounded-lg hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2"
          disabled={loading}
        >
          <LogIn className='w-4 h-4' />
          {loading ? 'Logging in...' : 'Log in'}
        </button>
      </form>
      <p className="text-center text-sm text-gray-600 mt-6">
        Don't have an account?{' '}
        <Link to="/signup" className="text-fuchsia-600 font-semibold hover:underline">Sign Up</Link>
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

export default Login
