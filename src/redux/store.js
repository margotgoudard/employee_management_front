import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Utiliser localStorage
import authReducer from './authSlice';
import timetableReducer from './timetableSlice';
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

// Configuration de redux-persist pour le reducer auth
const authPersistConfig = {
  key: 'auth',  
  storage,      
  whitelist: ['token', 'user'],  
};

// Configuration de redux-persist pour le reducer timetable
const timetablePersistConfig = {
  key: 'timetable',
  storage,
  whitelist: ['selectedTimetable', 'timetables'],  
};

// Reducers avec persistance
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
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER], // Ignorer les actions redux-persist
      },
    }),
});

// Créer le persistor qui s'occupe de la persistance
export const persistor = persistStore(store);
