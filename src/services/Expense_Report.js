import API from "./API";

const ExpenseReportService = {

    async getExpenseReportsByMensualTimetable(id_timetable) {
        const endpoint = `/expense-reports/mensual/${id_timetable}`;
        const response = await API.get(endpoint);
        return response; 
    }

}
      
export default ExpenseReportService;