import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../assets/styles/Navbar.css';
import logo from '../assets/images/logo.png';
import { HiBellAlert } from "react-icons/hi2";
import { IoPerson } from "react-icons/io5";
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedTimetable } from '../redux/timetableSlice';

const Navbar = () => {
  const user = useSelector((state) => state.auth.user);
  const timetables = useSelector((state) => state.timetable.timetables); // Récupération des timetables depuis le store
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isActive = (path) => location.pathname.startsWith(path);

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

  const handleDocumentsClick = () => {
    navigate(`/documents`);
  };

  const handleDepartmentClick = () => {
    navigate(`/departments`);
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
              onClick={handleDepartmentClick}
              className={`navbar-button ${isActive('/departments') ? 'active' : ''}`}>
              Mes équipes
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
        <button className="navbar-notification">
          <HiBellAlert className="icon-notification" />
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
