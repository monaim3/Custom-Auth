import { CreateTodoDto, Todo, UpdateTodoDto } from '@/app/types/todo';
import apiClient from './axios';

interface GetTodosParams {
  todo_date?: string;
  search?: string;
  is_completed?: boolean;
  priority?: 'extreme' | 'moderate' | 'low';
}

interface TodosResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Todo[];
}

export const getTodos = async (params?: GetTodosParams): Promise<TodosResponse> => {
  const response = await apiClient.get('/api/todos/', { params });
  return response.data;
};

export const createTodo = async (data: CreateTodoDto): Promise<Todo> => {
  const response = await apiClient.post('/api/todos/', data);
  return response.data;
};

export const updateTodo = async (id: number, data: UpdateTodoDto): Promise<Todo> => {
  const response = await apiClient.patch(`/api/todos/${id}/`, data);
  return response.data;
};

export const deleteTodo = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/todos/${id}/`);
};

export const reorderTodos = async (todos: { id: number; position: number }[]): Promise<void> => {
  await apiClient.post('/api/todos/reorder/', { todos });
};