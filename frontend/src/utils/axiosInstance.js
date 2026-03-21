import axios from 'axios';

const server = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
    baseURL: server,
    withCredentials: true, // Crucial for sending/receiving cookies
});

// Optional: Add request interceptor to attach token from localStorage if cookie is blocked
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        // You can also add it to headers if needed, e.g., config.headers.Authorization = `Bearer ${token}`;
        // But for this project, we primarily use query params or cookies.
        // We'll let the routers handle merging token from query/cookie.
        
        // If the request is a GET, we can automatically add token to params if missing
        if (config.method === 'get') {
            config.params = {
                token: token,
                ...config.params
            };
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default axiosInstance;
