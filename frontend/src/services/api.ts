import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Apunta a tu Backend Express
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor (placeholder para futuro Keycloak)
api.interceptors.request.use((config) => {
  return config;
});

export default api;
