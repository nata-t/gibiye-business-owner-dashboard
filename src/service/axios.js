import axios from 'axios';
import Cookies from 'js-cookie';

axios.default.baseURL = 'http://localhost:3000';

export const HTTP = axios.create({
    baseURL: `http://localhost:3000`,
    headers: {
        Authorization: await Cookies.get('loggedUser')
    }
});

HTTP.interceptors.request.use(async (config) => {
    const loggedUser = await Cookies.get('loggedUser');
    config.headers.Authorization = loggedUser;
    return config;
});
