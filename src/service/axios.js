import axios from 'axios';
import Cookies from 'js-cookie';

axios.default.baseURL = 'http://localhost:3000';

export const HTTP = axios.create({
    baseURL: `http://localhost:3000`,
    headers: {
        Authorization: Cookies.get('token')
    }
});

HTTP.interceptors.request.use((config) => {
    config.headers.Authorization = Cookies.get('token');
    return config;
});
