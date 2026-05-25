import { X, Save } from "lucide-react";

export default function FlashSaleModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-xl">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h3 className="font-semibold text-lg text-gray-600">
            Tạo Flash Sale
          </h3>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <Input
            label="Tên Flash Sale"
            placeholder="Chương trình giảm giá cuối năm..."
          />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Thời gian bắt đầu" type="datetime-local" />
            <Input label="Thời gian kết thúc" type="datetime-local" />
          </div>
          <Input label="Mô tả ngắn" placeholder="Mô tả ngắn về flash sale" />
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
          <button onClick={onClose} className="text-sm text-gray-600">
            Huỷ
          </button>
          <button className="bg-black text-white px-5 py-2 rounded-lg flex items-center gap-2 text-sm">
            <Save size={16} /> Lưu
          </button>
        </div>
      </div>
    </div>
  );
}

const Input = ({ label, type = "text", placeholder }: any) => (
  <div>
    <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase">
      {label}
    </label>
    <input
      type={type}
      className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-black outline-none text-gray-600"
      placeholder={placeholder}
    />
  </div>
);
