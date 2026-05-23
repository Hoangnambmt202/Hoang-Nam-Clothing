import { apiFetch } from "../api";

export const wishlistApi = {
  getWishlist: async (token: string) => {
    return await apiFetch("/wishlists", {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  addToWishlist: async (token: string, productId: string) => {
    return await apiFetch("/wishlists", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ productId }),
    });
  },

  removeFromWishlist: async (token: string, productId: string) => {
    return await apiFetch(`/wishlists/${productId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
