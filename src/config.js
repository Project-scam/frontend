const isDevelopment = import.meta.env.MODE === 'development';

export const API_BASE_URL = isDevelopment
    ? "http://localhost:3000"
    : "https://backend-21ia.onrender.com";


export const API_URLS = {
    LOGIN: `${API_BASE_URL}/login`,
    VERIFY: `${API_BASE_URL}/login/verify`,
    REGISTER: `${API_BASE_URL}/register`,
    USER_LIST: `${API_BASE_URL}/utenti`,
    LOGOUT: `${API_BASE_URL}/logout`
};
