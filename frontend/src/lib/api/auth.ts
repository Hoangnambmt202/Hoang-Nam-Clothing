import { apiFetch } from "../api";

export const authApi = {
  login: async (emailOrPhone: string, password: string) => {
    return await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: emailOrPhone, password }),
    });
  },

  register: async (data: { email: string; phone: string; password: string; firstName: string; lastName: string }) => {
    return await apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getMe: async (token: string) => {
    return await apiFetch("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  refreshToken: async () => {
    return await apiFetch("/auth/refresh", { method: "POST" });
  },

  logout: async () => {
    return await apiFetch("/auth/logout", { method: "POST" });
  },

  requestOtp: async (email: string) => {
    return await apiFetch("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  verifyOtp: async (email: string, otp: string) => {
    return await apiFetch("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    });
  },

  resetPassword: async (email: string, otp: string, newPassword: string) => {
    return await apiFetch("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ email, otp, newPassword }),
    });
  },
};
