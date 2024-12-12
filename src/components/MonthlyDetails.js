import React from 'react';
import '../assets/styles/Mensual_Timetable.css';

const MonthlyDetails = ({ selectedTimetable }) => {
  return (
    <div className="monthly-details">
      <h3>Fiche du mois</h3>
      <div className="detail-item">
        <label>Total commissions</label>
        <input
          type="number"
          name="totalCommissions"
          value={selectedTimetable?.totalCommissions || 0}
          readOnly
        />
        <span>CHF</span>
      </div>
      <div className="detail-item">
        <label>Total heures</label>
        <input
          type="number"
          name="totalHours"
          value={selectedTimetable?.totalHours || 0}
          readOnly
        />
        <span>heures</span>
      </div>
      <div className="detail-item">
        <label>Total notes de frais</label>
        <input
          type="number"
          name="totalExpenses"
          value={selectedTimetable?.totalExpenses || 0}
          readOnly
        />
        <span>CHF</span>
      </div>
      <div className="detail-item">
        <label>Commentaire</label>
        <textarea
          name="comment"
          value={selectedTimetable?.comment || ''}
          readOnly
        />
      </div>
    </div>
  );
};

export default MonthlyDetails;
