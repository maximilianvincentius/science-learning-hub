import axios from 'axios';

import { authService } from '../services';

const { getAccessToken } = authService;

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
  withCredentials: true,
  requiresAuth: true
});

api.interceptors.request.use(async (config) => {
  if (!config.requiresAuth) {
    return config;
  }

  let token = getAccessToken();
  if (token) {
    config.headers.Authorization = `${token}`;
  }

  return config;
});

export default api;
