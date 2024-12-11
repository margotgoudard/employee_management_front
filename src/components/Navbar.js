import React from 'react';
import '../assets/styles/Navbar.css';
import logo from '../assets/images/logo.png';
import { HiBellAlert } from "react-icons/hi2";
import { IoPerson } from "react-icons/io5";
import { useSelector } from 'react-redux';

const Navbar = () => {

    const user = useSelector((state) => state.auth.user);
    console.log(user)

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="PSS Logo" className="navbar-logo" />
      </div>
      <ul className="navbar-links">
        <li><a href="#fiche-horaire">Fiche horaire</a></li>
        <li><a href="#dashboard">Dashboard</a></li>
        <li><a href="#mon-equipe">Mon équipe</a></li>
        <li><a href="#mes-documents">Mes documents</a></li>
      </ul>
      <div className="navbar-right">
        <button className="navbar-notification">
          <HiBellAlert className="icon-notification" />
        </button>
        <div className="navbar-profile">
          <IoPerson className="icon-profile" />
          <span className="profile-name">{user ? user.first_name : 'Guest'}</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
