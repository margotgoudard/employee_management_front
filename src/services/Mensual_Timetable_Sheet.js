import API from "./API";

class Mensual_Timetable_Sheet {

    static async fetchMensualTimetable(id_user) {
        try {
            const endpoint = `/mensual_timetable_sheet/user/${id_user}`;
            const response = await API.get(endpoint);
            if (response && response.data) {
                return response.data; 
            }
            return this.mockData();
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
                commission: 'HR',
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
                        isCompleted : day % 4 === 0 ? true : false
                    }))
                ]
            },
            {
                id_timetable: 2,
                id_user: 1,
                month: 'Décembre',
                year: 2024,
                comment: 'En attente d\'approbtion',
                commission: 'HR',
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
                        isCompleted : day % 4 === 0 ? true : false
                    }))
                ]
            },
            {
                id_timetable: 3,
                id_user: 1,
                month: 'Novembre',
                year: 2024,
                comment: 'Acceptée',
                commission: 'Finance',
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
                        isCompleted : day % 4 === 0 ? true : false,
                    }))
                ]
            }
        ];
    }
}

export default Mensual_Timetable_Sheet;
