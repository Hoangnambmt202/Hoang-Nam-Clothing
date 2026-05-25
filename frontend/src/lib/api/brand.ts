import { apiFetch } from "../api";

export const brandApi = {
  getBrands: async () => {
    return await apiFetch("/brands");
  },

  createBrand: async (data: { name: string; description?: string }, token: string) => {
    return await apiFetch("/brands", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
  },
};
