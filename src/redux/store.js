import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 
import authReducer from './authSlice';
import timetableReducer from './timetableSlice';
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

const authPersistConfig = {
  key: 'auth',  
  storage,      
  whitelist: ['token', 'user'],  
};

const timetablePersistConfig = {
  key: 'timetable',
  storage,
  whitelist: ['selectedTimetable', 'timetables'],  
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedTimetableReducer = persistReducer(timetablePersistConfig, timetableReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,  
    timetable: persistedTimetableReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER], 
      },
    }),
});

export const persistor = persistStore(store);
