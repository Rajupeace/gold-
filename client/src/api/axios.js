import axios from '@/api/axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://gold-backend-ob9o.onrender.com';

const instance = axios.create({
    baseURL: API_URL
});

export default instance;
