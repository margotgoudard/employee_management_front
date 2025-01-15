import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/MonthlyTimetables.css';
import MensualTimetable from '../pages/MensualTimetable';
import { HiOutlineArrowCircleLeft } from "react-icons/hi";
import { HiOutlineArrowCircleRight } from "react-icons/hi";

const MonthlyTimetables = ({ fiches, admin = null, onUpdateTimetables }) => {
  const [selectedFiche, setSelectedFiche] = useState(null);
  const [visibleCount, setVisibleCount] = useState(1); 
  const [startIndex, setStartIndex] = useState(0); 
  const fichesRef = useRef(null);
  const navigate = useNavigate();

  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const getMonthName = (monthNumber) => months[monthNumber - 1] || '';

  const getStatusClass = (status) => {
    switch (status) {
      case 'Acceptée':
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

  const handleOnUpdate = () => {
    onUpdateTimetables()
  }


  const handleResize = () => {
    if (fichesRef.current) {
      const containerWidth = fichesRef.current.offsetWidth;
      const ficheWidth = 250; 
      const count = Math.min(Math.floor(containerWidth / ficheWidth), 4); 
      setVisibleCount(count > 0 ? count : 1);
    }
  };
  

  const handleNext = () => {
    setStartIndex((prevIndex) => (prevIndex + visibleCount) % fiches.length);
  };

  const handlePrev = () => {
    setStartIndex((prevIndex) =>
      (prevIndex - visibleCount + fiches.length) % fiches.length
    );
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const visibleFiches = [
    ...fiches.slice(startIndex, startIndex + visibleCount),
    ...fiches.slice(0, Math.max(0, startIndex + visibleCount - fiches.length))
  ];

  return (
    <div className="fiches-horaires">
      <h2>Fiches horaires mensuelles</h2>
      <div className="fiches-container">
        <button className="arrow left" onClick={handlePrev}><HiOutlineArrowCircleLeft/></button>
        <div className="fiches-list" ref={fichesRef}>
          {visibleFiches.map((fiche) => (
            <div className="fiche-card" key={fiche.id_timetable}>
              <div className="fiche-content">
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
        <button className="arrow right" onClick={handleNext}><HiOutlineArrowCircleRight/></button>
      </div>
      
      {selectedFiche && (
        <MensualTimetable 
          user_id={selectedFiche.id_user} 
          user_id_timetable={selectedFiche.id_timetable} 
          onUpdate={handleOnUpdate}
        />
      )}
    </div>
  );
};

export default MonthlyTimetables;
