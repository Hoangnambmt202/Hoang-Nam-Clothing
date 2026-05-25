import { apiFetch } from "../api";

export const cartApi = {
  getCart: (token?: string) => {
    return apiFetch("/cart", {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
  },

  addItem: (data: { productId: string; productVariantId?: string; quantity: number }, token?: string) => {
    return apiFetch("/cart/items", {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: JSON.stringify(data),
    });
  },

  updateItem: (itemId: string, data: { quantity?: number; newVariantId?: string }, token?: string) => {
    return apiFetch(`/cart/items/${itemId}`, {
      method: "PATCH",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: JSON.stringify(data),
    });
  },

  removeItem: (itemId: string, token?: string) => {
    return apiFetch(`/cart/items/${itemId}`, {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
  },

  clearCart: (token?: string) => {
    return apiFetch("/cart", {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
  },
};
