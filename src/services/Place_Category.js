import API from "./API";

class Place_Category {

    static async fetchPlaceCategories() {
        try {
            const endpoint = `/place-categories`;
            const response = await API.get(endpoint);
            return response; 
        } catch (error) {
            console.error("Erreur lors de la récupération des catégories", error);
        }
    }
    
}

export default Place_Category;
