import React, { useEffect, useState } from "react";
import "../assets/styles/Calendar.css";
import ExpenseReportService from "../services/Expense_Report";

const Expense_Report_Details = ({ mensualTimetableId }) => {
  const [expenseReports, setExpenseReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchExpenseReports = async () => {
    try {
      setIsLoading(true);
      const data = await ExpenseReportService.getExpenseReportsByMensualTimetable(mensualTimetableId);
      setExpenseReports(data);
    } catch (error) {
      console.error("Error fetching expense reports:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (mensualTimetableId) {
      fetchExpenseReports();
    }
  }, [mensualTimetableId]);

  return (
    <div className="expense-report-details">
      <h3>Détails des notes de frais</h3>
      {isLoading ? (
        <p>Chargement des données...</p>
      ) : expenseReports.length > 0 ? (
        <ul>
          {expenseReports.map((report) => (
            <li key={report.id_expense_report} className="expense-item">
              <p>
                <strong>Catégorie :</strong> {report.category || "N/A"}
              </p>
              <p>
                <strong>Montant :</strong> {report.amount} CHF
              </p>
              <p>
                <strong>Client/Fournisseur :</strong> {report.client || "N/A"}
              </p>
              <p>
                <strong>Motif :</strong> {report.motive || "N/A"}
              </p>
              <p>
                <strong>Date :</strong>{" "}
                {new Date(report.createdAt).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucune note de frais trouvée.</p>
      )}
    </div>
  );
};

export default Expense_Report_Details;
