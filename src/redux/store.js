import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import timetableReducer from './timetableSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    timetable: timetableReducer, 
  },
});
