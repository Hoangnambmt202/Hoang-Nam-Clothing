"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { addItem, addToCartDb } from "@/store/features/cartSlice";
import { RootState } from "@/store/store";
import { showToast } from "nextjs-toast-notify";
import { productApi } from "@/lib/api/product";
import { Loader2, Sparkles, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

const NewArrivalsPage = () => {
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await productApi.getProducts({ limit: 12 });
        setProducts(response.products || []);
      } catch (err) {
        console.error("Lỗi khi tải sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Banner đầu trang */}
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 flex justify-center items-center opacity-10 pointer-events-none">
            <Sparkles className="w-64 h-64 text-[#2563EB] animate-pulse" />
          </div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-cormorant font-bold text-[#1E293B] mb-4"
          >
            Hàng Mới Về
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="font-montserrat font-light text-sm tracking-widest text-[#64748B] uppercase"
          >
            Khám phá những thiết kế mới nhất trong bộ sưu tập thời trang đương đại
          </motion.p>
          <div className="w-16 h-0.5 bg-[#2563EB] mx-auto mt-6" />
        </div>

        {/* Danh sách Sản phẩm */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-24 gap-4">
            <Loader2 className="w-12 h-12 text-[#2563EB] animate-spin" />
            <span className="font-montserrat text-sm text-[#64748B] font-light">Đang tải bộ sưu tập mới...</span>
          </div>
        ) : products.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
          >
            {products.map((product, index) => {
              const productImages = (Array.from(
                new Map(
                  product.variants
                    ?.flatMap((v: any) => v.images || [])
                    ?.map((img: any) => [img.url, img]) || []
                ).values()
              ) as any[]) || [];
              const mainImage = productImages.find((img: any) => img.isThumbnail || img.is_thumbnail)?.url ||
                                productImages[0]?.url ||
                                "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070";
              const lowestVariantPrice = product.variants?.length > 0 
                  ? Math.min(...product.variants.map((v: any) => Number(v.price))) 
                  : (product.price || 0);
              const price = product.salePrice ? product.salePrice : lowestVariantPrice;

              return (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  key={product.id}
                  className="group bg-white border border-zinc-100 rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(37,99,235,0.08)] flex flex-col h-full"
                >
                  <Link href={`/products/${product.id}`} className="relative block overflow-hidden aspect-[3/4] flex-shrink-0">
                    {/* Badge Sale */}
                    {product.salePrice && (
                      <span className="absolute top-4 left-4 z-10 bg-red-500 text-white font-montserrat text-xs uppercase tracking-wider px-3 py-1 rounded-full font-semibold">
                        Sale
                      </span>
                    )}
                    <img
                      src={mainImage}
                      alt={product.name}
                      className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>

                  <div className="p-6 flex flex-col flex-1">
                    <span className="text-xs uppercase tracking-widest text-[#64748B] font-montserrat mb-2 block">
                      {product.category?.name || "Bộ sưu tập"}
                    </span>
                    <Link href={`/products/${product.id}`} className="flex-1">
                      <h2 className="text-lg font-montserrat font-medium text-[#1E293B] group-hover:text-[#2563EB] transition-colors line-clamp-2 mb-3">
                        {product.name}
                      </h2>
                    </Link>

                    <div className="flex items-baseline gap-2 mt-auto">
                      <span className="text-lg font-montserrat font-semibold text-[#1E293B]">
                        {Number(price).toLocaleString("vi-VN")}đ
                      </span>
                      {product.salePrice && product.price && (
                        <span className="text-xs line-through text-[#94A3B8]">
                          {Number(product.price).toLocaleString("vi-VN")}đ
                        </span>
                      )}
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        const firstVariant = product.variants?.[0];
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
                      }}
                      className="mt-4 w-full py-2.5 bg-slate-100 hover:bg-[#1E293B] hover:text-white text-slate-800 rounded-xl font-montserrat font-medium flex justify-center items-center gap-2 transition-colors"
                    >
                      <ShoppingCart size={16} />
                      Thêm vào giỏ
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <div className="text-center py-24">
            <p className="font-montserrat text-lg text-[#64748B]">Hiện chưa có sản phẩm mới nào.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewArrivalsPage;
