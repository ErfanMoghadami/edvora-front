export const APP_NAME = "Edvora";
export const APP_DESCRIPTION = "دستیار هوشمند شخصی";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  STUDENTS: "/students",
  SESSIONS: "/sessions",
  PAYMENTS: "/payments",
  SETTINGS: "/settings",
  SHARE: (token: string) => `/share/${token}`,
} as const;

export const SESSION_DURATIONS = [30, 45, 60, 90, 120] as const;

export const PAYMENT_TYPES = {
  PER_SESSION: "per_session",
  LUMP_SUM: "lump_sum",
} as const;

export type PaymentType = typeof PAYMENT_TYPES[keyof typeof PAYMENT_TYPES];

export const SESSION_STATUS = {
  SCHEDULED: "scheduled",
  COMPLETED: "completed",
  CANCELED: "canceled",
} as const;

export type SessionStatus = typeof SESSION_STATUS[keyof typeof SESSION_STATUS];