import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../assets/styles/Navbar.css';
import logo from '../assets/images/logo.png';
import { HiBellAlert } from "react-icons/hi2";
import { IoPerson } from "react-icons/io5";
import { useSelector } from 'react-redux';

const Navbar = () => {
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="PSS Logo" className="navbar-logo" />
      <ul className="navbar-links">
        <li>
          <Link 
            to="/mensual_timetable/:id_timetable"
            className={isActive('/mensual_timetable/:id_timetable') ? 'active' : ''}
          >
            Fiche horaire
          </Link>
        </li>
        <li>
          <a href="#dashboard" className={isActive('/dashboard') ? 'active' : ''}>Dashboard</a>
        </li>
        <li>
          <a href="#mon-equipe" className={isActive('/mon-equipe') ? 'active' : ''}>Mon équipe</a>
        </li>
        <li>
          <a href="#mes-documents" className={isActive('/mes-documents') ? 'active' : ''}>Mes documents</a>
        </li>
      </ul>
      </div>
      <div className="navbar-right">
        <button className="navbar-notification">
          <HiBellAlert className="icon-notification" />
        </button>
        <div className="navbar-profile">
          <Link to="/profile" className="profile-link">
            <IoPerson className="icon-profile" />
          </Link>
          <span className="profile-name">{user ? user.first_name : 'Guest'}</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
