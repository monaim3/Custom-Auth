import { AuthResponse } from '@/app/types/auth';
import apiClient from './axios';

export interface SignupDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export const signup = async (data: SignupDto): Promise<AuthResponse> => {
  const response = await apiClient.post('/api/users/signup/', data);
  return response.data;
};

export const login = async (data: LoginDto): Promise<AuthResponse> => {
  const response = await apiClient.post('/api/auth/login/', data);
  return response.data;
};

export const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
};

export const getProfile = async () => {
  const response = await apiClient.get('/api/users/profile/');
  return response.data;
};