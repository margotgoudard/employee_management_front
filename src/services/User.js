import API from "./API";
import { updateUser } from "../redux/authSlice";
import { store } from "../redux/store";

class User {
  static async update(user) {
    const endpoint = `/users/${user.id_user}`;

    try {
      await API.put(endpoint, user); 
      const response = await API.get(endpoint); 

      store.dispatch(updateUser(response.data));

      return response.data; 
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
      throw error; 
    }
  }
}

export default User;
