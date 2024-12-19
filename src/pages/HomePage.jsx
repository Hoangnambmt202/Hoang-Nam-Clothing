const products = [
  {
    id: 1,
    name: "Áo Thun Nam",
    price: 200000,
    image: "https://via.placeholder.com/150", // Thay bằng link ảnh thực
  },
  {
    id: 2,
    name: "Quần Jeans Nữ",
    price: 350000,
    image: "https://via.placeholder.com/150",
  },
  {
    id: 3,
    name: "Áo Khoác Hoodie",
    price: 500000,
    image: "https://via.placeholder.com/150",
  },
];

const HomePage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">
        Cửa Hàng Thời Trang
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg shadow-lg p-4 hover:shadow-2xl transition"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-gray-700 mb-4">
              Giá: {product.price.toLocaleString()} VND
            </p>
            <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
              Mua Ngay
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
