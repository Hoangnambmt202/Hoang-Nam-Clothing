import { apiFetch } from "../api";

export const reviewApi = {
  getAllReviews: async (
    token: string,
    params: { page?: number; limit?: number; rating?: number; isApproved?: boolean }
  ) => {
    const query = new URLSearchParams();
    if (params.page) query.append("page", params.page.toString());
    if (params.limit) query.append("limit", params.limit.toString());
    if (params.rating) query.append("rating", params.rating.toString());
    if (params.isApproved !== undefined) query.append("isApproved", params.isApproved.toString());

    return await apiFetch(`/reviews?${query.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  updateStatus: async (token: string, id: string, isApproved: boolean) => {
    return await apiFetch(`/reviews/${id}/status`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ isApproved }),
    });
  },

  replyReview: async (token: string, id: string, replyComment: string) => {
    return await apiFetch(`/reviews/${id}/reply`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ replyComment }),
    });
  },

  deleteReview: async (token: string, id: string) => {
    return await apiFetch(`/reviews/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
