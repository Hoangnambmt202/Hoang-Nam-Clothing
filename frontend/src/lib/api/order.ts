import { apiFetch } from "../api";

export const orderApi = {
  getAll: (params: any = {}, token: string) => {
    const searchParams = new URLSearchParams(params as any).toString();
    return apiFetch(`/orders?${searchParams}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  getMyOrders: (params: any = {}, token: string) => {
    const searchParams = new URLSearchParams(params as any).toString();
    return apiFetch(`/orders/my-orders?${searchParams}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  getById: (id: string, token: string) =>
    apiFetch(`/orders/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  getStats: (token: string) =>
    apiFetch("/orders/stats", {
      headers: { Authorization: `Bearer ${token}` },
    }),

  updateStatus: (id: string, action: "confirm" | "process" | "ship" | "deliver", token: string) =>
    apiFetch(`/orders/${id}/${action}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }),

  cancel: (id: string, token: string) =>
    apiFetch(`/orders/${id}/cancel`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    }),
};
