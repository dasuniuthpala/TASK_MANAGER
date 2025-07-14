import React, { useEffect, useState } from 'react'
import { LogIn, Eye, EyeOff, User, Mail, Lock } from 'lucide-react'
import { toast, ToastContainer } from 'react-toastify'
import { INPUTWRAPPER } from '../assets/dummy'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'
import { Link } from 'react-router-dom';

const INITIAL_FORM = { email: '', password: '' }

const Login = ({ onSubmit, onSwitchMode }) => {
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  const navigate = useNavigate()
  const url = 'http://localhost:4000'

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('userId')
    if (token) {
      (async () => {
        try {
          const { data } = await axios.get(`${url}/api/user/me`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          if (data.success) {
            onSubmit?.({ token, userId, ...data.user })
            toast.success('Session restored. Redirecting...')
            navigate('/')
          } else {
            localStorage.removeItem('token')
            localStorage.removeItem('userId')
            setCheckingSession(false)
          }
        } catch {
          localStorage.removeItem('token')
          localStorage.removeItem('userId')
          setCheckingSession(false)
        }
      })()
    } else {
      setCheckingSession(false)
    }
  }, []) // Only run on mount

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!rememberMe) {
      toast.error('You must enable "Remember Me" to login.')
      return
    }
    setLoading(true)
    try {
      const { data } = await axios.post(`${url}/api/user/login`, formData)
      if (!data.token) throw new Error(data.message || 'Login failed')
      localStorage.setItem('token', data.token)
      localStorage.setItem('userId', data.user.id)
      setFormData(INITIAL_FORM)
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
          <div key={name} className={INPUTWRAPPER + ' relative'}>
            <Icon className='text-purple-500 w-5 h-5' />
            <input
              type={isPassword ? (showPassword ? 'text' : 'password') : type}
              placeholder={placeholder}
              value={formData[name]}
              onChange={e => setFormData({ ...formData, [name]: e.target.value })}
              className="w-full focus:outline-none text-sm text-gray-700 pl-2 pr-10 bg-transparent"
              required
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
    </div>
  )
}

export default Login
