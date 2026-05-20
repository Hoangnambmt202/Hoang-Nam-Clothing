import { apiFetch } from "../api";

export const userApi = {
  getProfile: async (token: string) => {
    return await apiFetch("/user/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  updateProfile: async (
    token: string,
    data: { name?: string; phone?: string; email?: string; avatar?: string }
  ) => {
    return await apiFetch("/user/profile", {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
  },

  changePassword: async (
    token: string,
    data: { currentPassword: string; newPassword: string }
  ) => {
    return await apiFetch("/user/change-password", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
  },

  getOrders: async (token: string, page = 1, limit = 10) => {
    return await apiFetch(`/user/orders?page=${page}&limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  getAddresses: async (token: string) => {
    return await apiFetch("/user/addresses", {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  addAddress: async (
    token: string,
    data: { label: string; fullName: string; phone: string; address: string; isDefault?: boolean }
  ) => {
    return await apiFetch("/user/addresses", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
  },

  deleteAddress: async (token: string, addressId: string) => {
    return await apiFetch(`/user/addresses/${addressId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
