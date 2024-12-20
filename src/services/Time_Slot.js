import API from "./API";

class Time_Slot {

    static async getTimeSlotsByDailyTimetable(id_daily_timetable) {
        const endpoint = `/time-slots/timesheet/${id_daily_timetable}`;
        const response = await API.get(endpoint);
        return response; 
    }

    static async createTimeSlot(time_slot) {
        try {
            const endpoint = `/time-slots`;
            const response = await API.post(endpoint, time_slot);
            return response.data; 
        } catch (error) {
            console.error('Error adding time slot:', error);
            throw error; 
        }
    }

    static async deleteTimeSlot(id_time_slot) {
        try {
            const endpoint = `/time-slots/${id_time_slot}`
            const response = await API.delete(endpoint);
            return response.data;
        } catch (error) {
            console.error('Error deleting time slot:', error);
            throw error;
        }
    }

    static async updateTimeSlot(time_slot) {
        try {
            const endpoint = `/time-slots/${time_slot.id_time_slot}`;
            const response = await API.put(endpoint, time_slot);
            return response.data; 
        } catch (error) {
            console.error('Error updating time slot:', error);
            throw error; 
        }
    }

}
      
export default Time_Slot;