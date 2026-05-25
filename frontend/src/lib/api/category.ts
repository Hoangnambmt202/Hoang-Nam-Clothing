import { apiFetch } from "../api";

export const categoryApi = {
  getCategories: async () => {
    return await apiFetch("/categories");
  },

  createCategory: async (data: { name: string; description?: string; image?: string }, token: string) => {
    return await apiFetch("/categories", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
  },

  getWithProductCount: async () => {
    return await apiFetch("/categories/with-product-count");
  },

  updateCategory: async (id: string, data: any, token: string) => {
    return await apiFetch(`/categories/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
  },

  deleteCategory: async (id: string, token: string) => {
    return await apiFetch(`/categories/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
