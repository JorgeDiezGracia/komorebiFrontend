import api from './api';

export const getProjects = (name?: string, description?: string) => {
  return api.get('/projects', { params: { name, description } });
};

export const getProjectById = (id: number) => {
  return api.get(`/projects/${id}`);
};

export const createProject = (schoolId: number, data: object) => {
  return api.post(`/schools/${schoolId}/projects`, data);
};

export const updateProject = (id: number, data: object) => {
  return api.put(`/projects/${id}`, data);
};

export const deleteProject = (id: number) => {
  return api.delete(`/projects/${id}`);
};