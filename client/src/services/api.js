import axios from 'axios';

const createInstance = (extra = {}) => {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
    timeout: 60000,
    ...extra,
  });

  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  instance.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err.response?.status === 401) {
        const currentPath = window.location.pathname;
        const publicPaths = ['/giris', '/kayit', '/usta/giris', '/usta/basvuru', '/admin/giris'];
        if (!publicPaths.includes(currentPath)) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/giris';
        }
      }
      return Promise.reject(err);
    }
  );

  return instance;
};

const api = createInstance();
export const blobApi = createInstance({ responseType: 'blob' });

export default api;