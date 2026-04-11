import axios from 'axios';

const api = axios.create({
  baseURL: process.env.DEV ? 'http://localhost:8000/api' : 'https://api.sigeth.xpertiaplus.com/api',
  timeout: 10000,
});

// Interceptor to add Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sigeth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle global errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // No redirigir al login si la petición es del portal de onboarding
      const requestUrl = error.config?.url || ''
      if (!requestUrl.includes('/portal/')) {
        localStorage.removeItem('sigeth_token');
        localStorage.removeItem('sigeth_user');
        window.location.href = '#/login'; // Hash router usually
      }
    }
    return Promise.reject(error);
  }
);

export default api;
