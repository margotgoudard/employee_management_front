import React from "react";
import "../assets/styles/ExpenseReport.css"; 
import ExpenseReportItem from "./ExpenseReportItem";

const ExpenseReportDetails = ({ expenseReports }) => {
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
