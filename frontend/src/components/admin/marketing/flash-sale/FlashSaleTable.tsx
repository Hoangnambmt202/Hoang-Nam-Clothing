import { Edit, Trash2, Clock } from "lucide-react";

const flashSales = [
  {
    id: 1,
    name: "Flash Sale Áo Polo",
    startAt: "2026-02-10 08:00",
    endAt: "2026-02-10 12:00",
    products: 12,
    status: "ACTIVE",
  },
  {
    id: 2,
    name: "Sale Giày Thể Thao",
    startAt: "2026-02-12 20:00",
    endAt: "2026-02-13 00:00",
    products: 8,
    status: "SCHEDULED",
  },
];

const statusStyle: any = {
  ACTIVE: "bg-green-100 text-green-700",
  SCHEDULED: "bg-yellow-100 text-yellow-700",
  ENDED: "bg-gray-200 text-gray-600",
};

export default function FlashSaleTable() {
  return (
    <div className="max-w-7xl mx-auto bg-white border rounded-xl shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
          <tr>
            <th className="px-6 py-4 text-left">Tên Flash Sale</th>
            <th className="px-6 py-4">Thời gian</th>
            <th className="px-6 py-4">Sản phẩm</th>
            <th className="px-6 py-4">Trạng thái</th>
            <th className="px-6 py-4 text-right">Hành động</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {flashSales.map((sale) => (
            <tr key={sale.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 font-semibold text-slate-900">
                {sale.name}
              </td>
              <td className="px-6 py-4 text-slate-600">
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  {sale.startAt} → {sale.endAt}
                </div>
              </td>
              <td className="px-6 py-4 text-center text-slate-900">
                {sale.products}
              </td>
              <td className="px-6 py-4 text-center">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle[sale.status]}`}
                >
                  {sale.status}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-3">
                  <button className="text-gray-400 hover:text-black">
                    <Edit size={16} />
                  </button>
                  <button className="text-gray-400 hover:text-red-500">
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
