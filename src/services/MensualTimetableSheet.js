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
            if (response) {
                return response; 
            }
            return this.mockData();
        } catch (error) {
            console.error("Erreur lors de la récupération des fiches mensuelles", error);
            return this.mockData();
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
            return this.mockData();
        }
    }

    static mockData() {
        return [
            {
                id_timetable: 1,
                id_user: 1,
                month: 'Janvier',
                year: 2025,
                comment: 'À valider',
                commission: 100,
                status: 'À compléter',
                daily_timetable_sheets: [
                    ...Array.from({ length: 31 }, (_, day) => ({
                        id_daily_timetable: day + 1,
                        id_timetable: 1,
                        day: day + 1,
                        year: 2025,
                        status: day % 2 === 0 ? 'Travaillé' : 'Weekend-end',
                        comment: day % 2 === 0 ? 'RAS' : 'Manque d\'informations',
                        on_call_duty: day % 5 === 0,
                        is_completed : day % 4 === 0 ? true : false
                    }))
                ]
            },
            {
                id_timetable: 2,
                id_user: 1,
                month: 'Décembre',
                year: 2024,
                comment: 'En attente d\'approbtion',
                commission: 200,
                status: 'En attente d\'approbation',
                daily_timetable_sheets: [
                    ...Array.from({ length: 31 }, (_, day) => ({
                        id_daily_timetable: day + 1,
                        id_timetable: 2,
                        day: day + 1,
                        year: 2024,
                        status: day % 3 === 0 ? 'Férié' : 'Congés payés',
                        comment: day % 3 === 0 ? 'Vérifié' : 'Attente de vérification',
                        on_call_duty: day % 7 === 0,
                        is_completed : day % 4 === 0 ? true : false
                    }))
                ]
            },
            {
                id_timetable: 3,
                id_user: 1,
                month: 'Novembre',
                year: 2024,
                comment: 'Acceptée',
                commission: 10,
                status: 'Validée',
                daily_timetable_sheets: [
                    ...Array.from({ length: 30 }, (_, day) => ({
                        id_daily_timetable: day + 1,
                        id_timetable: 3,
                        day: day + 1,
                        year: 2024,
                        status: day % 4 === 0 ? 'Arrêt maladie' : 'Congés sans solde',
                        comment: day % 4 === 0 ? 'Approuvé' : 'RAS',
                        on_call_duty: day % 6 === 0,
                        is_completed : day % 4 === 0 ? true : false,
                    }))
                ]
            }
        ];
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
