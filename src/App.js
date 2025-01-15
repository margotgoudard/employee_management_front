import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

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

const App = () => {
  const location = useLocation();

  const isLoginPage = location.pathname === '/';

  return (
    <div>
      {!isLoginPage && <Navbar />}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/mensual_timetable/:id_timetable" element={<MensualTimetable />} />
        <Route path="/documents/:id_user" element={<Documents />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/departments" element={<Departments />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
};

const AppWrapper = () => (
  <Router>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Router>
);

export default AppWrapper;
