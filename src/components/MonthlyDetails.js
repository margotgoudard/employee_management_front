import React from "react";
import "../assets/styles/MonthlyDetails.css";
import MensualTimetableSheet from "../services/MensualTimetableSheet";
import { LiaSearchDollarSolid } from "react-icons/lia";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedTimetable } from "../redux/timetableSlice";

const MonthlyDetails = ({ 
  expenseReports, 
  isDisabled, 
  onToggleExpenseDetails, 
  onSubmitSuccess, 
  managerView
}) => {
  const [totalHours, setTotalHours] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const selectedTimetable = useSelector((state) => state.timetable.selectedTimetable);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchTotalHours = async () => {
      if (!selectedTimetable?.id_timetable) return;
      const response = await MensualTimetableSheet.getMensualWorkedHours(selectedTimetable.id_timetable);
      setTotalHours(response);
    };
    fetchTotalHours();
  }, [selectedTimetable]);

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
  
    const updatedTimetable = {
      ...selectedTimetable,
      [name]: value,
    };
  
    dispatch(setSelectedTimetable(updatedTimetable));
      
    if (name === "commission" && value !== "") {
      await MensualTimetableSheet.updateMensualTimetable(updatedTimetable);
    }
  };
  

  const handleSubmit = async () => {
    const updatedTimetable = {
      ...selectedTimetable,
      status: "En attente d'approbation",
    };

    dispatch(setSelectedTimetable(updatedTimetable));

    try {
      const resp = await MensualTimetableSheet.updateMensualTimetable(updatedTimetable);
      if(resp) {
        onSubmitSuccess(updatedTimetable);
      }
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
              value={selectedTimetable?.commission === null || selectedTimetable?.commission === undefined ? "" : selectedTimetable?.commission}
              onChange={(e) => handleChange(e)}
              onFocus={(e) => {
                setSelectedTimetable({
                  ...selectedTimetable,
                  commission: null,
                });
              }}
              onBlur={() => {
                if (selectedTimetable?.commission === "" || selectedTimetable?.commission === null || selectedTimetable?.commission === undefined) {
                  setSelectedTimetable({
                    ...selectedTimetable,
                    commission: 0,
                  });
                }
              }}
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
        ) : (
          <>
            {!managerView && !isDisabled && (
              <button className="submit-button" onClick={handleSubmit}>
                Soumettre
              </button>
            )}
            {isDisabled && (
              <div className="submit-status">
                {selectedTimetable?.status || "Statut inconnu"}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MonthlyDetails;
