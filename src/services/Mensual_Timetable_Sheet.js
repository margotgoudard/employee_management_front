import API from "./API";

class Mensual_Timetable_Sheet {

    static async fetchNotifications(id_user) {
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
            { id_timetable: 1, id_user: 1, month: 'Janvier', year: 2025, comment: 'À valider', commission: 'HR', status: 'À compléter' },
            { id_timetable: 2, id_user: 1, month: 'Décembre', year: 2024, comment: 'En attente d\'approbtion', commission: 'HR', status: 'En attente d\'approbation' },
            { id_timetable: 3, id_user: 1, month: 'Novembre', year: 2024, comment: 'Acceptée', commission: 'Finance', status: 'Validée' },
        ];
    }
}

export default Mensual_Timetable_Sheet;
