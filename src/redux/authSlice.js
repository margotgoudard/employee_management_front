import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token; 
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
    updateUser: (state, action) => {
        state.user = { ...state.user, ...action.payload };
    },
  },
});

export const { login, logout, updateUser } = authSlice.actions; 

export default authSlice.reducer;
