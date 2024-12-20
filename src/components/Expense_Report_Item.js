import React from "react";

const ExpenseReportItem = ({ report }) => {
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

      {renderDocumentPreview(report.document, report.document_name)}

      <div className="expense-report-date">
        <strong>Date :</strong>{" "}
        {new Date(report.dailyTimetable.day).toLocaleDateString("fr-FR")}
      </div>
    </li>
  );
};

export default ExpenseReportItem;
