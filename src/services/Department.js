import API from "./API";

class Department {

    static async fetchDepartmentByUserId(id_user) {
        try {
            const endpoint = `/subordinations/departments/${id_user}`;
            const response = await API.get(endpoint);
            return response.subordinates; 
        } catch (error) {
            console.error("Erreur lors de la récupération des départements", error);
        }
    }

    static async fetchSubordinatesByManagerAndDepartment(id_user, id_department) {
        try {
            const endpoint = `/subordinations/subordinates/${id_user}/${id_department}`;
            const response = await API.get(endpoint);
            return response.subordinates; 
        } catch (error) {
            console.error("Erreur lors de la récupération des subordinates", error);
        }
    }
}

export default Department;
