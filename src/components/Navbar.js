import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../assets/styles/Navbar.css';
import logo from '../assets/images/logo.png';
import { HiBellAlert } from "react-icons/hi2";
import { IoPerson } from "react-icons/io5";
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedTimetable } from '../redux/timetableSlice';
import Notification from '../services/Notification'; 
import { logout } from '../redux/authSlice'; 


const Navbar = () => {
  const user = useSelector((state) => state.auth.user);
  const timetables = useSelector((state) => state.timetable.timetables); 
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [unreadCount, setUnreadCount] = useState(0); 

  const isActive = (path) => location.pathname.startsWith(path);

  useEffect(() => {
    if (!user) {
      navigate('/'); 
    }
  }, [user, navigate]);

  const fetchUnreadNotifications = async () => {
    try {
      const count = await Notification.fetchUnreadNotificationCount();
      setUnreadCount(count.unreadCount);
    } catch (err) {
      console.error('Erreur lors de la récupération des notifications non vues :', err);
    }
  };

  useEffect(() => {
    fetchUnreadNotifications();
  }, []); 

  const handleTimetableClick = () => {
    if (timetables && timetables.length > 0) {
      const currentDate = new Date();
      let selected = timetables.find(
        (t) =>
          t.year === currentDate.getFullYear() &&
          t.month === currentDate.getMonth() + 1
      );

      if (!selected) {
        selected = timetables[timetables.length - 1]; 
      }

      dispatch(setSelectedTimetable(selected)); 
      navigate(`/mensual_timetable/${selected.id_timetable}`); 
    } else {
      console.warn('Aucune fiche mensuelle disponible.');
    }
  };

  const handleDocumentsClick = async () => {
    try {
      navigate(`/documents`);
    } catch (err) {
      console.error('Erreur lors de la récupération de la fiche horaire :', err);
    }
  };

  const handleNotificationsClick = async () => {
    try {
      navigate(`/notifications`);
      await Notification.markAllAsViewed()
      await fetchUnreadNotifications()
    } catch (err) {
      console.error('Erreur lors de la récupération des notifications :', err);
    }
  };

  const handleDepartmentsClick = async () => {
    try {
      navigate(`/departments`);
    } catch (err) {
      console.error('Erreur lors de la récupération des départements :', err);
    }
  };

  const handleLogout = () => {
    dispatch(logout()); 
    navigate('/'); 
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="PSS Logo" className="navbar-logo" />
        <ul className="navbar-links">
          <li>
            <button
              onClick={handleTimetableClick}
              className={`navbar-button ${isActive('/mensual_timetable') ? 'active' : ''}`}
            >
              Fiche horaire
            </button>
          </li>
          <li>
            <button className={`navbar-button ${isActive('/dashboard') ? 'active' : ''}`}>
              Dashboard
            </button>
          </li>
          <li>
          <button
              onClick={handleDepartmentsClick}
              className={`navbar-button ${isActive('/departments') ? 'active' : ''}`} >
                Mes équipes
            </button>
          </li>
          <li>
            <button
              onClick={handleDocumentsClick}
              className={`navbar-button ${isActive('/documents') ? 'active' : ''}`} >
                Mes documents
            </button>
          </li>
        </ul>
      </div>
      <div className="navbar-right">
        <button 
          onClick={handleNotificationsClick}
          className="navbar-notification">
          <HiBellAlert className="icon-notification" />
          {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
        </button>
        <div className="navbar-profile">
          <button className="profile-link" onClick={() => navigate('/profile')}>
            <IoPerson className="icon-profile" />
          </button>
          <span className="profile-name">{user ? user.first_name : 'Guest'}</span>
        </div>
        {user && (  
          <button onClick={handleLogout} className="navbar-logout">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
