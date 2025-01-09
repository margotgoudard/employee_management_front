import React from 'react';
import '../assets/styles/Notification.css';
import { IoCloseOutline } from "react-icons/io5";

const NotificationColumn = ({ title, notifications, type, onDelete }) => {
  return (
    <div className={`notification-column ${type}-column`}>
      <h3 className="column-title">{title}</h3>
      {notifications.length > 0 ? (
        notifications.map((notif) => (
          <div key={notif.id_notification} className={`notification-item ${type}`}>
            <p>{notif.content}</p>
            <span
              className="delete-cross"
              onClick={() => onDelete(notif.id_notification)}
            >
              <IoCloseOutline />
            </span>
          </div>
        ))
      ) : (
        <p className="empty-message">Aucune notification de {title.toLowerCase()}.</p>
      )}
    </div>
  );
};


export default NotificationColumn;
