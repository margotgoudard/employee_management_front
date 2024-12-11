import React from 'react';
import { useSelector } from 'react-redux'; 
import '../assets/styles/Profile.css';

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  console.log(user)
  const fiches = [
    { month: 'Janvier 2025', status: 'À compléter' },
    { month: 'Décembre 2024', status: 'En attente d\'approbation' },
    { month: 'Novembre 2024', status: 'Validée' },
  ];

  return (
    <div className="user-dashboard">
      <div className="user-info">
        <h2>Informations personnelles</h2>
        <div className="info-item">
          <label>Nom</label>
          <input type="text" value={user?.last_name || ''} readOnly />
        </div>
        <div className="info-item">
          <label>Prénom</label>
          <input type="text" value={user?.first_name || ''} readOnly />
        </div>
        <div className="info-item">
          <label>Email</label>
          <input type="text" value={user?.email || ''} readOnly />
        </div>
        <div className="info-item">
          <label>Tel</label>
          <input type="text" value={user?.phone || ''} readOnly />
        </div>
        <div className="info-item">
          <label>Profession</label>
          <input type="text" value={user?.role || ''} readOnly />
        </div>
      </div>

      <div className="fiches-horaires">
        <h2>Fiches horaires mensuelles</h2>
        <div className="fiches-list">
          {fiches.map((fiche, index) => (
            <div className="fiche-card" key={index}>
              <div className="fiche-content">
                <div className="fiche-icon">
                  <div className="icon-placeholder"></div>
                </div>
                <div className="fiche-details">
                  <h3>{fiche.month}</h3>
                  <p>{fiche.status}</p>
                </div>
              </div>
              <button className="view-button">Voir la fiche</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
