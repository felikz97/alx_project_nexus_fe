// /utils/api.ts
import axios from 'axios';

const API = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/`,
  withCredentials: true, // if using session auth/cookies
});

export const getUsers = () => API.get('/users/');
export const updateUser = (id: number, data: any) => API.put(`/users/${id}/`, data);
