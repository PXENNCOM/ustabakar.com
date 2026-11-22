import api from './api';

export const authService = {
  sendOtp: (data) => api.post('/auth/otp/send', data),
  adminLogin: (data) => api.post('/auth/admin/login', data),
  customerLogin: (data) => api.post('/auth/customer/login', data),
  customerRegister: (data) => api.post('/auth/customer/register', data),
  masterLogin: (data) => api.post('/auth/master/login', data),
  masterRegister: (data) => api.post('/auth/master/register', data),
};