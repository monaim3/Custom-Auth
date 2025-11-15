export interface Todo {
  id: number;
  title: string;
  description: string;
  priority: 'extreme' | 'moderate' | 'low';
  is_completed: boolean;
  position: number;
  todo_date: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTodoDto {
  title: string;
  description?: string;
  priority: 'extreme' | 'moderate' | 'low';
  todo_date?: string;
}

export interface UpdateTodoDto {
  title?: string;
  description?: string;
  priority?: 'extreme' | 'moderate' | 'low';
  is_completed?: boolean;
  todo_date?: string;
}