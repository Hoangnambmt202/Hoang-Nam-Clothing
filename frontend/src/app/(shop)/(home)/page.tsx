import { Metadata } from "next";
import HomePageClient from "./HomePageClient";

export const metadata: Metadata = {
  title: "Hoang Nam | Home",
  description:
    "Hoang Nam Clothing | Shop Hoang Nam | Cửa hàng quần áo Hoàng Nam | Thời trang nam Hoàng Nam",
};

const HomePage = () => {
  return <HomePageClient />;
};

export default HomePage;
