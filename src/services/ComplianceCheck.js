import API from "./API";

class ComplianceCheck {

    static async fetchComplianceCheckResult(id_timetable) {
        try {
            const endpoint = `/compliance-checks/mensual/${id_timetable}`;
            const response = await API.get(endpoint);
            return response; 
            
        } catch (error) {
            console.error("Erreur lors de la compliance check", error);
        }
    }

    static async fetchWeeklyHours(id_timetable) {
        try {
            const endpoint = `/compliance-checks/weekly-hours/${id_timetable}`;
            const response = await API.get(endpoint);
            return response; 
            
        } catch (error) {
            console.error("Erreur lors de la compliance check", error);
        }
    }

}

export default ComplianceCheck;
