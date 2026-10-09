import { api } from "@/lib/api-client";
import type {
  AuthResponse,
  LoginInput,
  RegisterInput,
  UpdateProfileInput,
  ChangePasswordInput,
  User,
} from "@/types/auth";

export async function loginApi(input: LoginInput): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/login", input);
  return data;
}

export async function registerApi(input: RegisterInput): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/register", input);
  return data;
}

export async function getMeApi(): Promise<{ user: User }> {
  const { data } = await api.get<{ user: User }>("/auth/me");
  return data;
}

export async function updateProfileApi(
  input: UpdateProfileInput,
): Promise<{ user: User }> {
  const { data } = await api.patch<{ user: User }>("/auth/profile", input);
  return data;
}

export async function changePasswordApi(
  input: ChangePasswordInput
): Promise<{ message: string }> {
  const { data } = await api.patch<{ message: string }>("/auth/password", {
    currentPassword: input.currentPassword,
    newPassword: input.newPassword,
  });
  return data;
}
