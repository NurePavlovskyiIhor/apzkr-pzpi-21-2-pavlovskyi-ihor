// src/services/ApiService.js
import axios from 'axios';
import config from '../config.json';

const apiInstance = axios.create({
    baseURL: config.API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
    },
});

export default apiInstance;