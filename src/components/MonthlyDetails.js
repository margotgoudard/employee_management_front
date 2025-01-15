import React from "react";
import "../assets/styles/MonthlyDetails.css";
import MensualTimetableSheet from "../services/MensualTimetableSheet";
import { LiaSearchDollarSolid } from "react-icons/lia";
import { useEffect, useState } from "react";

const MonthlyDetails = ({ 
  selectedTimetable, 
  expenseReports, 
  setSelectedTimetable, 
  isDisabled, 
  onToggleExpenseDetails, 
  onSubmitSuccess, 
  onTimetableUpdate,
  managerView
}) => {
  const [totalHours, setTotalHours] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);

  // Calcul des heures totales
  useEffect(() => {
    const fetchTotalHours = async () => {
      if (!selectedTimetable?.id_timetable) return;
      const response = await MensualTimetableSheet.getMensualWorkedHours(selectedTimetable.id_timetable);
      setTotalHours(response.totalHours);
    };
    fetchTotalHours();
  }, [selectedTimetable]);

  // Calcul des dépenses totales
  useEffect(() => {
    const fetchTotalExpenses = () => {
      if (expenseReports?.length === 0) {
        setTotalExpenses(0);
      } else {
        const totalExpenses = expenseReports.reduce((total, report) => total + report.amount, 0);
        setTotalExpenses(totalExpenses);
      }
    };
    fetchTotalExpenses();
  }, [expenseReports]);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    const updatedTimetable = { ...selectedTimetable, [name]: value };
    setSelectedTimetable(updatedTimetable);
    await MensualTimetableSheet.updateMensualTimetable(updatedTimetable);
  };

  const handleSubmit = async () => {
    const updatedTimetable = {
      ...selectedTimetable,
      status: "En attente d'approbation",
    };

    setSelectedTimetable(updatedTimetable);

    try {
      await MensualTimetableSheet.updateMensualTimetable(updatedTimetable);
      if (onSubmitSuccess) onSubmitSuccess();
    } catch (error) {
      console.error("Erreur lors de la soumission :", error);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      const updatedTimetable = {
        ...selectedTimetable,
        status: newStatus,
      };
      await MensualTimetableSheet.updateMensualTimetable(updatedTimetable);
      setSelectedTimetable(updatedTimetable); 

    } catch (error) {
      console.error(`Erreur lors de la mise à jour du statut (${newStatus}) :`, error);
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
            disabled={isDisabled}
          />
          <span className="input-suffix">CHF</span>
        </div>
      </div>

      <div className="detail-item">
        <label>Total heures</label>
        <div className="input-container">
          <input
            name="totalHours"
            value={totalHours || 0}
            readOnly
            disabled={isDisabled}
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
            value={totalExpenses || 0}
            readOnly
            disabled={isDisabled}
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
          disabled={isDisabled}
        />
      </div>

      <div className="submit-button-container">
        {managerView && selectedTimetable?.status === "En attente d'approbation" ? (
          // Affiche les boutons "Valider" et "Refuser" pour le manager
          <div className="approval-buttons">
            <button 
              className="approve-button" 
              onClick={() => handleUpdateStatus("Acceptée")}
            >
              Valider
            </button>
            <button 
              className="reject-button" 
              onClick={() => handleUpdateStatus("À compléter")}
            >
              Refuser
            </button>
          </div>
        ) : isDisabled ? (
          // Affiche le bouton désactivé avec le statut actuel
          <button className="submit-button" disabled>
            {selectedTimetable?.status || "Statut inconnu"}
          </button>
        ) : (
          // Affiche le bouton "Soumettre" pour les utilisateurs standard
          <button className="submit-button" onClick={handleSubmit}>
            Soumettre
          </button>
        )}
      </div>

    </div>
  );
};

export default MonthlyDetails;
