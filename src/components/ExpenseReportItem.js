import React, { useState, useEffect } from "react";

const ExpenseReportItem = ({ report }) => {
  const [documentPreview, setDocumentPreview] = useState(null);

  useEffect(() => {
    const loadDocumentPreview = async () => {
      if (!report.document) {
        setDocumentPreview(
          <div className="document-preview-container">
            <p className="document-name">Aucun document disponible</p>
          </div>
        );
        return;
      }
      const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
          if (typeof file === "string") {
            resolve(file);
            return;
          }
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result.split(",")[1]);
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(file);
        });
      };

      let documentBase64 = report.document;
      if (typeof documentBase64 !== "string") {
        try {
          documentBase64 = await convertToBase64(report.document);
        } catch (error) {
          console.error("Erreur lors de la conversion en Base64 :", error);
          return;
        }
      }

      const isPdf = documentBase64.startsWith("JVBER") || report.document_name.endsWith(".pdf");
      const isPng = documentBase64.startsWith("iVBORw0KG") || report.document_name.endsWith(".png");
      const isJpeg = documentBase64.startsWith("/9j/") || report.document_name.endsWith(".jpeg") || report.document_name.endsWith(".jpg");
      const isHtml = report.document_name.endsWith(".html");

      let mimeType = "";
      if (isPdf) mimeType = "application/pdf";
      else if (isPng) mimeType = "image/png";
      else if (isJpeg) mimeType = "image/jpeg";
      else if (isHtml) mimeType = "text/html";

      const dataUrl = `data:${mimeType};base64,${documentBase64}`;

      setDocumentPreview(
        <div className="document-preview-container">
          <a
            href={dataUrl}
            download={report.document_name}
            title="Télécharger le document"
            className="document-preview-link"
          >
            <div className="document-preview-box">
              {isPdf || isHtml ? (
                <iframe
                  src={dataUrl}
                  scrolling="no"
                  title={report.document_name}
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
            <p className="document-name">{report.document_name}</p>
          </a>
        </div>
      );
    };

    loadDocumentPreview();
  }, [report.document, report.document_name]);

  return (
    <li className="expense-report-item">
      <div className="expense-report-text">
        <p>{report.feeCategory.name || "N/A"}</p>
        <p>
          <strong>{report.amount} CHF</strong> &nbsp;&nbsp;&nbsp; {report.client}
        </p>
        <p>
          <em>Motif :</em> {report.motive || "N/A"}
        </p>
      </div>

      {documentPreview || <p>Loading document preview...</p>}

      <div className="expense-report-date">
        <strong>Date :</strong>{" "}
        {new Date(report.dailyTimetable.day).toLocaleDateString("fr-FR")}
      </div>
    </li>
  );
};

export default ExpenseReportItem;
