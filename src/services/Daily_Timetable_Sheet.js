import API from "./API";

class Daily_Timetable_Sheet {

    static async fetchWorkedHoursByDailyTimetable(id_daily_timetable) {
        try {
            const endpoint = `/daily-timetable-sheets/number-worked/${id_daily_timetable}`;
            const response = await API.get(endpoint);
            if (response) {
                return response; 
            }
            return this.mockData();
        } catch (error) {
            console.error("Erreur lors de la récupération des fiches mensuelles", error);
            return this.mockData();
        }
    }

    static async fetchDailyTimetableByMensualTimetable(id_timetable) {
        try {
            const endpoint = `/daily-timetable-sheets/mensual/${id_timetable}`;
            const response = await API.get(endpoint);
            if (response) {
                return response; 
            }
            return this.mockData();
        } catch (error) {
            console.error("Erreur lors de la récupération des fiches mensuelles", error);
            return this.mockData();
        }
    }

    static async fetchDailyTimetableById(id_daily_timetable) {
        try {
            const endpoint = `/daily-timetable-sheets/${id_daily_timetable}`;
            const response = await API.get(endpoint);
            return response; 
        } catch (error) {
            console.error("Erreur lors de la récupération des fiches mensuelles", error);
            return this.mockData();
        }
    }

    static mockData() {    
        return {
                id_daily_timetable: 1,
                worked_hours: Math.floor(Math.random() * 9)
            };
    }
    
}

export default Daily_Timetable_Sheet;
