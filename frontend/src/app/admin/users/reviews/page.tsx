"use client";

import React, { useState } from "react";
import {
  Star,
  Search,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Image as ImageIcon,
  MoreHorizontal,
  Filter,
  ArrowUpRight,
} from "lucide-react";

export default function ReviewManagement() {
  const [filterRating, setFilterRating] = useState("all");

  const MOCK_REVIEWS = [
    {
      id: 1,
      customer: "Lê Minh Anh",
      product: "Áo sơ mi Oxford Classic",
      productImg: "/product-1.jpg", // Thay bằng link thật
      rating: 5,
      comment:
        "Vải rất đẹp, dày dặn và đứng form. Shop đóng gói cực kỳ cẩn thận. Sẽ ủng hộ lần sau!",
      date: "04/02/2026",
      status: "approved",
      images: [1, 2], // Giả lập khách có chụp ảnh
    },
    {
      id: 2,
      customer: "Hoàng Thùy Linh",
      product: "Quần Jean Slim-fit",
      productImg: "/product-2.jpg",
      rating: 4,
      comment:
        "Quần mặc thoải mái, nhưng giao hàng hơi chậm một chút so với dự kiến.",
      date: "02/02/2026",
      status: "pending",
      images: [],
    },
    {
      id: 3,
      customer: "Nguyễn Tuấn Kiệt",
      product: "Áo Hoodie Oversize",
      productImg: "/product-3.jpg",
      rating: 2,
      comment:
        "Size hơi rộng quá so với mô tả, mình muốn đổi trả mà nhắn tin chưa thấy shop rep.",
      date: "01/02/2026",
      status: "rejected",
      images: [1],
    },
  ];

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
            <h2 className="text-3xl font-black">1,842</h2>
          </div>
          <div className="bg-white p-5 border border-slate-200 rounded-xl">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
              Chờ duyệt
            </p>
            <h2 className="text-3xl font-black text-orange-500">12</h2>
          </div>
          <div className="bg-white p-5 border border-slate-200 rounded-xl">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">
              Phản hồi tháng này
            </p>
            <h2 className="text-3xl font-black text-green-400">+156</h2>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {MOCK_REVIEWS.map((review) => (
            <div
              key={review.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Product & User Info */}
                <div className="md:w-1/4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 border border-slate-100">
                      <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                        <ImageIcon size={20} />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-400 uppercase truncate">
                        {review.product}
                      </p>
                      <p className="font-bold text-sm truncate">
                        {review.customer}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {review.date}
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

                  {review.images.length > 0 && (
                    <div className="flex gap-2 pt-2">
                      {review.images.map((_, i) => (
                        <div
                          key={i}
                          className="w-14 h-14 bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center text-slate-400"
                        >
                          <ImageIcon size={16} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Status & Actions */}
                <div className="md:w-1/5 flex flex-col justify-between items-end gap-4">
                  <div className="flex items-center gap-2">
                    {review.status === "approved" && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded tracking-widest uppercase">
                        <CheckCircle2 size={12} /> Duyệt
                      </span>
                    )}
                    {review.status === "pending" && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded tracking-widest uppercase">
                        Chờ duyệt
                      </span>
                    )}
                    {review.status === "rejected" && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded tracking-widest uppercase">
                        Từ chối
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors group">
                      <MessageSquare
                        size={16}
                        className="text-slate-400 group-hover:text-black"
                      />
                    </button>
                    <button className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-black transition-colors">
                      Phản hồi
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="text-center py-4">
          <button className="text-xs font-bold text-slate-400 hover:text-black transition-colors flex items-center gap-1 mx-auto">
            Xem thêm đánh giá cũ hơn <ArrowUpRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
