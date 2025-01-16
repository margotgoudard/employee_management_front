import API from "./API";

class Permission {
    
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
