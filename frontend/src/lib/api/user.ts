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
    data: any
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

  updateAddress: async (
    token: string,
    addressId: string,
    data: any
  ) => {
    return await apiFetch(`/user/addresses/${addressId}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
  },

  // Admin APIs
  getAllUsers: async (token: string, params: { page?: number; limit?: number; role?: string; search?: string }) => {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());
    if (params.role) query.append('role', params.role);
    if (params.search) query.append('search', params.search);
    
    return await apiFetch(`/users?${query.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  createUser: async (token: string, data: any) => {
    return await apiFetch("/users", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
  },

  updateUser: async (token: string, id: string, data: any) => {
    return await apiFetch(`/users/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
  },

  getUserStats: async (token: string) => {
    return await apiFetch("/users/stats", {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
