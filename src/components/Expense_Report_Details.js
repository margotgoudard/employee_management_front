import React, { useEffect, useState } from "react";
import "../assets/styles/Expense_Report.css"; 
import Expense_Report from "../services/Expense_Report";
import Daily_Timetable_Sheet from "../services/Daily_Timetable_Sheet";
import Fee_Category from "../services/Fee_Category";

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

  const renderDocumentPreview = (documentBase64, documentName) => {
    if (!documentBase64) return null;

    const isPdf = documentBase64.startsWith("JVBER") || documentName.endsWith(".pdf");
    const isPng = documentBase64.startsWith("iVBORw0KG") || documentName.endsWith(".png");
    const isJpeg = documentBase64.startsWith("/9j/") || documentName.endsWith(".jpeg") || documentName.endsWith(".jpg");

    let mimeType = "";
    if (isPdf) mimeType = "application/pdf";
    else if (isPng) mimeType = "image/png";
    else if (isJpeg) mimeType = "image/jpeg";

    const dataUrl = `data:${mimeType};base64,${documentBase64}`;

    return (
      <div className="document-preview-container">
        <a
          href={dataUrl}
          download={documentName}
          title="Télécharger le document"
          className="document-preview-link"
        >
          <div className="document-preview-box">
            {isPdf ? (
              <iframe
                src={dataUrl}
                title={documentName}
                style={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                }}
              ></iframe>
            ) : (
              <img src={dataUrl} alt="aperçu" />
            )}
          </div>
          <p className="document-name">{documentName}</p>
        </a>
      </div>
    );
  };

  return (
    <div className="expense-report-container">
      <h3>Détails des notes de frais</h3>
      {expenseReports.length > 0 ? (
        <ul className="expense-report-list">
          {expenseReports.map((report) => (
            <li key={report.id_expense_report} className="expense-report-item">
              <div className="expense-report-text">
                <p>{report.feeCategory.name || "N/A"}</p>
                <p>
                  <strong>{report.amount} CHF</strong> &nbsp;&nbsp;&nbsp; {report.client}
                </p>
                <p>
                  <em>Motif :</em> {report.motive || "N/A"}
                </p>
              </div>

              {renderDocumentPreview(report.document, report.document_name)}

              <div className="expense-report-date">
                <strong>Date :</strong>{" "}
                {new Date(report.dailyTimetable.day).toLocaleDateString("fr-FR")}
              </div>
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
