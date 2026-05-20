import { Save, Globe, Mail, Phone, Image as ImageIcon } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cài đặt chung",
  description: "Cài đặt chung",
};
export default function GeneralSettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-black">Cài đặt chung</h1>
          <p className="text-sm text-gray-500">
            Thiết lập thông tin cơ bản cho hệ thống
          </p>
        </div>

        {/* Form */}
        <div className="bg-white border rounded-xl shadow-sm">
          <div className="p-6 space-y-6">
            {/* Store Info */}
            <Section title="Thông tin cửa hàng">
              <Input
                label="Tên website / cửa hàng"
                placeholder="My Fashion Shop"
              />
              <Input
                label="Domain"
                icon={<Globe size={16} />}
                placeholder="https://example.com"
              />
              <Textarea
                label="Mô tả ngắn"
                placeholder="Thời trang hiện đại cho giới trẻ"
              />
            </Section>

            {/* Contact */}
            <Section title="Thông tin liên hệ">
              <Input
                label="Email"
                icon={<Mail size={16} />}
                placeholder="support@example.com"
              />
              <Input
                label="Số điện thoại"
                icon={<Phone size={16} />}
                placeholder="0123 456 789"
              />
            </Section>

            {/* Logo */}
            <Section title="Thương hiệu">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase">
                  Logo
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 border rounded-lg flex items-center justify-center text-gray-400">
                    <ImageIcon />
                  </div>
                  <button className="px-4 py-2 border rounded-md text-sm hover:bg-gray-50">
                    Upload logo
                  </button>
                </div>
              </div>
            </Section>
          </div>

          {/* Footer */}
          <div className="flex justify-end px-6 py-4 border-t bg-gray-50">
            <button className="bg-black text-white px-6 py-2 rounded-lg text-sm flex items-center gap-2">
              <Save size={16} /> Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const Section = ({ title, children }: any) => (
  <div className="space-y-4">
    <h2 className="text-sm font-bold uppercase text-gray-500">{title}</h2>
    <div className="grid grid-cols-1 gap-4">{children}</div>
  </div>
);

const Input = ({ label, placeholder, icon }: any) => (
  <div>
    <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">
      {label}
    </label>
    <div className="relative">
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </span>
      )}
      <input
        placeholder={placeholder}
        className={`w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-black ${icon ? "pl-10" : ""}`}
      />
    </div>
  </div>
);

const Textarea = ({ label, placeholder }: any) => (
  <div>
    <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">
      {label}
    </label>
    <textarea
      placeholder={placeholder}
      rows={3}
      className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-black"
    />
  </div>
);
