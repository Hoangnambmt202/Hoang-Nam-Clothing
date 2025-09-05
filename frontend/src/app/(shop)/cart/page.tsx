'use client'
import {useState} from 'react';
import Link from 'next/link';


const CartPage = () => {
    const cart = [
      {
        id: 1,
        name: "Áo Thun Nam",
        price: 400000,
        image:
          "https://images.pexels.com/photos/242829/pexels-photo-242829.jpeg?auto=compress&cs=tinysrgb&w=600",
        quantity: 1,
      },
      {
        id: 2,
        name: "Áo Khoác Nam",
        price: 200000,
        image:
          "https://images.pexels.com/photos/242829/pexels-photo-242829.jpeg?auto=compress&cs=tinysrgb&w=600",
        quantity: 2,
      },
    ];

    const [cartItems, setCartItems] = useState(cart);
    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };
    const handleQuantityChange = (id : number, type : string) => {

        if (type === 'increase') {
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item.id === id ? { ...item, quantity: item.quantity + 1 } : item
                )
            );
        } else if (type === 'decrease') {
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item.id === id && item.quantity >1 
                        ? { ...item, quantity: item.quantity - 1 } 
                        : item
                )
            );
        }
    }
    const handleQuantityInput = (id:number, value: any) => {
      const numericValue = parseInt(value, 10);
      if (!isNaN(numericValue) && numericValue > 0) {
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.id === id ? { ...item, quantity: numericValue } : item
          )
        );
      }
    };

    return (
      <div className="container px-4 py-8 mx-auto">
        {cart.length === 0 ? (
          <div className="text-center text-gray-600">Ở dây hơi trống trãi :(((</div>
        ) : (
          <div className="grid gap-6">
            {/* Cart Items */}
            <div className="bg-white rounded-lg shadow">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center p-4 border-b">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="object-cover w-24 h-24 rounded"
                  />
                  <div className="flex-grow ml-4">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-gray-600">${item.price}</p>
                    <div className="flex items-center mt-2">
                      <button
                        onClick={() =>
                          handleQuantityChange(item.id, "decrease")
                        }
                        className="px-2 py-1 border rounded-l"
                      >
                        -
                      </button>
                      <input
                        className="px-4 py-1 border-t border-b w-[60px]"
                        value={item.quantity}
                        type="number"
                        onChange={(e) =>
                          handleQuantityInput(item.id, e.target.value)
                        }
                      
                      />

                      <button
                        className="px-2 py-1 border rounded-r"
                        onClick={() =>
                          handleQuantityChange(item.id, "increase")
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button className="text-red-500 hover:text-red-700">
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="p-6 bg-white rounded-lg shadow">
              <h2 className="mb-4 text-xl font-semibold">Tạm Tính</h2>
              <div className="flex justify-between mb-2">
                <span>Tổng tiền sản phẩm:</span>
                <span>${calculateTotal().toLocaleString("vi-VN")} VND</span>
              </div>
              <div className="flex justify-between mb-4">
                <span>Phí Vận Chuyển:</span>
                <span>Miễn Phí</span>
              </div>
              <div className="pt-4 border-t">
                <div className="flex justify-between font-semibold">
                  <span>Tổng Cộng:</span>
                  <span>${calculateTotal().toLocaleString("vi-VN")} VND</span>
                </div>
              </div>
              <Link href="/checkout" >
                <button className="w-full py-3 mt-6 text-white bg-black rounded-lg hover:bg-gray-800">
                  Thanh Toán
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    );
};

export default CartPage;