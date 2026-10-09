import { api } from "@/lib/api-client";

export interface AdminStats {
  users: {
    total: number;
    newThisMonth: number;
    newThisWeek: number;
    activeToday: number;
    activeThisWeek: number;
    suspended: number;
  };
  students: { total: number };
  sessions: { total: number };
  payments: { total: number };
}

export interface AdminUser {
  id: string;
  name: string;
  phone: string;
  isAdmin: boolean;
  isSuspended: boolean;
  adminNote: string | null;
  lastLoginAt: string | null;
  loginCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ListUsersResponse {
  users: AdminUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UserDetailsResponse {
  user: AdminUser;
  stats: {
    studentsCount: number;
    sessionsCount: number;
    paymentsCount: number;
    totalRevenue: number;
  };
  recentStudents: Array<{
    id: string;
    name: string;
    phone: string;
    createdAt: string;
  }>;
}

export interface ListUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  filter?: "all" | "active" | "suspended" | "admins";
}

export async function getAdminStatsApi(): Promise<AdminStats> {
  const { data } = await api.get<AdminStats>("/admin/stats");
  return data;
}

export async function listUsersApi(
  params: ListUsersParams = {}
): Promise<ListUsersResponse> {
  const { data } = await api.get<ListUsersResponse>("/admin/users", {
    params,
  });
  return data;
}

export async function getUserDetailsApi(
  id: string
): Promise<UserDetailsResponse> {
  const { data } = await api.get<UserDetailsResponse>(`/admin/users/${id}`);
  return data;
}

export async function updateUserApi(
  id: string,
  data: {
    isSuspended?: boolean;
    isAdmin?: boolean;
    adminNote?: string;
  }
): Promise<AdminUser> {
  const { data: result } = await api.patch<AdminUser>(
    `/admin/users/${id}`,
    data
  );
  return result;
}

export async function deleteUserApi(id: string): Promise<void> {
  await api.delete(`/admin/users/${id}`);
}

export async function impersonateUserApi(
  id: string
): Promise<{ user: AdminUser; token: string }> {
  const { data } = await api.post<{ user: AdminUser; token: string }>(
    `/admin/users/${id}/impersonate`
  );
  return data;
}