import React from "react";
import "../assets/styles/Notification.css";

const Notification = ({ message, type }) => {
  if (!message || !type) {
    return null;
  }

  return (
    <div className={`notification ${type}`}>
      {message}
    </div>
  );
};

export default Notification;
