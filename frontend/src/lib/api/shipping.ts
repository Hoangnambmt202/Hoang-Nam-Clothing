import { apiFetch } from "../api";

export const shippingApi = {
  getAll: (activeOnly: boolean = false, token?: string) =>
    apiFetch(`/shipping-methods?activeOnly=${activeOnly}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    }),

  getById: (id: string, token: string) =>
    apiFetch(`/shipping-methods/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  create: (data: any, token: string) =>
    apiFetch("/shipping-methods", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any, token: string) =>
    apiFetch(`/shipping-methods/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    }),

  delete: (id: string, token: string) =>
    apiFetch(`/shipping-methods/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }),
};
