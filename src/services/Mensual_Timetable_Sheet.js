import API from "./API";

class Mensual_Timetable_Sheet {

    static async fetchNotifications(id_user) {
        try {
             const endpoint = `/mensual_timetable_sheet/user/${id_user}`;
             const response = await API.get(endpoint);
             return response;
         } catch (error) {
              throw new Error("Erreur lors de la récupération des fiches mensuelles");
         }
     }
}

export default Mensual_Timetable_Sheet;
