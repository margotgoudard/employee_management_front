import API from "./API";

class Department {

    static async fetchDepartmentById(id_department) {
        try {
            const endpoint = `/departments/${id_department}`;
            const response = await API.get(endpoint);
            return response; 
        } catch (error) {
            console.error("Erreur lors de la récupération du département", error);
        }
    }

    static async fetchAllSubordinatesByManager(id_user) {
        try {
            const endpoint = `/subordinations/all-subordinates/${id_user}`;
            const response = await API.get(endpoint);
            return response; 
        } catch (error) {
            console.error("Erreur lors de la récupération des subordinates", error);
        }
    }
}

export default Department;
