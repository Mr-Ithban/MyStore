import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('localrate_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const url: string = error.config?.url ?? '';
      // Only clear the session when the token itself is rejected during
      // the /auth/me session-refresh check. For every other 401 (e.g. a
      // protected endpoint the landing page hits before the user logs in)
      // we leave the token alone so the user stays logged in.
      if (url.includes('/auth/me')) {
        localStorage.removeItem('localrate_token');
        localStorage.removeItem('localrate_user');
      }
    }
    return Promise.reject(error);
  },
);
