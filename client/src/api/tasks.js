import api from './axios';

export const getTasks = (boardId) => api.get(`/boards/${boardId}/tasks`);
export const createTask = (boardId, data) => api.post(`/boards/${boardId}/tasks`, data);
export const updateTask = (boardId, taskId, data) => api.patch(`/boards/${boardId}/tasks/${taskId}`, data);
export const deleteTask = (boardId, taskId) => api.delete(`/boards/${boardId}/tasks/${taskId}`);