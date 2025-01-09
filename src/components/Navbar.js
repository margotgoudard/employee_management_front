import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../assets/styles/Navbar.css';
import logo from '../assets/images/logo.png';
import { HiBellAlert } from "react-icons/hi2";
import { IoPerson } from "react-icons/io5";
import { useSelector, useDispatch } from 'react-redux';
import MensualTimetableSheet from '../services/MensualTimetableSheet';
import DailyTimetableSheet from '../services/DailyTimetableSheet';
import { setSelectedTimetable, updateDailyTimetables } from '../redux/timetableSlice';
import Notification from '../services/Notification'; 

const Navbar = () => {
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [unreadCount, setUnreadCount] = useState(0); // État pour le nombre de notifications non vues

  const isActive = (path) => location.pathname.startsWith(path);

  const fetchUnreadNotifications = async () => {
    try {
      const count = await Notification.fetchUnreadNotificationCount();
      setUnreadCount(count.unreadCount);
      console.log(count.unreadCount)
    } catch (err) {
      console.error('Erreur lors de la récupération des notifications non vues :', err);
    }
  };

  useEffect(() => {
    fetchUnreadNotifications();
  }, []); 
  const handleFicheHoraireClick = async () => {
    try {
      const data = await MensualTimetableSheet.fetchMensualTimetablesByUser(user.id_user);

      if (data && data.length > 0) {
        const currentDate = new Date();
        let selected = data.find(
          (t) =>
            t.year === currentDate.getFullYear() &&
            t.month === currentDate.getMonth() + 1
        );

        if (!selected) {
          selected = data[data.length - 1]; 
        }

        dispatch(setSelectedTimetable(selected));

        const dailyTimetables = await DailyTimetableSheet.fetchDailyTimetableByMensualTimetable(
          selected.id_timetable
        );

        dispatch(updateDailyTimetables(dailyTimetables));

        navigate(`/mensual_timetable/${selected.id_timetable}`);
      }
    } catch (err) {
      console.error('Erreur lors de la récupération de la fiche horaire :', err);
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

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="PSS Logo" className="navbar-logo" />
        <ul className="navbar-links">
          <li>
            <button
              onClick={handleFicheHoraireClick}
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
            <button className={`navbar-button ${isActive('/mon-equipe') ? 'active' : ''}`}>
              Mon équipe
            </button>
          </li>
          <li>
            <button
              onClick={handleDocumentsClick}
              className={`navbar-button ${isActive('/documents') ? 'active' : ''}`}>
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
      </div>
    </nav>
  );
};

export default Navbar;
