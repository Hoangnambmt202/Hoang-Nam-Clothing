const NewArrivalsPage = () => {
  const products = [
    {
      id: 1,
      name: "Áo Thun Nam",
      price: "299,000 VND",
      image: "https://via.placeholder.com/300x400?text=Áo+Thun+Nam",
    },
    {
      id: 2,
      name: "Quần Jean Nữ",
      price: "499,000 VND",
      image: "https://via.placeholder.com/300x400?text=Quần+Jean+Nữ",
    },
    {
      id: 3,
      name: "Giày Sneaker",
      price: "899,000 VND",
      image: "https://via.placeholder.com/300x400?text=Giày+Sneaker",
    },
    {
      id: 4,
      name: "Áo Khoác Hoodie",
      price: "599,000 VND",
      image: "https://via.placeholder.com/300x400?text=Áo+Khoác+Hoodie",
    },
  ];

  return (
    <div className="min-h-screen py-10 bg-gray-100 ">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <h1 className="mb-10 text-3xl font-bold text-center">Hàng Mới</h1>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
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
                <p className="text-gray-500">{product.price}</p>
                <button className="px-4 py-2 mt-4 text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600">
                  Thêm vào giỏ
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewArrivalsPage;
