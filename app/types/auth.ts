export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user?: User;
}