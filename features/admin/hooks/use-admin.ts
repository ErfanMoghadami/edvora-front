"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getAdminStatsApi,
  listUsersApi,
  getUserDetailsApi,
  updateUserApi,
  deleteUserApi,
  impersonateUserApi,
  type ListUsersParams,
} from "../api/admin-api";
import { getErrorMessage } from "@/lib/api-client";

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: getAdminStatsApi,
    staleTime: 30 * 1000,
  });
}

export function useAdminUsers(params: ListUsersParams = {}) {
  return useQuery({
    queryKey: ["admin", "users", params],
    queryFn: () => listUsersApi(params),
    staleTime: 30 * 1000,
  });
}

export function useAdminUserDetails(id: string) {
  return useQuery({
    queryKey: ["admin", "users", id],
    queryFn: () => getUserDetailsApi(id),
    enabled: !!id,
  });
}

export function useUpdateAdminUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: {
        isSuspended?: boolean;
        isAdmin?: boolean;
        adminNote?: string;
      };
    }) => updateUserApi(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({
        queryKey: ["admin", "users", variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
      toast.success("تغییرات ذخیره شد");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useDeleteAdminUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteUserApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
      toast.success("کاربر حذف شد");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useImpersonate() {
  return useMutation({
    mutationFn: (id: string) => impersonateUserApi(id),
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}