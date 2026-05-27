import { apiFetch } from "../api";

export const checkoutApi = {
  // Thực hiện checkout
  checkout: async (data: any, token?: string) => {
    return apiFetch("/orders/checkout", {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: JSON.stringify(data),
    });
  },

  // API Lấy Tỉnh/Thành từ open-api.vn v2
  getProvinces: async () => {
    const res = await fetch("https://provinces.open-api.vn/api/v2/p/");
    return res.json();
  },

  // API Lấy Phường/Xã theo mã tỉnh (depth=2 → tỉnh + xã trực tiếp)
  getWards: async (provinceCode: number) => {
    const res = await fetch(`https://provinces.open-api.vn/api/v2/p/${provinceCode}?depth=2`);
    const data = await res.json();
    return data?.wards || [];
  },
};
