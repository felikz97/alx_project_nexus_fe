// /utils/api.ts
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api/',
  withCredentials: true, // if using session auth/cookies
});

export const getUsers = () => API.get('/users/');
export const updateUser = (id: number, data: any) => API.put(`/users/${id}/`, data);
