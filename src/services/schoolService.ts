import api from './api';

export const getSchools = (name?: string, city?: string) => {
  return api.get('/schools', { params: { name, city } });
};

export const getSchoolById = (id: number) => {
  return api.get(`/schools/${id}`);
};

export const createSchool = (data: object) => {
  return api.post('/schools', data);
};

export const updateSchool = (id: number, data: object) => {
  return api.put(`/schools/${id}`, data);
};

export const deleteSchool = (id: number) => {
  return api.delete(`/schools/${id}`);
};