import API from "./API";

class ComplianceCheck {

 static async fetchComplianceCheckResult(id_timetable) {
        try {
            const endpoint = `/compliance-checks/mensual/${id_timetable}`;
            const response = await API.get(endpoint);
            if (response) {
                return response; 
            }
            return this.mockData();
        } catch (error) {
            console.error("Erreur lors de la compliance check", error);
            return this.mockData();
        }
    }

}

export default ComplianceCheck;
