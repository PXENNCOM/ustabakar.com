import api, { blobApi } from './api';

export const adminService = {
  // Talepler
  getRequests: (params) => api.get('/admin/requests', { params }),
  getRequest: (id) => api.get(`/admin/requests/${id}`),
  assignMaster: (id, master_id) => api.post(`/admin/requests/${id}/assign-master`, { master_id }),
  cancelAssignment: (id, reason) => api.post(`/admin/requests/${id}/cancel-assignment`, { reason }),

  // Ustalar
  getMasters: (params) => api.get('/admin/masters', { params }),
  getMaster: (id) => api.get(`/admin/masters/${id}`),
  getApplications: (params) => api.get('/admin/masters/applications', { params }),
  createMaster: (data) => api.post('/admin/masters', data),
  approveMaster: (id) => api.post(`/admin/masters/${id}/approve`),
  rejectMaster: (id) => api.post(`/admin/masters/${id}/reject`),
  deactivateMaster: (id) => api.post(`/admin/masters/${id}/deactivate`),
  activateMaster: (id) => api.post(`/admin/masters/${id}/activate`),
  removeMaster: (id) => api.delete(`/admin/masters/${id}`),
  markMasterPaid: (id) => api.post(`/admin/masters/${id}/pay`),

  // Raporlar
  getReports: (params) => api.get('/admin/reports', { params }),
  getReport: (id) => api.get(`/admin/reports/${id}`),
  downloadReportPdf: (id) => blobApi.get(`/admin/reports/${id}/pdf`),

  // Tickets
  getTickets: (params) => api.get('/admin/tickets', { params }),
  getTicket: (id) => api.get(`/admin/tickets/${id}`),
  closeTicket: (id, admin_note) => api.post(`/admin/tickets/${id}/close`, { admin_note }),

  // Ayarlar - Genel
  getSettings: () => api.get('/admin/settings'),
  updateSetting: (key, value) => api.put(`/admin/settings/${key}`, { value }),

  // Ayarlar - Kategoriler
  getCategories: () => api.get('/admin/settings/report-categories'),
  createCategory: (data) => api.post('/admin/settings/report-categories', data),
  updateCategory: (id, data) => api.put(`/admin/settings/report-categories/${id}`, data),
  getQuestions: (catId) => api.get(`/admin/settings/report-categories/${catId}/questions`),
  createQuestion: (catId, data) => api.post(`/admin/settings/report-categories/${catId}/questions`, data),
  updateQuestion: (id, data) => api.put(`/admin/settings/questions/${id}`, data),
  getOptions: (qId) => api.get(`/admin/settings/questions/${qId}/options`),
  createOption: (qId, data) => api.post(`/admin/settings/questions/${qId}/options`, data),
  deleteOption: (id) => api.delete(`/admin/settings/options/${id}`),

  // Ayarlar - Paketler
  getPackages: () => api.get('/admin/settings/packages'),
  createPackage: (data) => api.post('/admin/settings/packages', data),
  updatePackage: (id, data) => api.put(`/admin/settings/packages/${id}`, data),

  // Ayarlar - Uzmanlık
  getExpertises: () => api.get('/admin/settings/expertises'),
  createExpertise: (data) => api.post('/admin/settings/expertises', data),
  updateExpertise: (id, data) => api.put(`/admin/settings/expertises/${id}`, data),

  // Ayarlar - Araç Yönetimi
  listBrands: (params) => api.get('/admin/settings/brands', { params }),
  createBrand: (data) => api.post('/admin/settings/brands', data),
  updateBrand: (id, data) => api.put(`/admin/settings/brands/${id}`, data),
  listModels: (markaKodu) => api.get(`/admin/settings/brands/${markaKodu}/models`),
  createModel: (markaKodu, data) => api.post(`/admin/settings/brands/${markaKodu}/models`, data),
  updateModel: (id, data) => api.put(`/admin/settings/models/${id}`, data),
  listYears: (modelKodu) => api.get(`/admin/settings/models/${modelKodu}/years`),
  createYear: (modelKodu, data) => api.post(`/admin/settings/models/${modelKodu}/years`, data),
  deleteYear: (id) => api.delete(`/admin/settings/years/${id}`),
};
