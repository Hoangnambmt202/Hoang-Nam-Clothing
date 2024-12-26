import CarouselComponent from "../../components/CarouselComponent/CarouselComponent";
import NewsletterComponent from "../../components/NewletterComponent/NewletterComponent";

const products = [
  {
    id: 1,
    name: "Áo Thun Nam",
    price: 200000,
    image:
      "https://images.pexels.com/photos/242829/pexels-photo-242829.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: 2,
    name: "Quần Jeans Nữ",
    price: 350000,
    image:
      "https://images.pexels.com/photos/792762/pexels-photo-792762.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: 3,
    name: "Áo Khoác Hoodie",
    price: 500000,
    image:
      "https://images.pexels.com/photos/894077/pexels-photo-894077.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: 4,
    name: "Áo Khoác Hoodie",
    price: 500000,
    image:
      "https://images.pexels.com/photos/894077/pexels-photo-894077.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
];
 


const categories = [
  {
    title: "THỜI TRANG NAM",
    image:
      "https://images.pexels.com/photos/242829/pexels-photo-242829.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    title: "THỜI TRANG NỮ",
    image:
      "https://images.pexels.com/photos/814194/pexels-photo-814194.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    title: "PHỤ KIỆN",
    image:
      "https://images.pexels.com/photos/343720/pexels-photo-343720.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
];

const HomePage = () => {
 

  return (
    <div className="container p-4 mx-auto">
      <div className="flex items-center justify-center mb-3 bg-gray-100">
        <CarouselComponent />
      </div>

      <section className="py-20 bg-gray-50">
        <div className="px-4 mx-auto max-w-7xl">
          <h2 className="mb-12 text-3xl font-light text-center">
            DANH MỤC SẢN PHẨM
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {categories.map((category, index) => (
              <div
                key={index}
                className="relative cursor-pointer group hover-scale"
              >
                <img
                  src={category.image}
                  className="object-cover w-full h-96"
                  alt={category.title}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                  <h3 className="text-2xl text-white">{category.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-gray-100">
        <div className="px-4 mx-auto max-w-7xl">
          <h2 className="mb-12 text-3xl font-light text-center">
            SẢN PHẨM NỔI BẬT
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product, index) => (
              <div key={index} className="group">
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    className="w-full hover-scale"
                    alt={product.name}
                  />
                  {product.isNew && (
                    <div className="absolute px-3 py-1 text-white bg-black top-4 left-4">
                      Mới
                    </div>
                  )}
                  <div className="absolute inset-0 transition-opacity duration-300 bg-black opacity-0 bg-opacity-20 group-hover:opacity-100">
                    <button className="absolute px-2 py-5 text-xl text-black transition-colors transform -translate-x-1/2 bg-white bottom-4 left-1/2 hover:bg-black hover:text-white">
                      Thêm vào giỏ
                    </button>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-2xl font-medium ">{product.name}</h3>
                  <p className="text-xl text-gray-600">{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <NewsletterComponent/> 
    </div>
  );
};

export default HomePage;
