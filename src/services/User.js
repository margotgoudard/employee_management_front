import API from "./API";
import { updateUser } from "../redux/authSlice";
import { store } from "../redux/store";

class User {

  static async update(user) {
    const endpoint = `/users/${user.id_user}`;
    try {
      await API.put(endpoint, user); 
      const response = await API.get(endpoint); 
      const currentUser = store.getState().auth.user;
      
      if(currentUser.id_user === user.id_user){
        store.dispatch(updateUser(response.data));
      }

      return response.data; 
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
      throw error; 
    }
  }

  static async checkManagerAccess(id_manager, id_user) {
    try {
      const endpoint = `/users/check-manager/${id_manager}/${id_user}`;
      const response = await API.get(endpoint);
      return response;
    } catch (error) {
      console.error("Erreur lors de la vérification des permissions :", error);
      throw error; 
    }
  }

  static async ChangePassword(user, newPassword, confirmationPassword) {
    try {
    const endpoint = `/users/${user.id_user}/password`;
    const data = {
      newPassword: newPassword,
      confirmationPassword: confirmationPassword,
    };
    await API.put(endpoint, data);
  } catch (error) {
    console.error("Erreur lors de la modification du mot de passe :", error);
    throw error; 
  }
  }

  static async fetchUser(id_user) {
    const endpoint = `/users/${id_user}`;
    try {
      const response = await API.get(endpoint);
      return response; 
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur :", error);
      throw error; 
    }
  }
  static async createUser(user, id_manager) {
    try {
        const endpoint = `/users/${id_manager}`;
        const response = await API.post(endpoint, user);
        return response.data; 
    } catch (error) {
        console.error('Error adding user:', error);
        throw error; 
    }
}
}

export default User;
