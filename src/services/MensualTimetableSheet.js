import API from "./API";

class MensualTimetableSheet {

    static async updateMensualTimetable(mensual_timetable) {
        const endpoint = `/mensual-timetable-sheets/${mensual_timetable.id_timetable}`;
        await API.put(endpoint, mensual_timetable);
        const response = await API.get(endpoint); 
        return response;
    }

    static async fetchMensualTimetablesByUser(id_user) {
        try {
            const endpoint = `/mensual-timetable-sheets/user/${id_user}`;
            const response = await API.get(endpoint);
            return response;
        } catch (error) {
            console.error("Erreur lors de la récupération des fiches mensuelles", error);
        }
    }

    static async fetchMensualTimetable(id_timetable) {
        try {
            const endpoint = `/mensual-timetable-sheets/all-details-month/${id_timetable}`;
            const response = await API.get(endpoint);
            if (response) {
                return response; 
            }
            return {
                id_timetable: 1,
                id_user: 1,
                month: 'Janvier',
                year: 2024,
                comment: 'À valider',
                commission: 100,
                status: 'À compléter',
                daily_timetable_sheets: [
                    ...Array.from({ length: 31 }, (_, day) => ({
                        id_daily_timetable: day + 1,
                        id_timetable: 1,
                        day: day + 1,
                        year: 2024,
                        status: day % 2 === 0 ? 'Travaillé' : 'Weekend-end',
                        comment: day % 2 === 0 ? 'RAS' : 'Manque d\'informations',
                        on_call_duty: day % 5 === 0,
                        is_completed: day % 4 === 0,
                    }))
                ]
            };
        } catch (error) {
            console.error("Erreur lors de la récupération des fiches mensuelles", error);
        }
    }

    static async getMensualWorkedHours(id_timetable) {
        try {
            const endpoint = `/mensual-timetable-sheets/worked-hours/${id_timetable}`;
            const response = await API.get(endpoint);
            if (response) {
                return response; 
            }
            return 0;
        } catch (error) {
            console.error("Erreur lors de la récupération des heures travaillées", error);
            return 0;
        }
    }
}

export default MensualTimetableSheet;
