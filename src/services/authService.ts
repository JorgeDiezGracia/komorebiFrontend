import api from './api.ts';

export const register = (username:string, password:string, role:string) => {
  return api.post('/auth/register', { username, password, role });
};

export const login = (username: string, password: string) => {
  return api.post('/auth/login', { username, password });
};