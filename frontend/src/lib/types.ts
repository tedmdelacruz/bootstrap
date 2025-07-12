// Shared types for the application

export interface User {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
} 