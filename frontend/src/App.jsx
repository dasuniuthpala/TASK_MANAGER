import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, Route, Routes, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Dashboard from './pages/Dashboard';
import PendingPage from './pages/PendingPage';
import CompletePage from './pages/CompletePage';
import Profile from './components/Profile';
import axios from 'axios';

const App = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const url = 'http://localhost:4000';

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('token');
      console.log('[App.jsx] Checking session. Token:', token);
      if (token) {
        try {
          const { data } = await axios.get(`${url}/api/user/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log('[App.jsx] /api/user/me response:', data);
          if (data.success && data.user && data.user.id) {
            setCurrentUser({
              email: data.user.email,
              name: data.user.name || 'User',
              avatar: `https://ui-avatars.com/api/?name=U&background=8B5CF6&color=fff`,
              ...data.user,
            });
          } else {
            setCurrentUser(null);
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
          }
        } catch (err) {
          console.log('[App.jsx] Session check error:', err);
          setCurrentUser(null);
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
        }
      } else {
        setCurrentUser(null);
      }
      setCheckingSession(false);
    };
    checkSession();
  }, []);

  useEffect(() => {
    console.log('[App.jsx] currentUser changed:', currentUser);
  }, [currentUser]);

  const handleAuthSubmit = (data) => {
    const user = {
      email: data.email,
      name: data.name || 'User',
      avatar: `https://ui-avatars.com/api/?name=U&background=8B5CF6&color=fff`,
      ...data,
    };
    setCurrentUser(user);
    navigate('/', { replace: true });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    navigate('/login', { replace: true });
  };

  const ProtectLayout = () => {
    if (!currentUser) {
      return <Navigate to="/login" replace />;
    }
    return <Layout user={currentUser} onLogout={handleLogout} />;
  };

  if (checkingSession) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          currentUser
            ? <Navigate to="/" replace />
            : <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
                <Login onSubmit={handleAuthSubmit} onSwitchMode={() => navigate('/signup')} />
              </div>
        }
      />
      <Route
        path="/signup"
        element={
          currentUser
            ? <Navigate to="/" replace />
            : <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
                <SignUp onSubmit={handleAuthSubmit} onSwitchMode={() => navigate('/login')} />
              </div>
        }
      />
      <Route element={<ProtectLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path='/pending' element={<PendingPage/>} />
        <Route path='/complete' element={<CompletePage/>} />
        <Route path='/profile' element={<Profile user={currentUser} setCurrentUser={setCurrentUser} onLogout={handleLogout}/>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;