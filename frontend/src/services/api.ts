import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
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