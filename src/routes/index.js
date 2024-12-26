import ContactPage from "../pages/ContactPage";
import HomePage from "../pages/HomePage/HomePage";
import NewArrivalsPage from "../pages/NewArrivalsPage/NewArrivalsPage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import ProductPage from "../pages/ProductPage/ProductsPage";

const routes = [
  {
    path: "/",
    page: HomePage,
    isShowHeader: true,
  },
  {
    path: "/contact",
    page: ContactPage,
    isShowHeader: true,
  },
  {
    path: "*",
    page: NotFoundPage,
    isShowHeader: false,
  },
  {
    path: "/new-arrivals",
    page: NewArrivalsPage,
    isShowHeader: true,
  },
  {
    path: "/products",
    page: ProductPage,
    isShowHeader: true,
  }
];
export default routes;
