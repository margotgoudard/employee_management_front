import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../assets/styles/Navbar.css';
import logo from '../assets/images/logo.png';
import { HiBellAlert } from "react-icons/hi2";
import { IoPerson } from "react-icons/io5";
import { useSelector, useDispatch } from 'react-redux';
import MensualTimetableSheetService from '../services/MensualTimetableSheet';
import DailyTimetableSheetService from '../services/DailyTimetableSheet';
import { setSelectedTimetable, updateDailyTimetables } from '../redux/timetableSlice';

const Navbar = () => {
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isActive = (path) => location.pathname.startsWith(path);

  const handleFicheHoraireClick = async () => {
    try {
      const data = await MensualTimetableSheetService.fetchMensualTimetablesByUser(user.id_user);

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

        const dailyTimetables = await DailyTimetableSheetService.fetchDailyTimetableByMensualTimetable(
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
            <button className={`navbar-button ${isActive('/department') ? 'active' : ''}`}>
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
