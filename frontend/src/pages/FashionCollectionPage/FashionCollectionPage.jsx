
const products = [
  { id: 1, name: "Áo sơ mi", image: "path/to/image1.jpg", price: 500000 },
  { id: 2, name: "Quần jeans", image: "path/to/image2.jpg", price: 300000 },
  { id: 3, name: "Giày thể thao", image: "path/to/image3.jpg", price: 700000 },
  // Add more products as needed
];

const FashionCollectionPage = () => {
  return (
    <div className="container p-6 mx-auto">
      <h2 className="mb-6 text-3xl font-bold text-center">
        Bộ Sưu Tập Thời Trang
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="p-4 border border-gray-200 rounded-lg shadow-lg"
          >
            <img
              src={product.image}
              alt={product.name}
              className="object-cover w-full h-64 mb-4 rounded-lg"
            />
            <h3 className="text-xl font-semibold">{product.name}</h3>
            <p className="mt-2 text-lg text-gray-500">
              Giá: {product.price.toLocaleString()} VND
            </p>
            <button className="px-4 py-2 mt-4 text-white bg-blue-500 rounded-lg hover:bg-blue-600">
              Thêm vào giỏ
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FashionCollectionPage;
