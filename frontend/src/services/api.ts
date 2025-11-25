import axios from 'axios';

// If running in the browser prefer an env-provided public URL or a relative `/api` path.
// On the server (SSR) we default to the backend address used in development.
const isBrowser = typeof window !== 'undefined';
const DEFAULT_SERVER_API = 'http://localhost:3002/api';
const BASE = isBrowser
  ? (process.env.NEXT_PUBLIC_API_URL || '/api')
  : (process.env.NEXT_PUBLIC_API_URL || DEFAULT_SERVER_API);

const api = axios.create({
  baseURL: BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para inyectar el Token de Keycloak
api.interceptors.request.use((config) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = window.localStorage.getItem('kc_token');
      if (token) config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
    }
  } catch (err) {
    // If access to localStorage fails (SSR or strict browsers), continue without token
    // This prevents runtime errors that surface as network failures in the client.
    // eslint-disable-next-line no-console
    console.warn('Could not read localStorage for auth token:', err?.message || err);
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;