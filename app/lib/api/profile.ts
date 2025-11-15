import { UpdateProfileDto, User } from '@/app/types/user';
import apiClient from './axios';

export const getProfile = async (): Promise<User> => {
  const response = await apiClient.get('/api/users/me/');
  return response.data;
};

export const updateProfile = async (data: UpdateProfileDto): Promise<User> => {
  const response = await apiClient.patch('/api/users/me/', data);
  return response.data;
};

export const updateProfileWithImage = async (data: FormData): Promise<User> => {
  const response = await apiClient.patch('/api/users/me/', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};