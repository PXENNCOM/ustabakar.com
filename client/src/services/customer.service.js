import api, { blobApi } from './api';

export const customerService = {
  getRequests: (params) => api.get('/customer/requests', { params }),
  getRequest: (id) => api.get(`/customer/requests/${id}`),
  createRequest: (formData) => api.post('/customer/requests', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getProfile: () => api.get('/customer/profile'),
  createTicket: (message) => api.post('/customer/profile/ticket', { message }),
  downloadPdf: (requestId) => blobApi.get(`/customer/requests/${requestId}/pdf`),
};
