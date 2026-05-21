import axios from 'axios';
import type { AuthResponse, User, Event, LiveScore } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  login: (email: string, password: string, role?: string) => api.post<AuthResponse>('/auth/login', { email, password, role }),
  register: (data: Partial<User> & { password: string }) => api.post<AuthResponse>('/auth/register', data),
  getProfile: () => api.get<AuthResponse>('/auth/profile'),
  updateProfile: (data: Partial<User>) => api.put<AuthResponse>('/auth/profile', data),
  getUsers: () => api.get<User[]>('/auth/users'),
  deleteUser: (id: string) => api.delete(`/auth/users/${id}`),
  updateApproval: (id: string, approvalStatus: string) => api.put(`/auth/users/${id}/approval`, { approvalStatus }),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  verifyOtp: (email: string, otp: string) => api.post('/auth/verify-otp', { email, otp }),
  resetPassword: (email: string, otp: string, password: string) => api.post('/auth/reset-password', { email, otp, password }),
};

export const eventAPI = {
  getAll: (params?: { category?: string; status?: string }) => api.get<Event[]>('/events', { params }),
  getById: (id: string) => api.get<Event>(`/events/${id}`),
  create: (data: Partial<Event>) => api.post<Event>('/events', data),
  update: (id: string, data: Partial<Event>) => api.put<Event>(`/events/${id}`, data),
  delete: (id: string) => api.delete(`/events/${id}`),
  enroll: (id: string) => api.post(`/events/${id}/enroll`),
  unenroll: (id: string) => api.post(`/events/${id}/unenroll`),
  getStudents: (id: string) => api.get<User[]>(`/events/${id}/students`),
  approve: (id: string) => api.put(`/events/${id}/approve`),
  reject: (id: string) => api.put(`/events/${id}/reject`),
};

export const liveScoreAPI = {
  getAll: () => api.get<LiveScore[]>('/livescores'),
  create: (data: Partial<LiveScore>) => api.post<LiveScore>('/livescores', data),
  getByEvent: (eventId: string) => api.get<LiveScore>(`/livescores/event/${eventId}`),
  update: (id: string, data: Partial<LiveScore>) => api.put<LiveScore>(`/livescores/${id}`, data),
  delete: (id: string) => api.delete(`/livescores/${id}`),
};

export const uploadPhoto = (file: File) => {
  const formData = new FormData();
  formData.append('photo', file);
  return api.post<{ photo: string }>('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export default api;
