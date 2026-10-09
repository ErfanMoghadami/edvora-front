export interface User {
  id: string;
  name: string;
  phone: string;
  createdAt: string;
  isAdmin?: boolean;
}

export interface LoginInput {
  phone: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  phone: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface UpdateProfileInput {
  name: string;
  phone: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}