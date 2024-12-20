import API from "./API";

class Fee_Category {

    static async fetchFeeCategoryById(id_fee_category) {
        try {
            const endpoint = `/fee-categories/${id_fee_category}`;
            const response = await API.get(endpoint);
            return response; 
        } catch (error) {
            console.error("Erreur lors de la récupération de la categorie de frais", error);
            return this.mockData();
        }
    }

    static async createFeeCategory(fee_category) {
        try {
            const endpoint = `/fee-categories`;
            const response = await API.post(endpoint, fee_category);
            return response.feeCategory; 
        } catch (error) {
            console.error('Error adding fee category:', error);
            throw error; 
        }
    }

    static async fetchFeeCategories() {
        try {
            const endpoint = `/fee-categories`;
            const response = await API.get(endpoint);
            return response; 
        } catch (error) {
            console.error("Erreur lors de la récupération des catégories de frais", error);
            return this.mockData();
        }
    }
    
}

export default Fee_Category;
