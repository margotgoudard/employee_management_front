import React from "react";
import "../assets/styles/MonthlyDetails.css";
import MensualTimetableSheet from "../services/MensualTimetableSheet";
import { LiaSearchDollarSolid } from "react-icons/lia";
import { useEffect, useState } from "react";
import ExpenseReport from "../services/ExpenseReport";
import DailyTimetableSheet from "../services/DailyTimetableSheet";
import FeeCategory from "../services/FeeCategory";

const MonthlyDetails = ({ selectedTimetable, expenseReports, setSelectedTimetable, onToggleExpenseDetails, onSubmitSuccess }) => {
  //mettre à jour le nombre heureTotal lorsquon selectedTimetable change
  const [totalHours, setTotalHours] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);

  useEffect(() => {
    const fetchTotalHours = async () => {
      if (!selectedTimetable?.id_timetable) return;
      const response = await MensualTimetableSheet.getMensualWorkedHours(selectedTimetable.id_timetable);
      console.log("totalHours", response.totalHours);
      setTotalHours(response.totalHours);
    }
    
      fetchTotalHours();
    
  }, [selectedTimetable]);

  useEffect(() => {
    const fetchTotalExpenses = () => {
      if(expenseReports?.length === 0) return;
      const totalExpenses = expenseReports.reduce((total, report) => {
        return total + report.amount;
      }, 0);  
      console.log("totalExpenses", totalExpenses);
      setTotalExpenses(totalExpenses);
    }
    if(expenseReports?.length > 0){
      console.log("expenseReports", expenseReports);
      fetchTotalExpenses();
    }
    fetchTotalExpenses();
  }, [expenseReports]);


  const handleChange = async (e) => {
    const { name, value } = e.target;
    console.log("name", name, "value", value);
  
    // Create the updated timetable using the current selectedTimetable state
    const updatedTimetable = {
      ...selectedTimetable,
      [name]: value,
    };
  
    // Update state
    setSelectedTimetable(updatedTimetable);
  
    // Call the API with the updated timetable
    await MensualTimetableSheet.updateMensualTimetable(updatedTimetable);
  };
  

  const handleSubmit = async () => {
    const updatedTimetable = {
      ...selectedTimetable,
      status: "En attente d'approbation",
    };

    setSelectedTimetable(updatedTimetable);
    console.log("updatedTimetable", updatedTimetable);
    
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
            value={totalHours || 0}
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
            value={totalExpenses || 0}
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
