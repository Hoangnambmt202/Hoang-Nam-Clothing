
import CartPage from "../pages/CartPage/CartPage";
import CheckoutPage from "../pages/CheckoutPage/CheckoutPage";
import ContactPage from "../pages/ContactPage";
import FashionCollectionPage from "../pages/FashionCollectionPage/FashionCollectionPage";
import HomePage from "../pages/HomePage/HomePage";
import NewArrivalsPage from "../pages/NewArrivalsPage/NewArrivalsPage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import ProductPage from "../pages/ProductPage/ProductsPage";
import UserPage from "../pages/UserPage/UserPage";


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
  },
  {
    path: "/collection",
    page: FashionCollectionPage,
    isShowHeader: true,
  },
  {
    path: "/cart",
    page: CartPage,
    isShowHeader: true,
  },
  {
    path: "/checkout",
    page: CheckoutPage,
    isShowHeader: true,
  },
  {
    path: "/user",
    page: UserPage,
    isShowHeader: true,
  }
 
];
export default routes;
