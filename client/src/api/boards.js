import api from './axios';

export const getBoards = () => api.get('/boards');
export const createBoard = (data) => api.post('/boards', data);
export const getBoardById = (id) => api.get(`/boards/${id}`);
export const deleteBoard = (id) => api.delete(`/boards/${id}`);