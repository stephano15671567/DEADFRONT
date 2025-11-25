import axios from 'axios';

// If running in the browser prefer an env-provided public URL or a relative `/api` path.
// On the server (SSR) we default to the backend address used in development.
const isBrowser = typeof window !== 'undefined';
const DEFAULT_SERVER_API = 'http://localhost:3002/api';
// In the browser we prefer an explicit backend address in development to avoid
// Next.js dev server capturing `/api` routes (which would return 404).
const BASE = process.env.NEXT_PUBLIC_API_URL || DEFAULT_SERVER_API;

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

// Helpful response interceptor to normalize errors for the UI
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Map common network/HTTP errors to a friendlier shape
    if (error.response) {
      // Server responded with a status outside 2xx
      const status = error.response.status;
      const message = error.response.data?.error || error.response.data?.message || error.message;
      return Promise.reject(new Error(`API Error (${status}): ${message}`));
    }
    if (error.request) {
      // Request made but no response
      return Promise.reject(new Error('Network Error: no response from server'));
    }
    return Promise.reject(error);
  }
);