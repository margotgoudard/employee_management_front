import React from "react";
import "../assets/styles/Alert.css";

const Alert = ({ message, type }) => {
  if (!message || !type) {
    return null;
  }

  return (
    <div className={`alert ${type}`}>
      {message}
    </div>
  );
};

export default Alert;
