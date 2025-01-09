import React, { useEffect, useState } from "react";
import "../assets/styles/ExpenseReport.css"; 
import ExpenseReport from "../services/ExpenseReport";
import DailyTimetableSheet from "../services/DailyTimetableSheet";
import FeeCategory from "../services/FeeCategory";
import ExpenseReportItem from "./ExpenseReportItem";

const ExpenseReportDetails = ({ mensualTimetableId, expenseReports }) => {
 console.log("expenseReports!!!!", expenseReports);
  return (
    <div className="expense-report-container">
      <h3>Détails des notes de frais</h3>
      {expenseReports?.length > 0 ? (
        <ul className="expense-report-list">
          {expenseReports.map((report) => (
            <ExpenseReportItem key={report.id_expense_report} report={report} />
          ))}
        </ul>
      ) : (
        <p>Aucune note de frais trouvée.</p>
      )}
    </div>
  );
};

export default ExpenseReportDetails;
