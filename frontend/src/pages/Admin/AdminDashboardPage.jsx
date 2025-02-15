import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
  } from "recharts";
  import {
    Users,
    Package,
    DollarSign,
    ShoppingBag,
 
  } from "lucide-react";
  
const AdminDashboardPage = () => {
    const salesData = [
        { month: "T1", sales: 12000000, orders: 120 },
        { month: "T2", sales: 15000000, orders: 150 },
        { month: "T3", sales: 18000000, orders: 180 },
        { month: "T4", sales: 16000000, orders: 160 },
        { month: "T5", sales: 21000000, orders: 190 },
        { month: "T6", sales: 19000000, orders: 190 },
      ];
  return (
    <>
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Tổng doanh thu</p>
                  <p className="text-2xl font-bold">45.5M</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <DollarSign className="text-green-600" size={24} />
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Đơn hàng mới</p>
                  <p className="text-2xl font-bold">54</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <ShoppingBag className="text-blue-600" size={24} />
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Sản phẩm</p>
                  <p className="text-2xl font-bold">245</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Package className="text-purple-600" size={24} />
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Khách hàng</p>
                  <p className="text-2xl font-bold">1.2K</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Users className="text-orange-600" size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium mb-4">Doanh thu theo tháng</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#2563eb"
                    name="Doanh thu"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium mb-4">
                Số đơn hàng theo tháng
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="orders" fill="#3b82f6" name="Đơn hàng" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          
    </>
  )
}

export default AdminDashboardPage