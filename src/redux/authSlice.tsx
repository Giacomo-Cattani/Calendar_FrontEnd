// src/redux/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    isAuthenticated: boolean;
}

const storedAuth = localStorage.getItem('isAuthenticated');

const initialState: AuthState = storedAuth
    ? { isAuthenticated: JSON.parse(storedAuth) }
    : { isAuthenticated: false };

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess(state) {
            state.isAuthenticated = true;
            localStorage.setItem('isAuthenticated', JSON.stringify(true));
        },
        logout(state) {
            state.isAuthenticated = false;
            localStorage.setItem('isAuthenticated', JSON.stringify(false));
        },
    },
});

export const { loginSuccess, logout } = authSlice.actions;

export default authSlice.reducer;
