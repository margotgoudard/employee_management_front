import API from "./API";

class ExpenseReportService {

    static async getExpenseReportsByMensualTimetable(id_timetable) {
        const endpoint = `/expense-reports/mensual/${id_timetable}`;
        const response = await API.get(endpoint);
        return response; 
    }

    static async getExpenseReportsByDailyTimetable(id_daily_timetable) {
        const endpoint = `/expense-reports/daily/${id_daily_timetable}`;
        const response = await API.get(endpoint);
        return response; 
    }

    static async createExpenseReport(expense_report) {
        try {
            const endpoint = `/expense-reports`;
            const formData = new FormData();
            formData.append("id_daily_timetable", expense_report.id_daily_timetable);
            formData.append("id_fee_category", expense_report.id_fee_category);
            formData.append("amount", expense_report.amount);
            formData.append("client", expense_report.client);
            formData.append("motive", expense_report.motive);
    
            if (expense_report.document) {
                formData.append("document", expense_report.document);
                formData.append("document_name", expense_report.document_name);
            }
            const response = await API.post(endpoint, formData);
            return response.data;
        } catch (error) {
            console.error('Error adding expense report:', error);
            throw error;
        }
    }    

    static async deleteExpenseReport(id_expense_report) {
        try {
            const endpoint = `/expense-reports/${id_expense_report}`
            const response = await API.delete(endpoint);
            return response.data;
        } catch (error) {
            console.error('Error deleting expense report:', error);
            throw error;
        }
    }

    static async updateExpenseReport(expense_report) {
        const endpoint = `/expense-reports/${expense_report.id_expense_report}`;
        await API.put(endpoint, expense_report);
        const response = await API.get(endpoint); 
        return response;
    }
}
      
export default ExpenseReportService;