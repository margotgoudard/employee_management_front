import API from "./API";

const ExpenseReportService = {

    async getExpenseReportsByMensualTimetable(id_timetable) {
        const endpoint = `/expense-reports/mensual/${id_timetable}`;
        const response = await API.get(endpoint);
        return response; 
    },

    async getExpenseReportsByDailyTimetable(id_daily_timetable) {
        const endpoint = `/expense-reports/daily/${id_daily_timetable}`;
        const response = await API.get(endpoint);
        return response; 
    },

    async createExpenseReport(expense_report) {
        try {
            const endpoint = `/expense-reports`;
            const response = await API.post(endpoint, expense_report);
            return response.data; 
        } catch (error) {
            console.error('Error adding expense report:', error);
            throw error; 
        }
    },

    async deleteExpenseReport(id_expense_report) {
        try {
            const endpoint = `/expense-reports/${id_expense_report}`
            const response = await API.delete(endpoint);
            return response.data;
        } catch (error) {
            console.error('Error deleting expense report:', error);
            throw error;
        }
    },

    async updateExpenseReport(expense_report) {
        const endpoint = `/expense-reports/${expense_report.id_expense_report}`;
        await API.put(endpoint, expense_report);
        const response = await API.get(endpoint); 
        return response;
    }
}
      
export default ExpenseReportService;