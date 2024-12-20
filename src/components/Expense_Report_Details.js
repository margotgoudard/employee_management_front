import React, { useEffect, useState } from "react";
import "../assets/styles/Expense_Report.css"; 
import Expense_Report from "../services/Expense_Report";
import Daily_Timetable_Sheet from "../services/Daily_Timetable_Sheet";
import Fee_Category from "../services/Fee_Category";
import ExpenseReportItem from "./Expense_Report_Item";

const Expense_Report_Details = ({ mensualTimetableId }) => {
  const [expenseReports, setExpenseReports] = useState([]);

  useEffect(() => {
    const fetchExpenseReports = async () => {
      try {
        const data = await Expense_Report.getExpenseReportsByMensualTimetable(
          mensualTimetableId
        );

        const reportsWithDetails = await Promise.all(
          data.map(async (report) => {
            const dailyTimetable =
              await Daily_Timetable_Sheet.fetchDailyTimetableById(
                report.id_daily_timetable
              );

            const feeCategory = await Fee_Category.fetchFeeCategoryById(
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

export default Expense_Report_Details;
