"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useAuthStore } from "@/stores/auth-store";
import {
  loginApi,
  registerApi,
  getMeApi,
  updateProfileApi,
  changePasswordApi,
} from "../api/auth-api";
import { getErrorMessage } from "@/lib/api-client";
import { ROUTES } from "@/lib/constants";
import type {
  LoginInput,
  RegisterInput,
  UpdateProfileInput,
  ChangePasswordInput,
} from "@/types/auth";

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (input: LoginInput) => loginApi(input),
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      queryClient.setQueryData(["auth", "me"], { user: data.user });
      toast.success(`خوش آمدید ${data.user.name}`);

      setTimeout(() => {
        window.location.href = ROUTES.DASHBOARD;
      }, 100);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  return {
    login: (input: LoginInput) => mutation.mutateAsync(input),
    loading: mutation.isPending,
  };
}

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (input: RegisterInput) => registerApi(input),
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      queryClient.setQueryData(["auth", "me"], { user: data.user });
      toast.success("حساب شما با موفقیت ساخته شد");

      setTimeout(() => {
        window.location.href = ROUTES.DASHBOARD;
      }, 100);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  return {
    register: (input: RegisterInput) => mutation.mutateAsync(input),
    loading: mutation.isPending,
  };
}

export function useLogout() {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const queryClient = useQueryClient();

  return useCallback(() => {
    clearAuth();
    queryClient.clear();
    toast.success("از حساب خود خارج شدید");
    setTimeout(() => {
      window.location.href = ROUTES.LOGIN;
    }, 100);
  }, [clearAuth, queryClient]);
}

export function useUpdateProfile() {
  const setUser = useAuthStore((s) => s.setUser);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (input: UpdateProfileInput) => updateProfileApi(input),
    onSuccess: (data) => {
      setUser(data.user);
      queryClient.setQueryData(["auth", "me"], { user: data.user });
      toast.success("اطلاعات پروفایل با موفقیت ذخیره شد");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  return {
    updateProfile: (input: UpdateProfileInput) => mutation.mutateAsync(input),
    loading: mutation.isPending,
  };
}

export function useChangePassword() {
  const mutation = useMutation({
    mutationFn: (input: ChangePasswordInput) => changePasswordApi(input),
    onSuccess: () => {
      toast.success("رمز عبور با موفقیت تغییر کرد");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  return {
    changePassword: (input: ChangePasswordInput) => mutation.mutateAsync(input),
    loading: mutation.isPending,
  };
}

export function useMe() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: getMeApi,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });
}
