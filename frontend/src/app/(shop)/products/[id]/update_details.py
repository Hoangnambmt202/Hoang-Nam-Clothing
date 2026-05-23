import re

file_path = r'd:\WORKSPACE_CODE\Projects\Web\Hoang-Nam_Clothing\frontend\src\app\(shop)\products\[id]\page.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update loadData logic
loadData_old = '''        // Set default gallery image
        const mainImg =
          prodData?.images?.find((img: any) => img.isMain)?.url ||
          prodData?.images?.[0]?.url ||
          "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070";
        setActiveImage(mainImg);'''

loadData_new = '''        // Extract all images from variants
        const allImages = prodData?.variants?.flatMap((v: any) => v.images || []) || [];
        // Set default gallery image
        const mainImg =
          allImages.find((img: any) => img.is_thumbnail)?.url ||
          allImages[0]?.url ||
          "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070";
        setActiveImage(mainImg);'''
content = content.replace(loadData_old, loadData_new)

# 2. Add an effect to change active image when size/color changes
effect_code = '''
  // When selected color/size changes, update active image
  useEffect(() => {
    if (!product || !selectedColor || !selectedSize) return;
    const variant = product.variants?.find((v: any) => v.color === selectedColor && v.size === selectedSize);
    if (variant && variant.images?.length > 0) {
      const thumb = variant.images.find((img: any) => img.is_thumbnail) || variant.images[0];
      if (thumb) setActiveImage(thumb.url);
    }
  }, [selectedColor, selectedSize, product]);

  const allGalleryImages = product?.variants?.flatMap((v: any) => v.images || []) || [];
'''
content = content.replace('  // Compute unique colors and sizes from variants', effect_code + '\n  // Compute unique colors and sizes from variants')

# 3. Update the handleAddToCart mainImg logic
cart_img_old = '''    const mainImg =
      product.images?.find((img: any) => img.isMain)?.url ||
      product.images?.[0]?.url ||
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070";'''
cart_img_new = '''    const mainImg =
      matchedVariant?.images?.find((img: any) => img.is_thumbnail)?.url ||
      matchedVariant?.images?.[0]?.url ||
      allGalleryImages.find((img: any) => img.is_thumbnail)?.url ||
      allGalleryImages[0]?.url ||
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070";'''
content = content.replace(cart_img_old, cart_img_new)

# 4. Update the Gallery UI
gallery_ui_old = '''            {/* Thumbnails list */}
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
            )}'''
gallery_ui_new = '''            {/* Thumbnails list */}
            {allGalleryImages.length > 0 && (
              <div className="flex gap-4 overflow-x-auto pb-2 overflow-y-hidden snap-x">
                {allGalleryImages.map((img: any, idx: number) => (
                  <button
                    key={img.id || idx}
                    onClick={() => setActiveImage(img.url)}
                    className={`w-20 h-24 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all snap-start ${activeImage === img.url ? "border-[#2563EB] ring-2 ring-[#2563EB]/20" : "border-transparent opacity-75 hover:opacity-100"}`}
                  >
                    <img
                      src={img.url}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}'''
content = content.replace(gallery_ui_old, gallery_ui_new)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
