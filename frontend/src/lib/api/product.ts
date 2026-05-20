import { apiFetch } from "../api";

export const productApi = {
  // GET ALL PRODUCTS WITH FILTER
  getProducts: async (params?: Record<string, any>) => {
    const queryString = params
      ? "?" +
        Object.entries(params)
          .filter(([, val]) => val !== undefined && val !== null && val !== "")
          .map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(val))}`)
          .join("&")
      : "";
    return await apiFetch(`/products${queryString}`);
  },

  // GET ONE PRODUCT BY ID
  getProductById: async (id: string) => {
    return await apiFetch(`/products/${id}`);
  },

  // SEARCH PRODUCTS
  searchProducts: async (q: string, limit?: number) => {
    const limitQuery = limit ? `&limit=${limit}` : "";
    return await apiFetch(`/products/search?q=${encodeURIComponent(q)}${limitQuery}`);
  },

  // GET RELATED PRODUCTS
  getRelatedProducts: async (id: string, limit?: number) => {
    const limitQuery = limit ? `?limit=${limit}` : "";
    return await apiFetch(`/products/${id}/related${limitQuery}`);
  },

  // GET FILTERS (sizes, colors, categories, price range)
  getFilters: async () => {
    return await apiFetch("/products/filters");
  },

  // GET BRANDS
  getBrands: async () => {
    return await apiFetch("/brands");
  },

  // GET PRODUCT STATS (ADMIN)
  getProductStats: async (token: string) => {
    return await apiFetch("/products/stats", {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // CREATE PRODUCT (ADMIN)
  createProduct: async (data: any, token: string) => {
    return await apiFetch("/products", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
  },

  // UPDATE PRODUCT (ADMIN)
  updateProduct: async (id: string, data: any, token: string) => {
    return await apiFetch(`/products/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
  },

  // DELETE PRODUCT (ADMIN)
  deleteProduct: async (id: string, token: string) => {
    return await apiFetch(`/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // CREATE VARIANT
  createVariant: async (productId: string, data: any, token: string) => {
    return await apiFetch(`/products/${productId}/variants`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
  },

  // CREATE IMAGE
  createImage: async (productId: string, data: any, token: string) => {
    return await apiFetch(`/products/${productId}/images`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
  },
};
