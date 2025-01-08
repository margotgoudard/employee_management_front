import API from "./API";

class Department {

    static async fetchDepartmentByUserId(id_user) {
        try {
            const endpoint = `/subordinations/departments/${id_user}`;
            const response = await API.get(endpoint);
            return response; 
        } catch (error) {
            console.error("Erreur lors de la récupération des départements", error);
        }
    }
}

export default Department;
