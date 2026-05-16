import api from './api';

export const getUserCount = () => {
  return api.get('/users/count');
};