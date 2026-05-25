import { apiFetch } from "../api";

export const paymentApi = {
  getAll: (activeOnly: boolean = false, token?: string) =>
    apiFetch(`/payment-methods?activeOnly=${activeOnly}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    }),

  getById: (id: string, token: string) =>
    apiFetch(`/payment-methods/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  create: (data: any, token: string) =>
    apiFetch("/payment-methods", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any, token: string) =>
    apiFetch(`/payment-methods/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    }),

  delete: (id: string, token: string) =>
    apiFetch(`/payment-methods/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }),
};
