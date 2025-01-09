import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../src/redux/store';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import './assets/styles/App.css'
import MensualTimetable from './pages/MensualTimetable';
import Documents from './pages/Documents';
import Notifications from './pages/Notifications';
import Departments from './pages/Departments';

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
        <Route path="/documents" element={<Documents />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/departments" element={<Departments />} />
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
