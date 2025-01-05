import CardComponent from './../../components/CardComponent/CardComponent';
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
const ProductsPage = () => {
  return (
    <main className="container px-4 mx-auto bg-white">
      <section className="py-8 products-section">
        <h2 className='text-xl font-bold text-center' >Top các sản phẩm mới</h2>
        <h3 className='mb-4 text-lg text-center ' >(95 sản phẩm)</h3>
        <div className="grid grid-cols-4 gap-4">
          <CardComponent />
          <CardComponent />
          <CardComponent />
          <CardComponent />
          <CardComponent />
        </div>
      </section>
    </main>
  );
};

export default ProductsPage;