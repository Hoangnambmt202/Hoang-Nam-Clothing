"use client";

import React, { useState, useEffect } from "react";
import {
  Star,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Image as ImageIcon,
  ArrowUpRight,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchReviews, updateReviewStatus, replyReview, deleteReview } from "@/store/features/reviewsSlice";

export default function ReviewManagement() {
  const dispatch = useDispatch<AppDispatch>();
  const { reviews, total, loading } = useSelector((state: RootState) => state.reviews);
  const { accessToken: token } = useSelector((state: RootState) => state.auth);

  const [filterRating, setFilterRating] = useState("all");
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      const ratingParams = filterRating !== "all" ? Number(filterRating) : undefined;
      dispatch(fetchReviews({ token, rating: ratingParams }));
    }
  }, [dispatch, token, filterRating]);

  const handleUpdateStatus = (id: string, isApproved: boolean) => {
    if (token) {
      dispatch(updateReviewStatus({ token, id, isApproved }));
    }
  };

  const handleReplySubmit = (id: string) => {
    if (token && replyText[id]) {
      dispatch(replyReview({ token, id, replyComment: replyText[id] }));
      setActiveReplyId(null);
    }
  };

  const handleDelete = (id: string) => {
    if (token && window.confirm("Bạn có chắc chắn muốn xóa đánh giá này?")) {
      dispatch(deleteReview({ token, id }));
    }
  };

  const StarRating = ({ count }: { count: number }) => (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={14}
          className={
            i < count ? "fill-yellow-400 text-yellow-400" : "text-gray-200"
          }
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 p-8 text-slate-900">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight uppercase">
              Customer Reviews
            </h1>
            <p className="text-slate-500 text-sm">
              Quản lý phản hồi và xếp hạng từ khách hàng
            </p>
          </div>
          <div className="flex bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
            {["all", "5", "4", "3", "2", "1"].map((r) => (
              <button
                key={r}
                onClick={() => setFilterRating(r)}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                  filterRating === r
                    ? "bg-black text-white"
                    : "text-slate-400 hover:text-black"
                }`}
              >
                {r === "all" ? "Tất cả" : `${r} ★`}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 border border-slate-200 rounded-xl">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
              Rating trung bình
            </p>
            <div className="flex items-center gap-2">
              <h2 className="text-3xl font-black">4.8</h2>
              <StarRating count={5} />
            </div>
          </div>
          <div className="bg-white p-5 border border-slate-200 rounded-xl">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
              Tổng đánh giá
            </p>
            <h2 className="text-3xl font-black">{total}</h2>
          </div>
          <div className="bg-white p-5 border border-slate-200 rounded-xl">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
              Chờ duyệt
            </p>
            <h2 className="text-3xl font-black text-orange-500">
              {reviews.filter(r => !r.isApproved).length}
            </h2>
          </div>
          <div className="bg-white p-5 border border-slate-200 rounded-xl">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">
              Đã duyệt
            </p>
            <h2 className="text-3xl font-black text-emerald-500">
              {reviews.filter(r => r.isApproved).length}
            </h2>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4 relative min-h-[300px]">
          {loading && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-slate-200 border-t-black rounded-full animate-spin"></div>
            </div>
          )}
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Product & User Info */}
                <div className="md:w-1/4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 border border-slate-100">
                      {review.product?.images?.[0]?.url ? (
                        <img src={review.product.images[0].url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                          <ImageIcon size={20} />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-400 uppercase truncate">
                        {review.product?.name || "Sản phẩm"}
                      </p>
                      <p className="font-bold text-sm truncate">
                        {review.user?.firstName} {review.user?.lastName}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-2">
                  <StarRating count={review.rating} />
                  <p className="text-sm leading-relaxed text-slate-700">
                    "{review.comment}"
                  </p>

                  {review.replyComment && (
                    <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <p className="text-xs font-bold text-slate-500 mb-1">Shop phản hồi:</p>
                      <p className="text-sm text-slate-700">{review.replyComment}</p>
                    </div>
                  )}

                  {activeReplyId === review.id && (
                    <div className="mt-3">
                      <textarea
                        className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-black"
                        rows={3}
                        placeholder="Nhập phản hồi của shop..."
                        value={replyText[review.id] || ""}
                        onChange={(e) => setReplyText({ ...replyText, [review.id]: e.target.value })}
                      ></textarea>
                      <div className="flex justify-end gap-2 mt-2">
                        <button
                          onClick={() => setActiveReplyId(null)}
                          className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-black transition-colors"
                        >
                          Hủy
                        </button>
                        <button
                          onClick={() => handleReplySubmit(review.id)}
                          className="px-3 py-1.5 bg-black text-white text-xs font-bold rounded hover:bg-slate-800 transition-colors"
                        >
                          Gửi phản hồi
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Status & Actions */}
                <div className="md:w-1/5 flex flex-col justify-between items-end gap-4">
                  <div className="flex items-center gap-2">
                    {review.isApproved ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded tracking-widest uppercase cursor-pointer" onClick={() => handleUpdateStatus(review.id, false)}>
                        <CheckCircle2 size={12} /> Đã Duyệt
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded tracking-widest uppercase cursor-pointer" onClick={() => handleUpdateStatus(review.id, true)}>
                        Chờ duyệt
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => setActiveReplyId(review.id)}
                      className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors group"
                      title="Phản hồi"
                    >
                      <MessageSquare
                        size={16}
                        className="text-slate-400 group-hover:text-black"
                      />
                    </button>
                    <button 
                      onClick={() => handleDelete(review.id)}
                      className="p-2 border border-slate-200 rounded-lg hover:bg-red-50 transition-colors group"
                      title="Xóa"
                    >
                      <XCircle
                        size={16}
                        className="text-slate-400 group-hover:text-red-500"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {reviews.length === 0 && !loading && (
             <div className="text-center py-8 text-slate-500">
               Không có đánh giá nào.
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
