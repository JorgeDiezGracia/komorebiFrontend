import api from './api';

export const register = (username, password, role) => {
  return api.post('/auth/register', { username, password, role });
};

export const login = (username, password) => {
  return api.post('/auth/login', { username, password });
};