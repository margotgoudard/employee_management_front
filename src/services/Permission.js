import API from "./API";

class Permission {
    
  // Créer une nouvelle permission
  static async createPermission(data) {
    try {
      const endpoint = `/permissions`; 
      const response = await API.post(endpoint, data);
      return response;
    } catch (error) {
      console.error("Erreur lors de la création de la permission", error);
      throw error;
    }
  }

  // Récupérer toutes les permissions
  static async getPermissions() {
    try {
      const endpoint = `/permissions`; 
      const response = await API.get(endpoint);
      return response;
    } catch (error) {
      console.error("Erreur lors de la récupération des permissions", error);
      throw error;
    }
  }

  // Récupérer une permission par ID
  static async getPermissionById(id_permission) {
    try {
      const endpoint = `/permissions/${id_permission}`; 
      const response = await API.get(endpoint);
      return response;
    } catch (error) {
      console.error("Erreur lors de la récupération de la permission", error);
      throw error;
    }
  }

  // Mettre à jour une permission par ID
  static async updatePermission(id_permission, data) {
    try {
      const endpoint = `/permissions/${id_permission}`;
      const response = await API.put(endpoint, data);
      return response;
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la permission", error);
      throw error;
    }
  }

  // Supprimer une permission par ID
  static async deletePermission(id_permission) {
    try {
      const endpoint = `/permissions/${id_permission}`; 
      const response = await API.delete(endpoint);
      return response;
    } catch (error) {
      console.error("Erreur lors de la suppression de la permission", error);
      throw error;
    }
  }

  // Assigner une permission à un utilisateur
  static async addPermissionToUser(userId, permissionId) {
    try {
      const endpoint = `/permissions/user/addPermission`;
      const data = { id_user: userId, id_permission: permissionId };
      const response = await API.post(endpoint, data);
      return response;
    } catch (error) {
      console.error("Erreur lors de l'ajout d'une permission à l'utilisateur", error);
      throw error;
    }
  }

  // Retirer une permission d'un utilisateur
  static async removePermissionFromUser(userId, permissionId) {
    try {
      const endpoint = `/permissions/user/${userId}/removePermission/${permissionId}`; 
      const response = await API.delete(endpoint);
      return response;
    } catch (error) {
      console.error("Erreur lors de la suppression d'une permission de l'utilisateur", error);
      throw error;
    }
  }

  // Récupérer toutes les permissions d'un utilisateur par son ID
  static async getPermissionsByUserId(userId) {
    try {
      const endpoint = `/permissions/user/${userId}`; 
      const response = await API.get(endpoint);
      return response;
    } catch (error) {
      console.error("Erreur lors de la récupération des permissions de l'utilisateur", error);
      throw error;
    }
  }
}

export default Permission;
