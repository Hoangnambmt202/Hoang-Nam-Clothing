export const BREADCRUMB_MAP: Record<string, string> = {
  admin: "Dashboard",
  products: "Sản phẩm",
  categories: "Danh mục",
  users: "Người dùng",
  orders: "Đơn hàng",
  revenue: "Doanh thu",
  settings: "Cài đặt",
  create: "Thêm mới",
  edit: "Cập nhật",
  returns: "Trả hàng",
  refunds: "Hoàn tiền",
  variants: "Biến thể",
  reviews: "Đánh giá",
  bestseller: "Sản phẩm bán chạy",
  inventory: "Báo cáo tồn kho",
  reports: "Báo cáo",
  payment: "Thanh toán",
  methods: "Phương thức thanh toán",
  shipping: "Vận chuyển",
  partners: "Đối tác",
  marketing: "Marketing",
  discounts: "Mã giảm giá",
  banners: "Banner",
  popups: "Popup",
  notifications: "Thông báo",
  customers: "Danh sách khách hàng",
  segments: "Phân khúc",
  campaigns: "Chiến dịch",
  analytics: "Phân tích",
  email: "Email",
  sms: "SMS",
  push: "Push",
  loyalty: "Chương trình khách hàng thân thiết",
  members: "Thành viên",
  points: "Điểm",
  tiers: "Cấp bậc",
  staffs: "Nhân viên",
  roles: "Vai trò",
  permissions: "Quyền hạn",
  logs: "Nhật ký",
  system: "Hệ thống",
  socials: "Mạng xã hội",
  security: "Bảo mật",
  general: "Cài đặt chung",
};
function resolveLabel(segment: string) {
  // UUID / ObjectId / number → không hiển thị
  if (/^[0-9a-fA-F-]{8,}$/.test(segment)) {
    return null;
  }

  return BREADCRUMB_MAP[segment] ?? segment;
}
