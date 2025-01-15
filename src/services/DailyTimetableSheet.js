import API from "./API";

class DailyTimetableSheet {

    static async fetchWorkedHoursByDailyTimetable(id_daily_timetable) {
        try {
            const endpoint = `/daily-timetable-sheets/number-worked/${id_daily_timetable}`;
            const response = await API.get(endpoint);
            return response; 
        } catch (error) {
            console.error("Erreur lors de la récupération des fiches mensuelles", error);
        }
    }

    static async fetchDailyTimetableByMensualTimetable(id_timetable) {
        try {
            const endpoint = `/daily-timetable-sheets/mensual/${id_timetable}`;
            const response = await API.get(endpoint);
            return response; 
        
        } catch (error) {
            console.error("Erreur lors de la récupération des fiches mensuelles", error);
        }
    }

    static async fetchDailyTimetableById(id_daily_timetable) {
        try {
            const endpoint = `/daily-timetable-sheets/${id_daily_timetable}`;
            const response = await API.get(endpoint);
            return response; 
        } catch (error) {
            console.error("Erreur lors de la récupération des fiches mensuelles", error);
        }
    }

    static async updateDailyTimetable(daily_timetable) {
        const endpoint = `/daily-timetable-sheets/${daily_timetable.id_daily_timetable}`;
        await API.put(endpoint, daily_timetable);
        const response = await API.get(endpoint); 
        return response;
    }
}

export default DailyTimetableSheet;
