"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "@/store/features/categoriesSlice";
import { fetchBrands } from "@/store/features/brandsSlice";
import { RootState, AppDispatch } from "@/store/store";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, Play } from "lucide-react";

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=2000",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2000",
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000",
  "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?q=80&w=2000",
  "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2000"
];

export default function CollectionPage() {
  const dispatch = useDispatch<AppDispatch>();

  const { categories, loading: categoriesLoading } = useSelector((state: RootState) => state.categories);
  const { brands, loading: brandsLoading } = useSelector((state: RootState) => state.brands);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchBrands());
  }, [dispatch]);

  const loading = categoriesLoading || brandsLoading;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero Video/Image Section */}
      <div className="relative h-[70vh] min-h-[600px] w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070" 
            alt="Collection Hero" 
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/60 to-transparent" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="block text-sm uppercase tracking-[0.3em] text-white/80 font-montserrat mb-4"
          >
            Spring / Summer 2026
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-cormorant font-bold mb-6 leading-tight"
          >
            Khai Phá Bản Ngã<br />Qua Từng Nét Cắt
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl font-montserrat text-white/80 max-w-2xl mx-auto mb-10 font-light"
          >
            Khám phá các bộ sưu tập mới nhất từ những thương hiệu hàng đầu, 
            nơi phong cách cổ điển giao thoa cùng xu hướng đương đại.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link 
              href="#categories"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#0F172A] hover:bg-slate-100 rounded-full font-montserrat font-semibold tracking-wide transition-colors"
            >
              <Play size={16} fill="currentColor" />
              Khám Phá Ngay
            </Link>
          </motion.div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-32">
          <Loader2 className="w-12 h-12 text-[#2563EB] animate-spin" />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-32">
          
          {/* Categories Section (Lookbook Style) */}
          <section id="categories">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div>
                <span className="text-[#2563EB] font-montserrat font-bold tracking-widest uppercase text-sm mb-2 block">
                  Danh Mục
                </span>
                <h2 className="text-4xl md:text-5xl font-cormorant font-bold text-[#1E293B]">
                  Xu Hướng Nổi Bật
                </h2>
              </div>
              <Link 
                href="/products" 
                className="group flex items-center gap-2 font-montserrat font-medium text-[#64748B] hover:text-[#1E293B] transition-colors"
              >
                Xem tất cả sản phẩm
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((cat, index) => {
                const image = cat.image || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    key={cat.id}
                  >
                    <Link 
                      href={`/products?categoryId=${cat.id}`}
                      className="group block relative overflow-hidden rounded-3xl aspect-[4/5] bg-slate-100"
                    >
                      <img 
                        src={image} 
                        alt={cat.name}
                        className="object-cover w-full h-full transition-transform duration-1000 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                      
                      <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md text-white rounded-full text-xs font-montserrat font-semibold tracking-wider uppercase mb-4">
                          {cat.productCount} Sản phẩm
                        </span>
                        <h3 className="text-3xl font-cormorant font-bold text-white mb-2">
                          {cat.name}
                        </h3>
                        <p className="text-white/80 font-montserrat text-sm line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                          {cat.description || "Khám phá phong cách độc đáo với các thiết kế mới nhất."}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* Brands Section (Minimalist Grid) */}
          <section>
            <div className="text-center mb-16">
              <span className="text-[#2563EB] font-montserrat font-bold tracking-widest uppercase text-sm mb-2 block">
                Đối Tác
              </span>
              <h2 className="text-4xl md:text-5xl font-cormorant font-bold text-[#1E293B]">
                Thương Hiệu Đồng Hành
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {brands.map((brand, index) => (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  key={brand.id}
                >
                  <Link 
                    href={`/products?brandId=${brand.id}`}
                    className="group bg-white border border-zinc-100 hover:border-[#2563EB]/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-xl transition-all duration-300 aspect-square"
                  >
                    <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 group-hover:bg-[#2563EB] group-hover:text-white transition-colors duration-300">
                      <span className="font-cormorant text-2xl font-bold">
                        {brand.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <h3 className="font-montserrat font-bold text-[#1E293B] text-lg mb-2">
                      {brand.name}
                    </h3>
                    <p className="text-xs text-[#64748B] font-montserrat uppercase tracking-wider group-hover:text-[#2563EB] transition-colors">
                      Khám phá ngay
                    </p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>

        </div>
      )}
    </div>
  );
}
