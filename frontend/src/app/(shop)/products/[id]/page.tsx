"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { productApi } from "@/lib/api/product";
import { addItem } from "@/store/features/cartSlice";
import { showToast } from "nextjs-toast-notify";
import { motion } from "framer-motion";
import { 
  Loader2, 
  ShoppingBag, 
  ChevronRight, 
  Truck, 
  RotateCcw, 
  ShieldCheck,
  Plus,
  Minus
} from "lucide-react";

export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const dispatch = useDispatch();
  const router = useRouter();

  const [product, setProduct] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const prodData = await productApi.getProductById(id);
        setProduct(prodData);
        
        // Set default gallery image
        const mainImg = prodData?.images?.find((img: any) => img.isMain)?.url || 
                        prodData?.images?.[0]?.url || 
                        "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070";
        setActiveImage(mainImg);

        // Pre-select first options if available
        if (prodData?.sizes?.length > 0) setSelectedSize(prodData.sizes[0]);
        if (prodData?.colors?.length > 0) setSelectedColor(prodData.colors[0]);

        // Load related products
        const relData = await productApi.getRelatedProducts(id, 4);
        setRelated(relData || []);
      } catch (err) {
        console.error("Lỗi khi tải chi tiết sản phẩm:", err);
        showToast.error("Không thể tải thông tin sản phẩm.", { duration: 2000 });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#F8FAFC] gap-4">
        <Loader2 className="w-12 h-12 text-[#2563EB] animate-spin" />
        <span className="font-montserrat text-sm text-[#64748B] font-light">
          Đang chuẩn bị sản phẩm cho bạn...
        </span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#F8FAFC] text-center p-6">
        <h2 className="text-2xl font-montserrat font-semibold text-[#1E293B] mb-2">
          Không tìm thấy sản phẩm
        </h2>
        <p className="text-[#64748B] font-light mb-6">
          Sản phẩm bạn đang tìm kiếm có thể đã ngưng bán hoặc bị xóa.
        </p>
        <Link href="/new-arrivals">
          <button className="px-6 py-3 bg-[#1E293B] text-white rounded-xl hover:bg-[#0F172A] transition-colors font-montserrat text-sm">
            Xem sản phẩm mới
          </button>
        </Link>
      </div>
    );
  }

  // Find exact variant from combination of size and color
  const matchedVariant = product.variants?.find(
    (v: any) => v.size === selectedSize && v.color === selectedColor
  );

  // Determine current price (use variant price if specified, otherwise base price)
  const currentBasePrice = matchedVariant?.price || product.salePrice || product.price;
  const originalPrice = product.salePrice ? product.price : null;

  // Handle adding to Redux Cart
  const handleAddToCart = () => {
    const mainImg = product.images?.find((img: any) => img.isMain)?.url || 
                    product.images?.[0]?.url || 
                    "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070";

    dispatch(
      addItem({
        id: product.id,
        name: product.name,
        price: Number(currentBasePrice),
        quantity,
        image: mainImg,
        variantId: matchedVariant?.id,
        size: selectedSize,
        color: selectedColor,
      })
    );

    showToast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`, { duration: 2000 });
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-montserrat font-light text-[#64748B] mb-10 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-[#2563EB] transition-colors">Trang chủ</Link>
          <ChevronRight size={10} />
          <Link href="/new-arrivals" className="hover:text-[#2563EB] transition-colors">Cửa hàng</Link>
          <ChevronRight size={10} />
          <span className="text-[#64748B]">{product.category?.name || "Danh mục"}</span>
          <ChevronRight size={10} />
          <span className="text-[#1E293B] font-medium max-w-[200px] truncate">{product.name}</span>
        </div>

        {/* Product Core Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          
          {/* Left: Images Column */}
          <div className="space-y-4">
            <motion.div 
              layoutId="product-main-image"
              className="aspect-[3/4] rounded-3xl overflow-hidden bg-white border border-zinc-100 shadow-sm relative"
            >
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Thumbnails list */}
            {product.images?.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {product.images.map((img: any) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImage(img.url)}
                    className={`w-20 h-24 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${activeImage === img.url ? "border-[#2563EB]" : "border-transparent opacity-75 hover:opacity-100"}`}
                  >
                    <img
                      src={img.url}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info Column */}
          <div className="flex flex-col">
            
            <div className="mb-6">
              <span className="text-xs uppercase tracking-widest text-[#64748B] font-montserrat mb-2 block font-medium">
                {product.brand?.name || product.category?.name || "Premium Collection"}
              </span>
              <h1 className="text-3xl md:text-4xl font-cormorant font-semibold text-[#1E293B] mb-4">
                {product.name}
              </h1>

              {/* Price Area */}
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-montserrat font-semibold text-[#2563EB]">
                  {Number(currentBasePrice).toLocaleString("vi-VN")}đ
                </span>
                {originalPrice && (
                  <span className="text-sm line-through text-[#94A3B8] font-montserrat">
                    {Number(originalPrice).toLocaleString("vi-VN")}đ
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="font-montserrat font-light text-sm text-[#475569] leading-relaxed mb-8 border-b border-zinc-100 pb-8">
              {product.description || "Chưa có mô tả chi tiết cho sản phẩm này."}
            </p>

            {/* Select Colors */}
            {product.colors?.length > 0 && (
              <div className="mb-6">
                <span className="text-xs uppercase tracking-wider font-montserrat text-[#64748B] font-medium block mb-3">
                  Màu sắc: <span className="text-[#1E293B] font-semibold ml-1">{selectedColor}</span>
                </span>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color: string) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-xl font-montserrat text-xs uppercase tracking-wider transition-all border ${selectedColor === color ? "border-[#2563EB] bg-[#2563EB]/5 text-[#2563EB] font-medium" : "border-zinc-200 bg-white text-[#475569] hover:border-zinc-400"}`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Select Sizes */}
            {product.sizes?.length > 0 && (
              <div className="mb-8">
                <span className="text-xs uppercase tracking-wider font-montserrat text-[#64748B] font-medium block mb-3">
                  Kích thước: <span className="text-[#1E293B] font-semibold ml-1">{selectedSize}</span>
                </span>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-xl font-montserrat text-xs uppercase tracking-wider transition-all border ${selectedSize === size ? "border-[#2563EB] bg-[#2563EB]/5 text-[#2563EB] font-medium" : "border-zinc-200 bg-white text-[#475569] hover:border-zinc-400"}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock Availability */}
            <div className="flex items-center gap-4 text-xs font-montserrat text-[#64748B] mb-8 bg-zinc-50 border border-zinc-100 px-4 py-3 rounded-xl w-max">
              <span>Mã SKU: <span className="text-[#1E293B] font-medium">{matchedVariant?.sku || "HN-N/A"}</span></span>
              <span>|</span>
              <span>Trạng thái: 
                <span className={`font-semibold ml-1 ${matchedVariant ? (matchedVariant.stockQuantity > 0 ? "text-green-600" : "text-red-500") : "text-amber-500"}`}>
                  {matchedVariant ? (matchedVariant.stockQuantity > 0 ? `Còn hàng (${matchedVariant.stockQuantity})` : "Hết hàng") : "Liên hệ"}
                </span>
              </span>
            </div>

            {/* Add to Cart Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              {/* Quantity */}
              <div className="flex items-center justify-between border border-zinc-200 rounded-xl bg-white px-4 py-3.5 w-full sm:w-32">
                <button 
                  onClick={() => setQuantity(q => q > 1 ? q - 1 : 1)}
                  className="text-zinc-500 hover:text-zinc-800 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="font-montserrat font-medium text-[#1E293B]">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="text-zinc-500 hover:text-zinc-800 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={matchedVariant && matchedVariant.stockQuantity === 0}
                className="flex-1 relative flex items-center justify-center gap-2 py-4 bg-[#1E293B] text-white rounded-xl hover:bg-[#0F172A] transition-colors disabled:bg-zinc-300 disabled:cursor-not-allowed group font-montserrat font-medium overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <ShoppingBag size={18} />
                <span className="relative z-10">Thêm vào giỏ hàng</span>
              </button>
            </div>

            {/* Policies */}
            <div className="border-t border-zinc-100 pt-6 grid grid-cols-3 gap-4 font-montserrat text-[10px] sm:text-xs text-[#64748B] font-light">
              <div className="flex flex-col items-center text-center gap-2">
                <Truck size={18} className="text-[#2563EB]" />
                <span>Giao hàng toàn quốc<br />Miễn phí đơn từ 500k</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <RotateCcw size={18} className="text-[#2563EB]" />
                <span>Đổi trả dễ dàng<br />Trong vòng 7 ngày</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <ShieldCheck size={18} className="text-[#2563EB]" />
                <span>Chính hãng 100%<br />Cam kết chất lượng</span>
              </div>
            </div>

          </div>

        </div>

        {/* Related Products Section */}
        {related.length > 0 && (
          <div className="border-t border-zinc-100 pt-16">
            <h2 className="text-3xl font-cormorant font-semibold text-[#1E293B] mb-10 text-center">
              Có Thể Bạn Cũng Thích
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {related.map((item) => {
                const mainImage = item.images?.find((img: any) => img.isMain)?.url ||
                                  item.images?.[0]?.url ||
                                  "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070";
                const price = item.salePrice ? item.salePrice : item.price;
                return (
                  <motion.div
                    whileHover={{ y: -5 }}
                    key={item.id}
                    className="group bg-white border border-zinc-100 rounded-3xl overflow-hidden shadow-sm flex flex-col h-full transition-all"
                  >
                    <Link href={`/products/${item.id}`} className="relative block aspect-[3/4] overflow-hidden">
                      <img
                        src={mainImage}
                        alt={item.name}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>
                    <div className="p-5 flex flex-col flex-1">
                      <span className="text-[10px] uppercase tracking-wider text-[#64748B] font-montserrat mb-1 block">
                        {item.category?.name || "Thời trang"}
                      </span>
                      <Link href={`/products/${item.id}`} className="flex-1">
                        <h3 className="text-sm font-medium text-[#1E293B] group-hover:text-[#2563EB] transition-colors line-clamp-2 mb-2 font-montserrat">
                          {item.name}
                        </h3>
                      </Link>
                      <span className="text-sm font-semibold font-montserrat mt-auto block text-[#1E293B]">
                        {Number(price).toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
