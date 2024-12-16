import React from "react";
import "../assets/styles/Monthly_Details.css";
import Mensual_Timetable_Sheet from "../services/Mensual_Timetable_Sheet";
import { LiaSearchDollarSolid } from "react-icons/lia";

const Monthly_Details = ({ selectedTimetable, setSelectedTimetable, onToggleExpenseDetails }) => {
  const handleChange = async (e) => {
    const { name, value } = e.target;
    setSelectedTimetable((prevTimetable) => ({
      ...prevTimetable,
      [name]: value,
    }));
    await Mensual_Timetable_Sheet.updateMensualTimetable(selectedTimetable);
  };

  return (
    <div className="monthly-details">
      <h3>Fiche du mois</h3>
      <div className="detail-item">
        <label>Total commissions</label>
        <div className="input-container">
          <input
            type="number"
            name="commission"
            value={selectedTimetable?.commission || 0}
            onChange={handleChange}
          />
          <span className="input-suffix">CHF</span>
        </div>
      </div>

      <div className="detail-item">
        <label>Total heures</label>
        <div className="input-container">
          <input
            name="totalHours"
            value={selectedTimetable?.totalWorkedHours || 0}
            readOnly
          />
          <span className="input-suffix">heures</span>
        </div>
      </div>

      <div className="detail-item">
        <label>Total notes de frais</label>
        <div className="input-container">
          <input
            type="number"
            name="totalExpenses"
            value={selectedTimetable?.totalExpenseNotes || 0}
            readOnly
          />
          <span className="input-suffix">CHF</span>
          <LiaSearchDollarSolid
            className="search-icon"
            onClick={onToggleExpenseDetails}
            style={{ cursor: "pointer" }}
          />
        </div>
      </div>

      <div className="detail-item">
        <label>Commentaire</label>
        <textarea
          name="comment"
          value={selectedTimetable?.comment || ""}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default Monthly_Details;