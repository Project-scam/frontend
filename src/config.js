const isDevelopment = import.meta.env.MODE === 'development';

const API_BASE_URL = isDevelopment
    ? "http://localhost:3000"
    : "https://backend-snowy-mu-43.vercel.app";

export const API_URLS = {
    LOGIN: `${API_BASE_URL}/login`,
    REGISTER: `${API_BASE_URL}/register`,
    USER_LIST: `${API_BASE_URL}/utenti`
};
