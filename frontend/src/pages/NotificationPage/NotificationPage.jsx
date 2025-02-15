import  { useState } from 'react';
import { Bell, Package } from 'lucide-react';

const NotificationPage = () => {
  const [activeTab, setActiveTab] = useState('system');

  // Dữ liệu mẫu cho thông báo
  const notifications = {
    system: [
      {
        id: 1,
        title: 'Cập nhật chính sách bảo mật',
        content: 'Chúng tôi đã cập nhật chính sách bảo mật. Vui lòng đọc để biết thêm chi tiết.',
        date: '2024-02-15',
        isRead: false
      },
      {
        id: 2,
        title: 'Ưu đãi đặc biệt',
        content: 'Giảm 20% cho tất cả sản phẩm trong danh mục "Điện tử"',
        date: '2024-02-14',
        isRead: true
      }
    ],
    orders: [
      {
        id: 3,
        title: 'Đơn hàng #12345 đã được xác nhận',
        content: 'Đơn hàng của bạn đã được xác nhận và đang được xử lý',
        date: '2024-02-16',
        isRead: false
      },
      {
        id: 4,
        title: 'Đơn hàng #12344 đã được giao',
        content: 'Đơn hàng của bạn đã được giao thành công',
        date: '2024-02-13',
        isRead: true
      }
    ]
  };

  const TabButton = ({ type, icon: Icon, label }) => (
    <button
      onClick={() => setActiveTab(type)}
      className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
        activeTab === type
          ? 'bg-blue-500 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      <Icon className="w-4 h-4 mr-2" />
      {label}
    </button>
  );

  const NotificationCard = ({ notification }) => (
    <div
      className={`p-4 rounded-lg border transition-colors duration-200 ${
        notification.isRead ? 'bg-white' : 'bg-blue-50'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className={`font-medium ${notification.isRead ? 'text-gray-700' : 'text-blue-600'}`}>
          {notification.title}
        </h3>
        <span className="text-sm text-gray-500">
          {new Date(notification.date).toLocaleDateString('vi-VN')}
        </span>
      </div>
      <p className="text-gray-600">{notification.content}</p>
    </div>
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Thông Báo</h2>
      
      <div className="flex space-x-4 mb-6">
        <TabButton type="system" icon={Bell} label="Hệ thống" />
        <TabButton type="orders" icon={Package} label="Đơn hàng" />
      </div>

      <div className="space-y-4">
        {notifications[activeTab].map((notification) => (
          <NotificationCard key={notification.id} notification={notification} />
        ))}
      </div>
    </div>
  );
};

export default NotificationPage;