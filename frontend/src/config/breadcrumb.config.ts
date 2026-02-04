export const BREADCRUMB_MAP: Record<string, string> = {
  admin: "Dashboard",
  products: "Sản phẩm",
  categories: "Danh mục",
  users: "Khách hàng",
  orders: "Đơn hàng",
  revenue: "Doanh thu",
  settings: "Cài đặt",
  create: "Thêm mới",
  edit: "Cập nhật",
};
function resolveLabel(segment: string) {
  // UUID / ObjectId / number → không hiển thị
  if (/^[0-9a-fA-F-]{8,}$/.test(segment)) {
    return null;
  }

  return BREADCRUMB_MAP[segment] ?? segment;
}
