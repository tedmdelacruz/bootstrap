// Shared types for the application

export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  bio?: string;
  mobile?: string;
  role?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
} 