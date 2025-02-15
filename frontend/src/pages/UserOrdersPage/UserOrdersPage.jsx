import  { useState } from 'react';
import { Package, Truck, CheckCircle, XCircle } from 'lucide-react';

const UserOrdersPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  // Mock order data - replace with actual API call
  const [orders] = useState([
    {
      id: '123',
      date: '2024-02-15',
      total: 1250000,
      status: 'processing',
      items: [
        { id: 1, name: 'Áo thun nam', quantity: 2, price: 250000, image: '/api/placeholder/80/80' },
        { id: 2, name: 'Quần jean', quantity: 1, price: 750000, image: '/api/placeholder/80/80' }
      ]
    },
    {
      id: '124',
      date: '2024-02-14',
      total: 890000,
      status: 'delivered',
      items: [
        { id: 3, name: 'Giày thể thao', quantity: 1, price: 890000, image: '/api/placeholder/80/80' }
      ]
    }
  ]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processing':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'shipping':
        return <Truck className="w-5 h-5 text-orange-500" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      processing: 'Đang xử lý',
      shipping: 'Đang giao hàng',
      delivered: 'Đã giao hàng',
      cancelled: 'Đã hủy'
    };
    return statusMap[status] || status;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const tabs = [
    { id: 'all', label: 'Tất cả' },
    { id: 'processing', label: 'Đang xử lý' },
    { id: 'shipping', label: 'Đang giao' },
    { id: 'delivered', label: 'Đã giao' },
    { id: 'cancelled', label: 'Đã hủy' }
  ];

  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter(order => order.status === activeTab);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Đơn hàng của tôi</h1>
      
      {/* Custom Tabs */}
      <div className="flex space-x-1 mb-4 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === tab.id
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div key={order.id} className="border rounded-lg shadow-sm bg-white">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Đơn hàng #{order.id}</span>
                  <span className="text-gray-500">|</span>
                  <span className="text-gray-500">{order.date}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(order.status)}
                  <span className="text-sm">{getStatusText(order.status)}</span>
                </div>
              </div>

              <div className="divide-y">
                {order.items.map((item) => (
                  <div key={item.id} className="py-4 flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-gray-500">Số lượng: {item.quantity}</p>
                      <p className="text-gray-500">{formatPrice(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex justify-between items-center pt-4 border-t">
                <div className="flex space-x-4">
                  <button className="px-4 py-2 text-sm border rounded hover:bg-gray-50">
                    Chi tiết đơn hàng
                  </button>
                  {order.status === 'delivered' && (
                    <button className="px-4 py-2 text-sm border rounded hover:bg-gray-50">
                      Đánh giá
                    </button>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Tổng tiền</p>
                  <p className="text-lg font-medium">{formatPrice(order.total)}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserOrdersPage;