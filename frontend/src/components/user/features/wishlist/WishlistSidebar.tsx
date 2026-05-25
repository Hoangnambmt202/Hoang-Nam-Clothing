"use client";

import React, { useEffect } from "react";
import { X, Heart, ShoppingCart } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchWishlist, removeProductFromWishlist } from "@/store/features/wishlistSlice";
import { addItem, addToCartDb } from "@/store/features/cartSlice";
import { showToast } from "nextjs-toast-notify";

interface WishlistSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WishlistSidebar({ isOpen, onClose }: WishlistSidebarProps) {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((state) => state.wishlist);
  const { accessToken } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isOpen && accessToken) {
      dispatch(fetchWishlist(accessToken));
    }
  }, [isOpen, accessToken, dispatch]);

  const handleRemove = (productId: string, productName: string) => {
    if (accessToken) {
      dispatch(removeProductFromWishlist({ token: accessToken, productId }));
      showToast.success(`Đã xóa ${productName} khỏi danh sách yêu thích!`, { duration: 2000 });
    }
  };

  const handleAddToCart = (product: any) => {
    const firstVariant = product.variants?.[0];
    const price = firstVariant?.price || 0;
    
    // Attempt to extract main image or fallback
    const mainImage = product.variants?.[0]?.images?.[0]?.url || "/placeholder.jpg";

    const itemObj = {
      id: product.id,
      name: product.name,
      price: Number(price),
      quantity: 1,
      image: mainImage,
      variantId: firstVariant?.id,
      size: firstVariant?.size || "",
      color: firstVariant?.color || "",
    };

    if (accessToken) {
      dispatch(addToCartDb({ item: itemObj, token: accessToken }) as any);
    } else {
      dispatch(addItem(itemObj));
    }

    showToast.success(`Đã thêm ${product.name} vào giỏ hàng!`, { duration: 2000 });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <>
      {/* Background Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-xs z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Wishlist Sidebar Container */}
      <div
        className={`fixed top-0 right-0 h-screen w-full sm:w-[450px] bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-out transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Heart className="fill-black text-black" size={20} />
            <h3 className="text-lg font-bold uppercase tracking-wider text-slate-900">
              Danh sách yêu thích
            </h3>
            <span className="bg-slate-100 text-slate-800 text-xs px-2 py-0.5 rounded-full font-bold">
              {items.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-50 rounded-full transition-colors"
          >
            <X size={20} className="text-slate-500 hover:text-black" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 scrollbar-thin">
          {loading && items.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-slate-200 border-t-black rounded-full animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                <Heart className="text-slate-300" size={32} />
              </div>
              <div>
                <p className="font-bold text-slate-800">Danh sách của bạn trống</p>
                <p className="text-xs text-slate-400 mt-1 max-w-[250px] mx-auto">
                  Hãy thả tim cho các sản phẩm yêu thích của bạn để lưu lại tại đây!
                </p>
              </div>
            </div>
          ) : (
            (Array.isArray(items) ? items : []).map((item: any) => {
              const product = item.product;
              if (!product) return null;

              const firstVariant = product.variants?.[0];
              const price = firstVariant?.price || 0;
              const hasStock = firstVariant?.stockQuantity > 0;
              const variantName = firstVariant
                ? `${firstVariant.color ? firstVariant.color : ""}${
                    firstVariant.size ? " / " + firstVariant.size : ""
                  }`
                : "";

              return (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 border border-slate-100 rounded-xl hover:border-slate-200 transition-colors group relative"
                >
                  {/* Thumbnail Image */}
                  <div className="w-20 h-24 bg-slate-50 rounded-lg overflow-hidden flex-shrink-0 border border-slate-100">
                    <img
                      src={product.variants?.[0]?.images?.[0]?.url || "/placeholder.jpg"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 truncate pr-6">
                        {product.name}
                      </h4>
                      {variantName && (
                        <p className="text-xs text-slate-400 font-medium mt-0.5">
                          {variantName}
                        </p>
                      )}
                      <p className="text-sm font-black text-slate-800 mt-1">
                        {formatCurrency(Number(price))}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Stock availability status */}
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider ${
                          hasStock ? "text-emerald-600 bg-emerald-50" : "text-red-500 bg-red-50"
                        } px-2 py-0.5 rounded`}
                      >
                        {hasStock ? `Còn hàng (${firstVariant?.stockQuantity})` : "Hết hàng"}
                      </span>

                      {/* Add to Cart quick button */}
                      {hasStock && (
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="flex items-center gap-1 text-[10px] font-bold bg-black text-white hover:bg-slate-800 px-3 py-1.5 rounded-lg transition-colors uppercase tracking-wider"
                        >
                          <ShoppingCart size={10} /> Thêm giỏ hàng
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Remove Red Heart Button */}
                  <button
                    onClick={() => handleRemove(product.id, product.name)}
                    className="absolute top-3 right-3 p-1 hover:bg-red-50 rounded-full transition-colors group/heart"
                    title="Xóa khỏi danh sách yêu thích"
                  >
                    <Heart className="fill-red-500 text-red-500 hover:scale-110 transition-transform" size={18} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-slate-100 flex-shrink-0 bg-slate-50/50">
            <button
              onClick={onClose}
              className="w-full py-3 bg-black hover:bg-slate-800 text-white rounded-xl text-center text-sm font-black uppercase tracking-widest transition-all"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        )}
      </div>
    </>
  );
}
