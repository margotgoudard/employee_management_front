import API from "./API";

class Notification {
  static async fetchNotificationsByUser() {
    try {
      const endpoint = `/notifications`; 
      const response = await API.get(endpoint);  
      return response;  
    } catch (error) {
      console.error("Erreur lors de la récupération des notifications", error);
      throw error; 
    }
  }

  static async deleteNotification(notificationId) {
    try {
      const endpoint = `/notifications/${notificationId}`;
      const response = await API.delete(endpoint);

      return response; 
    } catch (error) {
      console.error("Erreur lors de la suppression de la notification", error);
      throw error;
    }
  }

  static async fetchUnreadNotificationCount() {
    try {
      const endpoint = `/notifications/unread-count`; 
      const response = await API.get(endpoint);
      return response; 
    } catch (error) {
      console.error("Erreur lors de la récupération du nombre de notifications non vues", error);
      throw error;
    }
  }

  static async markAllAsViewed() {
    try {
      const endpoint = `/notifications/mark-all-as-viewed`; 
      const response = await API.patch(endpoint); 
      return response; 
    } catch (error) {
      console.error("Erreur lors de la mise à jour des notifications", error);
      throw error;
    }
  }
}


export default Notification;
