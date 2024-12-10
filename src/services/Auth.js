import axios from "axios";
import { store } from '../redux/store'; 
import { login, logout } from '../redux/authSlice';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

class Auth {

    static async login(email, password) {
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });

            const { user, token } = response.data;

            if (user && token) {
                store.dispatch(login({ user, token })); 
                return response.data; 
            } else {
                throw new Error("Invalid login response");
            }
        } catch (error) {
            console.error("Erreur lors de la connexion :", error);
            throw new Error("Impossible de se connecter, vérifiez vos identifiants.");
        }
    }

    static async logout() {
        try {
            await axios.post(`${API_BASE_URL}/auth/logout`);

            store.dispatch(logout());
        } catch (error) {
            console.error("Erreur lors de la déconnexion :", error);
            throw new Error("Erreur lors de la déconnexion.");
        }
    }
}

export default Auth;
