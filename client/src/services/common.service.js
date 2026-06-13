import api from './api';

export const commonService = {
  getCities: () => api.get('/common/cities'),
  getDistricts: (cityId) => api.get(`/common/cities/${cityId}/districts`),
  getPackages: () => api.get('/common/packages'),
  getExpertises: () => api.get('/common/expertises'),
  getReportCategories: (packageId) => api.get('/common/report-categories', {
    params: packageId ? { package_id: packageId } : {},
  }),
  getBrands: () => api.get('/common/brands'),
  getModelsByBrand: (markaKodu) => api.get(`/common/models/${markaKodu}`),
  getYearsByModel: (modelKodu) => api.get(`/common/years/${modelKodu}`),
};
