"use client";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setQuery, closeSearch } from "@/store/features/searchSlice";
import { X, Search, ArrowRight } from "lucide-react";
import { productApi } from "@/lib/api/product";
import Link from "next/link";

export default function SearchOverlay() {
  const dispatch = useDispatch();
  const { isOpen, query } = useSelector(
    (state: RootState) => state.search,
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dispatch(closeSearch());
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [dispatch]);

  useEffect(() => {
    if (!query) {
      setProducts([]);
      return;
    }
    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await productApi.searchProducts(query);
        setProducts(data || []);
      } catch (err) {
        console.error("Lỗi tìm kiếm sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <>
      {/* Backdrop — subtle, only when results are showing */}
      <div
        onClick={() => dispatch(closeSearch())}
        className={`
          fixed inset-0 z-40 transition-all duration-300
          ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(2px)" }}
      />

      {/* Search panel — slides up from bottom */}
      <div
        className={`
          fixed left-0 right-0 z-50 px-4
          transition-all duration-300 ease-out
          ${isOpen ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0 pointer-events-none"}
        `}
        style={{ bottom: "120px" }}
      >
        {/* Results list — above the input */}
        {query.length > 0 && (
          <div
            className="mb-2 rounded-2xl overflow-hidden"
            style={{
              background: "rgba(18, 18, 22, 0.92)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 -8px 32px rgba(0,0,0,0.4)",
            }}
          >
            {loading ? (
              <div className="px-4 py-4 text-center text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                Đang tìm kiếm sản phẩm...
              </div>
            ) : products.length > 0 ? (
              <div className="max-h-[300px] overflow-y-auto">
                {products.map((item, index) => {
                  const mainImage = item.images?.find((img: any) => img.isMain)?.url ||
                                    item.images?.[0]?.url ||
                                    "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070";
                  const price = item.salePrice ? item.salePrice : item.price;
                  return (
                    <Link
                      key={item.id}
                      href={`/products/${item.id}`}
                      className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/5 transition-all group"
                      style={{
                        borderBottom:
                          index < products.length - 1
                            ? "1px solid rgba(255,255,255,0.06)"
                            : "none",
                      }}
                      onClick={() => {
                        dispatch(closeSearch());
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={mainImage}
                          alt={item.name}
                          className="w-10 h-10 object-cover rounded-lg border border-white/10"
                        />
                        <div className="flex flex-col">
                          <span
                            className="text-sm font-semibold truncate max-w-[200px]"
                            style={{ color: "rgba(255,255,255,0.9)" }}
                          >
                            {item.name}
                          </span>
                          <span
                            className="text-xs"
                            style={{ color: "rgba(255,255,255,0.4)" }}
                          >
                            {item.category?.name || "Danh mục"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[#fbbf24]">
                          {Number(price).toLocaleString("vi-VN")}đ
                        </span>
                        {item.salePrice && item.price && (
                          <span className="text-xs line-through text-white/30">
                            {Number(item.price).toLocaleString("vi-VN")}đ
                          </span>
                        )}
                        <ArrowRight
                          size={14}
                          className="opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                          style={{ color: "rgba(255,255,255,0.4)" }}
                        />
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="px-4 py-4 flex items-center gap-3">
                <Search size={14} style={{ color: "rgba(255,255,255,0.25)" }} />
                <span
                  className="text-sm"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  Không tìm thấy sản phẩm cho &quot;{query}&quot;
                </span>
              </div>
            )}
          </div>
        )}

        {/* Input bar */}
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-2xl"
          style={{
            background: "rgba(18, 18, 22, 0.95)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)",
          }}
        >
          <Search
            size={18}
            style={{ color: "rgba(255,255,255,0.4)", flexShrink: 0 }}
          />

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => dispatch(setQuery(e.target.value))}
            placeholder="Tìm kiếm..."
            className="flex-1 bg-transparent outline-none text-base placeholder:text-sm"
            style={{
              color: "rgba(255,255,255,0.9)",
              caretColor: "#a78bfa",
            }}
          />

          {query && (
            <button
              onClick={() => dispatch(setQuery(""))}
              className="flex items-center justify-center w-6 h-6 rounded-full transition-all hover:scale-110"
              style={{ background: "rgba(255,255,255,0.12)" }}
            >
              <X size={12} style={{ color: "rgba(255,255,255,0.6)" }} />
            </button>
          )}

          {!query && (
            <button
              onClick={() => dispatch(closeSearch())}
              className="flex items-center justify-center w-7 h-7 rounded-full transition-all hover:scale-110"
              style={{ background: "rgba(255,255,255,0.08)" }}
            >
              <X size={14} style={{ color: "rgba(255,255,255,0.5)" }} />
            </button>
          )}
        </div>
      </div>
    </>
  );
}
