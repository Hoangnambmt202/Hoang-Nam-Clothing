import { Search, Filter } from 'lucide-react';
const AdminUsersPage = () => {
    const users = [
        { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@email.com', phone: "1234567899", role: 'Khách hàng', status: 'Hoạt động', joinDate: '2024-01-15' },
        { id: 2, name: 'Trần Thị B', email: 'tranthib@email.com', phone: "1234567899", role: 'Khách hàng', status: 'Hoạt động', joinDate: '2024-01-10' },
        { id: 3, name: 'Lê Văn C', email: 'levanc@email.com', phone: "1234567899", role: 'Khách hàng', status: 'Bị khóa', joinDate: '2024-01-05' }
      ];
    
      return (
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
            <div className="flex gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm người dùng..."
                  className="pl-10 pr-4 py-2 border rounded-md"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
              </div>
              <button className="flex items-center px-4 py-2 border rounded-md gap-2">
                <Filter size={20} />
                Lọc
              </button>
            </div>
          </div>
    
          <div className="bg-white rounded-lg shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">SDT</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vai trò</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày tham gia</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-5 py-4 whitespace-nowrap text-xs">
                        <div className="flex items-center">
                          <img src="/api/placeholder/40/40" alt="" className="w-10 h-10 rounded-full" />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-xs">{user.email}</td>
                      <td className="px-5 py-4 whitespace-nowrap text-xs">{user.phone}</td>
                      <td className="px-5 py-4 whitespace-nowrap text-xs">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          user.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-xs">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          user.status === 'Hoạt động' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-xs">{user.joinDate}</td>
                      <td className="px-5 py-4 whitespace-nowrap text-xs">
                        <button className="text-blue-600 hover:text-blue-800 mr-3">Sửa</button>
                        <button className="text-red-600 hover:text-red-800">Khóa</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
}

export default AdminUsersPage