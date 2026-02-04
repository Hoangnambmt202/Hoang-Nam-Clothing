type MenuItem = {
  label: string;
  link?: string;
  icon: React.ReactNode;
  count?: string | null;
  children?: MenuItem[];
};
export default MenuItem;
