import  { useState } from 'react';
import { Gift, Clock, CheckCircle, Copy } from 'lucide-react';

const UserVouchersPage = () => {
  const [activeTab, setActiveTab] = useState('available');

  // Mock voucher data - replace with actual API call
  const [vouchers] = useState({
    available: [
      {
        id: 1,
        code: 'WELCOME2024',
        discount: 50000,
        minSpend: 200000,
        type: 'amount',
        expiry: '2024-03-01',
        description: 'Giảm 50K cho đơn hàng từ 200K',
        terms: ['Áp dụng cho tất cả sản phẩm', 'Mỗi khách hàng chỉ được sử dụng 1 lần'],
      },
      {
        id: 2,
        code: 'SALE15PCT',
        discount: 15,
        minSpend: 500000,
        type: 'percent',
        expiry: '2024-03-15',
        description: 'Giảm 15% cho đơn hàng từ 500K',
        terms: ['Giảm tối đa 100K', 'Không áp dụng cho sản phẩm đang giảm giá'],
      }
    ],
    used: [
      {
        id: 3,
        code: 'NEW2024',
        discount: 100000,
        minSpend: 1000000,
        type: 'amount',
        usedDate: '2024-01-15',
        description: 'Giảm 100K cho đơn hàng từ 1000K',
        orderId: 'OD123456'
      }
    ]
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    // Thêm thông báo copy thành công nếu cần
  };

  const getTimeRemaining = (expiryDate) => {
    const remaining = new Date(expiryDate) - new Date();
    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Voucher của tôi</h1>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 border-b">
        <button
          onClick={() => setActiveTab('available')}
          className={`px-6 py-2 text-sm font-medium ${
            activeTab === 'available'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Voucher khả dụng
        </button>
        <button
          onClick={() => setActiveTab('used')}
          className={`px-6 py-2 text-sm font-medium ${
            activeTab === 'used'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Voucher đã dùng
        </button>
      </div>

      {/* Voucher List */}
      <div className="space-y-4">
        {activeTab === 'available' ? (
          // Available Vouchers
          vouchers.available.map(voucher => (
            <div key={voucher.id} className="border rounded-lg p-4 bg-white shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Gift className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">{voucher.description}</h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                        {voucher.code}
                      </code>
                      <button
                        onClick={() => copyToClipboard(voucher.code)}
                        className="text-blue-500 hover:text-blue-600"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Clock className="w-4 h-4 mr-1" />
                      Còn {getTimeRemaining(voucher.expiry)} ngày
                    </div>
                    <div className="text-sm text-gray-600">
                      Đơn tối thiểu {formatPrice(voucher.minSpend)}
                    </div>
                  </div>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                  Dùng ngay
                </button>
              </div>
              {/* Terms and Conditions */}
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-500 mb-2">Điều kiện:</p>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  {voucher.terms.map((term, index) => (
                    <li key={index}>{term}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))
        ) : (
          // Used Vouchers
          vouchers.used.map(voucher => (
            <div key={voucher.id} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-gray-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium mb-1">{voucher.description}</h3>
                  <div className="text-sm text-gray-500 mb-2">
                    Đã sử dụng ngày: {voucher.usedDate}
                  </div>
                  <div className="text-sm text-gray-500">
                    Mã đơn hàng: {voucher.orderId}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserVouchersPage;