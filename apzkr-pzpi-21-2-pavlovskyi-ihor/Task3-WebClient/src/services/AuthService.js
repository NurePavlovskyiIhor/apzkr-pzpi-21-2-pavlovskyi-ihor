// src/services/AuthService.js
import apiInstance from './ApiService';

export const register = async (userData) => {
    try {
        const response = await apiInstance.post('/api/users', userData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const login = async (credentials) => {
    try {
        const response = await apiInstance.post('/api/users/login', credentials);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const logout = async () => {
    try {
        const response = await apiInstance.post('/api/users/logout');
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};