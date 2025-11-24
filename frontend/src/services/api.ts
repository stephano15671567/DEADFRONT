import axios from 'axios';

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';

const api = axios.create({
  baseURL: BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para inyectar el Token de Keycloak
api.interceptors.request.use((config) => {
  // Intentamos obtener el token guardado por el Provider
  const token = localStorage.getItem('kc_token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;