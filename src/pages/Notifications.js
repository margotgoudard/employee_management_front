import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Notification from '../services/Notification';
import NotificationColumn from '../components/NotificationColumn';

const Notifications = () => {
  const user = useSelector((state) => state.auth.user);
  const [notifications, setNotifications] = useState({
    success: [],
    information: [],
    warning: [],
  });

  useEffect(() => {
    if (!user?.id_user) return;

    const fetchNotifications = async () => {
        try {
          const fetchedNotifications = await Notification.fetchNotificationsByUser();
          const success = fetchedNotifications.filter((notif) => notif.type === 'success');
          const information = fetchedNotifications.filter((notif) => notif.type === 'information');
          const warning = fetchedNotifications.filter((notif) => notif.type === 'warning');
          setNotifications({ success, information, warning });
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
    };

    fetchNotifications();
  }, [user?.id_user]);

  const handleDelete = async (notificationId) => {
      try {
      await Notification.deleteNotification(notificationId);
  
      
      setNotifications((prevState) => {
          const updatedNotifications = {
          success: prevState.success.filter((notif) => notif.id_notification !== notificationId),
          information: prevState.information.filter((notif) => notif.id_notification !== notificationId),
          warning: prevState.warning.filter((notif) => notif.id_notification !== notificationId),
          };
          return updatedNotifications;
      });
      } catch (error) {
      console.error('Error deleting notification:', error);
      }
  };
  

  return (
    <div className="notifications-page">
      <div className="notification-columns">
        <NotificationColumn
          title="Succès"
          notifications={notifications.success}
          type="success"
          onDelete={handleDelete} 
        />
        <NotificationColumn
          title="Informations"
          notifications={notifications.information}
          type="information"
          onDelete={handleDelete}  
        />
        <NotificationColumn
          title="Avertissements"
          notifications={notifications.warning}
          type="warning"
          onDelete={handleDelete}  
        />
      </div>
    </div>
  );
};

export default Notifications;
