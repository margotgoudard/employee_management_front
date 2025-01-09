import API from "./API";

class Notification {
  // Récupérer les notifications par utilisateur
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

  // Supprimer une notification par ID
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

  // Récupérer le nombre de notifications non vues
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

  // Marquer toutes les notifications comme vues
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
