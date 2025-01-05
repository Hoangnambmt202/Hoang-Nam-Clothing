
const ProductDetailComponent = () => {
  return (
    <div className="container p-4 mx-auto bg-white">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2">
          <img
            src="https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m21wxxqv7sny11.webp"
            alt="Product"
            className="w-full h-auto"
          />
        </div>
        <div className="md:w-1/2 md:pl-8">
          <h1 className="mb-4 text-3xl font-bold">Product Name</h1>
          <p className="mb-4 text-xl text-gray-700">$99.99</p>
          <p className="mb-4 text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
            scelerisque leo nec felis bibendum, a tincidunt lorem facilisis.
          </p>
          <button className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailComponent
