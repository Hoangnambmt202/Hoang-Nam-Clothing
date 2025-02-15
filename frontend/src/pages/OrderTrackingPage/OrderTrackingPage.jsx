import  { useState } from 'react';
import { Package, Truck, CheckCircle, Clock, Search } from 'lucide-react';

const OrderTrackingPage = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);
  const [error, setError] = useState('');

  // Mock tracking data - replace with actual API call
  const mockTrackingData = {
    orderId: "OD123456789",
    orderDate: "2024-02-15",
    status: "shipping",
    estimatedDelivery: "2024-02-18",
    currentLocation: "Chi nhánh Hồ Chí Minh",
    trackingSteps: [
      {
        id: 1,
        status: "ordered",
        time: "2024-02-15 08:30",
        location: "Online",
        description: "Đơn hàng đã được đặt thành công"
      },
      {
        id: 2,
        status: "processing",
        time: "2024-02-15 09:45",
        location: "Kho hàng Hà Nội",
        description: "Đơn hàng đang được xử lý"
      },
      {
        id: 3,
        status: "shipping",
        time: "2024-02-16 10:15",
        location: "Chi nhánh Hồ Chí Minh",
        description: "Đơn hàng đang được vận chuyển"
      }
    ],
    items: [
      {
        id: 1,
        name: "Áo thun nam",
        quantity: 2,
        image: "/api/placeholder/60/60"
      }
    ]
  };

  const handleTracking = (e) => {
    e.preventDefault();
    if (!orderNumber.trim()) {
      setError('Vui lòng nhập mã đơn hàng');
      return;
    }
    // Simulate API call
    setTrackingResult(mockTrackingData);
    setError('');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ordered':
        return <Clock className="w-6 h-6 text-blue-500" />;
      case 'processing':
        return <Package className="w-6 h-6 text-orange-500" />;
      case 'shipping':
        return <Truck className="w-6 h-6 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 max-w-4xl ">
      <h1 className="text-2xl font-bold mb-6">Theo dõi đơn hàng</h1>

      {/* Search form */}
      <form onSubmit={handleTracking} className="mb-8">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="Nhập mã đơn hàng của bạn"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Tra cứu
          </button>
        </div>
      </form>

      {/* Tracking Result */}
      {trackingResult && (
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Order Info */}
          <div className="border-b pb-4 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  Đơn hàng #{trackingResult.orderId}
                </h2>
                <p className="text-gray-600">
                  Ngày đặt: {trackingResult.orderDate}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Dự kiến giao hàng</p>
                <p className="font-medium">{trackingResult.estimatedDelivery}</p>
              </div>
            </div>
            
            {/* Order Items */}
            <div className="flex items-center gap-4">
              {trackingResult.items.map(item => (
                <div key={item.id} className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">SL: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tracking Timeline */}
          <div className="relative">
            {trackingResult.trackingSteps.map((step, index) => (
              <div key={step.id} className="flex mb-8 last:mb-0">
                <div className="flex flex-col items-center mr-4">
                  <div className="rounded-full p-2 bg-gray-50">
                    {getStatusIcon(step.status)}
                  </div>
                  {index !== trackingResult.trackingSteps.length - 1 && (
                    <div className="w-px h-full bg-gray-200 my-2" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{step.description}</p>
                  <p className="text-sm text-gray-600">{step.location}</p>
                  <p className="text-sm text-gray-500">{step.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTrackingPage;