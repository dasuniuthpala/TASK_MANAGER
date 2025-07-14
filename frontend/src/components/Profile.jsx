import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { BACK_BUTTON, FULL_BUTTON, SECTION_WRAPPER, personalFields, INPUT_WRAPPER, securityFields, DANGER_BTN } from '../assets/dummy';
import { ChevronLeft, UserCircle, Save, Section, Shield, Lock, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:4000';

const Profile = ({ setCurrentUser, onLogout }) => {
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    axios
      .get(`${API_URL}/api/user/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data }) => {
        if (data.success) {
          setProfile({ name: data.user.name, email: data.user.email });
        } else {
          toast.error(data.message);
        }
      })
      .catch(() => toast.error("UNABLE TO LOAD PROFILE."));
  }, []);

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.put(
        `${API_URL}/api/user/profile`,
        {
          name: profile.name,
          email: profile.email,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (data.success) {
        setCurrentUser((prev) => ({
          ...prev,
          name: profile.name,
          avatar: `https://ui-avatars.com/api/?name=U&background=8B5CF6&color=fff`
        }));
        toast.success("Profile Updated");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      return toast.error("Password do not match");
    }
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.put(
        `${API_URL}/api/user/password`,
        {
          currentPassword: passwords.current,
          newPassword: passwords.new,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (data.success) {
        toast.success("Password Changed");
        setPasswords({ current: "", new: "", confirm: "" });
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Password change failed");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 pt-8">
      <ToastContainer position="top-center" autoClose={3000} />
      <button
        onClick={() => navigate(-1)}
        className="self-start ml-4 mt-4 mb-6 flex items-center text-gray-600 hover:text-purple-600 transition-colors"
      >
        <ChevronLeft className="w-5 h-5 mr-1" />
        Back to Dashboard
      </button>
      <div className="flex flex-col items-center w-full">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-md mb-2">
            {profile.name ? profile.name[0].toUpperCase() : "U"}
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Account Settings</h1>
          <p className="text-gray-500 text-sm text-center">Manage your profile and security settings</p>
        </div>
        {/* Responsive grid for cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
          {/* Personal Info Card */}
          <section className={SECTION_WRAPPER + " w-full"}>
            <div className="flex items-center gap-2 mb-5">
              <UserCircle className="text-purple-500 w-5 h-5" />
              <h2 className="text-lg font-semibold text-gray-800">Personal Information</h2>
            </div>
            <form onSubmit={saveProfile} className="space-y-4">
              {personalFields.map(({ name, type, placeholder, icon: Icon }) => (
                <div key={name} className={INPUT_WRAPPER}>
                  <Icon className="text-purple-500 w-5 h-5 mr-2" />
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={profile[name]}
                    onChange={e => setProfile({ ...profile, [name]: e.target.value })}
                    className="w-full focus:outline-none text-sm"
                    required
                  />
                </div>
              ))}
              <button className={FULL_BUTTON + " mt-2"}>
                <Save className="w-4 h-4" /> Save changes
              </button>
            </form>
          </section>
          {/* Security Card */}
          <section className={SECTION_WRAPPER + " w-full"}>
            <div className="flex items-center gap-2 mb-6">
              <Shield className="text-purple-500 w-5 h-5" />
              <h2 className="text-xl font-semibold text-gray-800">Security</h2>
            </div>
            <form onSubmit={changePassword} className="space-y-4">
              {securityFields.map(({ name, placeholder }) => (
                <div key={name} className={INPUT_WRAPPER}>
                  <Lock className="text-purple-500 w-5 h-5 mr-2" />
                  <input
                    type="password"
                    placeholder={placeholder}
                    value={passwords[name]}
                    onChange={e => setPasswords({ ...passwords, [name]: e.target.value })}
                    className="w-full focus:outline-none text-sm"
                    required
                  />
                </div>
              ))}
              <button className={FULL_BUTTON}>
                <Shield className="w-4 h-4" /> Change Password
              </button>

              <div className=''>
                
              </div>
            </form>
            <div className="mt-8 pt-6 border-t border-purple-100">
              <h3 className="text-red-600 font-semibold mb-4 flex items-center gap-2">
                <LogOut className="w-4 h-4" /> Danger Zone
              </h3>
              <button className={DANGER_BTN} onClick={onLogout}>
                Logout
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Profile;
