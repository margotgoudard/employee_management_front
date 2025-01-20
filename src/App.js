import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from '../src/redux/store';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import './assets/styles/App.css'
import MensualTimetable from './pages/MensualTimetable';
import Documents from './pages/Documents';
import Notifications from './pages/Notifications';
import Departments from './pages/Departments';
import Dashboard from './pages/Dashboard';
import User from './services/User';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';

const App = () => {
  const location = useLocation();
  const user = useSelector((state) => state.auth.user); 
  const isLoginPage = location.pathname === "/";

  const checkManagerAccess = async (id_user) => {
    console.log("checkManagerAccess", user.id_user, id_user);
    try {
      if(user.is_admin || user.is_sup_admin ) return true;
      const response = await User.checkManagerAccess(user.id_user, id_user);
      return response.isManager;
      
    } catch (error) {
      console.error("Error checking access:", error);
      return false;
    }
  };
  
  return (
    <>
      {!isLoginPage && <Navbar />}

      <Routes>
        {!user ? <Route path="/" element={<Login />} /> : <Route path="*" element={<Navigate to="/profile" />} />}

        {user && (
          <>
            <Route path="/profile" element={<Profile />} />
            <Route path="/mensual_timetable/:id_timetable" element={<MensualTimetable />} />
            <Route path="/documents/:id_user" element={<Documents />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/employee-profile/:id_user"
              element={
                <EmployeeProfileRoute
                  user={user}
                  checkManagerAccess={(id) => checkManagerAccess(id)}
                />
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </>
  );
};

const EmployeeProfileRoute = ({ user, checkManagerAccess }) => {
  const { id_user } = useParams();
  const [hasAccess, setHasAccess] = useState(null); 

  useEffect(() => {
    const checkAccess = async () => {
      if (user) {
        const allowed = await checkManagerAccess(id_user);
        setHasAccess(allowed); 
      }
    };
    checkAccess();
  }, [id_user, user, checkManagerAccess]);

  if (!hasAccess) {
    return <Navigate to="/" />;
  }
  return <Profile />;
};

const AppWrapper = () => (
  <Router>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Router>
);

export default AppWrapper;
