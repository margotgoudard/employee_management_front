import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import timetableReducer from './timetableSlice';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Utiliser localStorage

// Configuration de redux-persist pour le reducer auth
const authPersistConfig = {
  key: 'auth',  
  storage,      
  whitelist: ['token', 'user'],  
};
const timetablePersistConfig = {
  key: 'timetable',
  storage,
  whitelist: ['selectedTimetable', 'timetables'],  // Choisir ce que tu veux persister
};




// Reducer avec persistance
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedTimetableReducer = persistReducer(timetablePersistConfig, timetableReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,  
    timetable: persistedTimetableReducer,
  },
});

// Créer le persistor qui s'occupe de la persistance
export const persistor = persistStore(store);
