import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/Profile.css';
import MensualTimetable from '../pages/MensualTimetable';

const MonthlyTimetables = ({ fiches, admin = null }) => {
  const [selectedFiche, setSelectedFiche] = useState(null);
  const navigate = useNavigate();

  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const getMonthName = (monthNumber) => {
    return months[monthNumber - 1] || '';
  };

  const getStatusClass = (status) => {
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

  const handleViewFiche = (id_timetable) => {
    navigate(`/mensual_timetable/${id_timetable}`);
  };

  const handleViewFicheAdmin = (fiche) => {
    setSelectedFiche(fiche);
  };


  return (
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
                <h3>{`${getMonthName(fiche.month)} ${fiche.year}`}</h3>
                <p className={`${getStatusClass(fiche.status)}`}>{fiche.status}</p>
              </div>
            </div>
            <button
              className="view-button"
              onClick={() =>
                admin ? handleViewFicheAdmin(fiche) : handleViewFiche(fiche.id_timetable)
              }
            >
              {admin ? 'Gérer la fiche' : 'Voir la fiche'}
            </button>
          </div>
        ))}
      </div>
      {/* Affichage des détails de la fiche si une fiche est sélectionnée */}
      {selectedFiche && (
        <MensualTimetable 
          user_id={selectedFiche.id_user} 
          user_id_timetable={selectedFiche.id_timetable} 
        />
      )}
    </div>
  );
};

export default MonthlyTimetables;
