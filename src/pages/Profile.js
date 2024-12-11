import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import '../assets/styles/Profile.css';
import Mensual_Timetable_Sheet from '../services/Mensual_Timetable_Sheet';

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const [fiches, setFiches] = useState([]);

  useEffect(() => {
    const fetchFiches = async () => {
      if (user?.id_user) {
        const fetchedFiches = await Mensual_Timetable_Sheet.fetchNotifications(user.id_user);
        setFiches(fetchedFiches);
      }
    };

    fetchFiches();
  }, [user]);

  const getStatusClass = (status) => {
    console.log(status)
    switch (status) {
      case 'Validée':
        return 'status-green';
      case 'En attente d\'approbation':
        return 'status-orange';
      case 'À compléter':
        return 'status-gray';
      default:
        return '';
    }
  };

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
          {fiches.map((fiche) => (
            <div className="fiche-card" key={fiche.id_timetable}>
              <div className="fiche-content">
                <div className="fiche-icon">
                  <div className="icon-placeholder"></div>
                </div>
                <div className="fiche-details">
                  <h3>{`${fiche.month} ${fiche.year}`}</h3>
                  <p className={`${getStatusClass(fiche.status)}`}>{fiche.status}</p>
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
