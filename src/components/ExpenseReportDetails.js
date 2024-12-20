import React, { useEffect, useState } from "react";
import "../assets/styles/ExpenseReport.css"; 
import ExpenseReport from "../services/ExpenseReport";
import DailyTimetableSheet from "../services/DailyTimetableSheet";
import FeeCategory from "../services/FeeCategory";
import ExpenseReportItem from "./ExpenseReportItem";

const ExpenseReportDetails = ({ mensualTimetableId }) => {
  const [expenseReports, setExpenseReports] = useState([]);

  useEffect(() => {
    const fetchExpenseReports = async () => {
      try {
        const data = await ExpenseReport.getExpenseReportsByMensualTimetable(
          mensualTimetableId
        );

        const reportsWithDetails = await Promise.all(
          data.map(async (report) => {
            const dailyTimetable =
              await DailyTimetableSheet.fetchDailyTimetableById(
                report.id_daily_timetable
              );

            const feeCategory = await FeeCategory.fetchFeeCategoryById(
              report.id_fee_category
            );

            return {
              ...report,
              dailyTimetable,
              feeCategory,
            };
          })
        );

        setExpenseReports(reportsWithDetails);
      } catch (error) {
        console.error("Error fetching expense reports:", error);
      }
    };

    if (mensualTimetableId) {
      fetchExpenseReports();
    }
  }, [mensualTimetableId]);

  return (
    <div className="expense-report-container">
      <h3>Détails des notes de frais</h3>
      {expenseReports.length > 0 ? (
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
