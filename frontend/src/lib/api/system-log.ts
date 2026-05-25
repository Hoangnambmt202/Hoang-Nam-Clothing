import { apiFetch } from "../api";

export const systemLogApi = {
  getAllLogs: async (
    token: string,
    params: { page?: number; limit?: number; type?: string; search?: string }
  ) => {
    const query = new URLSearchParams();
    if (params.page) query.append("page", params.page.toString());
    if (params.limit) query.append("limit", params.limit.toString());
    if (params.type) query.append("type", params.type);
    if (params.search) query.append("search", params.search);

    return await apiFetch(`/system-logs?${query.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
