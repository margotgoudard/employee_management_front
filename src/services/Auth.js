import axios from "axios";
import { store } from '../redux/store'; 
import { login, logout } from '../redux/authSlice';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

class Auth {

    static async login(email, password) {
        try {
            if (email === 'm@m.com' && password === 'm') {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
    
                const mockUser = {
                    id_user: 1,
                    first_name: "John",
                    last_name: "Doe",
                    role: "User",
                    email: "john.doe@example.com",
                    phone: "+33 6 12 34 56 78",
                    password: "securepassword123",
                    num_address: 123,
                    street_address: "Rue de la Paix",
                    city_address: "Paris",
                    area_code_address: "75002",
                    region_address: "Île-de-France",
                    country_address: "France",
                    is_admin: false,
                    is_sup_admin: false,
                    last_connected: new Date().toISOString(),
                  };                  
    
                const mockToken = "mock-token-123456";
    
                store.dispatch(login({ user: mockUser, token: mockToken }));
                return { user: mockUser, token: mockToken };
            }
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
