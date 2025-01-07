import React from "react";
import "../assets/styles/MonthlyDetails.css";
import MensualTimetableSheet from "../services/MensualTimetableSheet";
import { LiaSearchDollarSolid } from "react-icons/lia";

const MonthlyDetails = ({ selectedTimetable, setSelectedTimetable, onToggleExpenseDetails, onSubmitSuccess }) => {
  const handleChange = async (e) => {
    const { name, value } = e.target;
    setSelectedTimetable((prevTimetable) => ({
      ...prevTimetable,
      [name]: value,
    }));
    await MensualTimetableSheet.updateMensualTimetable(selectedTimetable);
  };

  const handleSubmit = async () => {
    const updatedTimetable = {
      ...selectedTimetable,
      status: "En attente d'approbation",
    };

    setSelectedTimetable(updatedTimetable);
    
    try {
      await MensualTimetableSheet.updateMensualTimetable(updatedTimetable);
      
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (error) {
      console.error("Erreur lors de la soumission :", error);
    }
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

      <div className="submit-button-container">
        <button className="submit-button" onClick={handleSubmit}>
          Soumettre
        </button>
      </div>
    </div>
  );
};

export default MonthlyDetails;
