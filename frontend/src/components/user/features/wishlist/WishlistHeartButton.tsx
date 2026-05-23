"use client";

import React from "react";
import { Heart } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addProductToWishlist, removeProductFromWishlist } from "@/store/features/wishlistSlice";
import { showToast } from "nextjs-toast-notify";

interface WishlistHeartButtonProps {
  productId: string;
  productName: string;
  size?: number;
  className?: string;
}

export default function WishlistHeartButton({
  productId,
  productName,
  size = 20,
  className = "",
}: WishlistHeartButtonProps) {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.wishlist);
  const { accessToken } = useAppSelector((state) => state.auth);

  const isWishlisted = Array.isArray(items) && items.some((item) => {
    if (!item) return false;
    const productObj = item.product?.id ? item.product : (item.data?.product || item.product);
    const itemProductId = typeof productObj === "object" ? productObj?.id : productObj;
    return itemProductId === productId;
  });

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!accessToken) {
      showToast.error("Vui lòng đăng nhập để lưu sản phẩm yêu thích!", { duration: 3000 });
      return;
    }

    if (isWishlisted) {
      dispatch(removeProductFromWishlist({ token: accessToken, productId }));
      showToast.success(`Đã xóa ${productName} khỏi danh sách yêu thích!`, { duration: 2000 });
    } else {
      dispatch(addProductToWishlist({ token: accessToken, productId }));
      showToast.success(`Đã lưu ${productName} vào danh sách yêu thích!`, { duration: 2000 });
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`p-2.5 bg-white/80 hover:bg-white text-slate-700 hover:text-red-500 rounded-full transition-all duration-300 shadow-md backdrop-blur-xs flex items-center justify-center hover:scale-110 active:scale-95 ${className}`}
      title={isWishlisted ? "Xóa khỏi danh sách yêu thích" : "Thêm vào danh sách yêu thích"}
    >
      <Heart
        size={size}
        className={`transition-all duration-300 ${
          isWishlisted
            ? "fill-red-500 text-red-500 scale-105"
            : "text-slate-600 group-hover:text-red-500"
        }`}
      />
    </button>
  );
}
