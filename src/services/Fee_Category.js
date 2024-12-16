import API from "./API";

class Fee_Category {

    static async fetchFeeCategoryById(id_fee_category) {
        try {
            const endpoint = `/fee-categories/${id_fee_category}`;
            const response = await API.get(endpoint);
            return response; 
        } catch (error) {
            console.error("Erreur lors de la récupération des fiches mensuelles", error);
            return this.mockData();
        }
    }
    
}

export default Fee_Category;
