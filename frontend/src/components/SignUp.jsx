import { UserPlus } from 'lucide-react'
import React, { useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

// --- Copied from dummy.jsx ---
const FIELDS = [
  { name: "name", type: "text", placeholder: "Full Name", icon: UserPlus },
  { name: "email", type: "email", placeholder: "Email", icon: UserPlus },
  { name: "password", type: "password", placeholder: "Password", icon: UserPlus },
];
const Inputwrapper =
  "flex items-center border border-purple-100 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500 transition-all duration-200";
// --- End copy ---

const API_URL = "http://localhost:4000"
const INITIAL_FORM = { name: "", email: "", password: "" }
const MESSAGE_SUCCESS = "text-green-600 bg-green-50 border border-green-200 px-3 py-2 rounded mb-4 text-sm"
const MESSAGE_ERROR = "text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded mb-4 text-sm"
const BUTTONCLASSES = "w-full bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white text-sm font-semibold py-2.5 rounded-lg hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2"

const SignUp = () => {
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ text: "", type: "" })

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ text: "", type: "" })

    try {
      const { data } = await axios.post(`${API_URL}/api/user/register`, formData)
      console.log("Signup Successful", data)
      setMessage({ text: "Registration successful! You can now log in.", type: "success" })
      setFormData(INITIAL_FORM)
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
          <div key={name} className={Inputwrapper}>
            <Icon className='text-purple-500 w-5 h-5 mr-2' />
            <input
              type={type}
              placeholder={placeholder}
              value={formData[name]}
              onChange={handleChange}
              name={name}
              className='w-full focus:outline-none text-sm text-gray-700'
              required
            />
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
    </div>
  )
}

export default SignUp
