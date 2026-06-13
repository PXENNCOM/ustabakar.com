import api, { blobApi } from './api';

export const masterService = {
  getActiveAssignment: () => api.get('/master/assignments/active'),
  getAssignmentHistory: (params) => api.get('/master/assignments/history', { params }),
  getAssignment: (id) => api.get(`/master/assignments/${id}`),
  submitReport: (assignmentId, formData) => api.post(`/master/reports/${assignmentId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getEarnings: (params) => api.get('/master/earnings', { params }),
  getProfile: () => api.get('/master/profile'),
  createTicket: (message) => api.post('/master/profile/ticket', { message }),
  downloadPdf: (assignmentId) => blobApi.get(`/master/assignments/${assignmentId}/pdf`),
};
