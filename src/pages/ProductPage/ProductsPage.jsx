import { useState } from "react";

const ProductPage = () => {
  const allProducts = [
    {
      id: 1,
      name: "Áo Thun Nam",
      category: "Clothing",
      price: 299,
      image: "https://via.placeholder.com/300x400?text=Áo+Thun+Nam",
    },
    {
      id: 2,
      name: "Quần Jean Nữ",
      category: "Clothing",
      price: 499,
      image: "https://via.placeholder.com/300x400?text=Quần+Jean+Nữ",
    },
    {
      id: 3,
      name: "Giày Sneaker",
      category: "Shoes",
      price: 899,
      image: "https://via.placeholder.com/300x400?text=Giày+Sneaker",
    },
    {
      id: 4,
      name: "Áo Khoác Hoodie",
      category: "Clothing",
      price: 599,
      image: "https://via.placeholder.com/300x400?text=Áo+Khoác+Hoodie",
    },
    {
      id: 5,
      name: "Túi Xách",
      category: "Accessories",
      price: 399,
      image: "https://via.placeholder.com/300x400?text=Túi+Xách",
    },
  ];

  const [selectedCategory, setSelectedCategory] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const filteredProducts = allProducts.filter((product) => {
    const matchesCategory = selectedCategory
      ? product.category === selectedCategory
      : true;
    const matchesPrice = maxPrice ? product.price <= maxPrice : true;
    return matchesCategory && matchesPrice;
  });

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar Filters */}
      <aside className="w-1/4 p-4 bg-white border-r border-gray-200">
        <h2 className="mb-4 text-xl font-bold">Bộ Lọc</h2>

        {/* Category Filter */}
        <div className="mb-4">
          <h3 className="mb-2 text-lg font-semibold">Danh Mục</h3>
          <select
            className="w-full p-2 border rounded-lg"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Tất cả</option>
            <option value="Clothing">Quần Áo</option>
            <option value="Shoes">Giày</option>
            <option value="Accessories">Phụ Kiện</option>
          </select>
        </div>

        {/* Price Filter */}
        <div>
          <h3 className="mb-2 text-lg font-semibold">Giá Tối Đa (VND)</h3>
          <input
            type="number"
            className="w-full p-2 border rounded-lg"
            placeholder="Nhập giá tối đa"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </aside>

      {/* Product Grid */}
      <main className="w-3/4 p-6">
        <h1 className="mb-6 text-2xl font-bold">Danh Sách Sản Phẩm</h1>
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="overflow-hidden transition-shadow duration-300 bg-white rounded-lg shadow-md hover:shadow-lg"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-cover w-full h-48"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {product.name}
                  </h2>
                  <p className="text-gray-500">
                    {product.price.toLocaleString()} VND
                  </p>
                  <button className="px-4 py-2 mt-4 text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600">
                    Thêm vào giỏ
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Không có sản phẩm nào phù hợp.</p>
        )}
      </main>
    </div>
  );
};

export default ProductPage;
