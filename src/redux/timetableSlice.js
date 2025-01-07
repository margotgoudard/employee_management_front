import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedTimetable: null,  
  timetables: [],          
};

const timetableSlice = createSlice({
  name: 'timetable',
  initialState,
  reducers: {
    setTimetables: (state, action) => {
      state.timetables = action.payload;
    },
    setSelectedTimetable: (state, action) => {
      state.selectedTimetable = action.payload;
    },
    updateDailyTimetables: (state, action) => {
      if (state.selectedTimetable) {
        state.selectedTimetable.daily_timetable_sheets = action.payload;
      }
    },
  },
});

export const { setTimetables, setSelectedTimetable, updateDailyTimetables } = timetableSlice.actions;
export default timetableSlice.reducer;