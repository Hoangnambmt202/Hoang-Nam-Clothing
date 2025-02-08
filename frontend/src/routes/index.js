import MainLayout from "../layouts/MainLayout";
import UserLayout from "../layouts/UserLayout";


import CartPage from "../pages/CartPage/CartPage";
import CheckoutPage from "../pages/CheckoutPage/CheckoutPage";
import ContactPage from "../pages/ContactPage";
import FashionCollectionPage from "../pages/FashionCollectionPage/FashionCollectionPage";
import HomePage from "../pages/HomePage/HomePage";
import NewArrivalsPage from "../pages/NewArrivalsPage/NewArrivalsPage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import ProductDetailPage from "../pages/ProductDetailPage/ProductDetailPage";
import ProductPage from "../pages/ProductPage/ProductsPage";

import SignInPage from "../pages/SignInPage/SignInPage";
import { SignUpPage } from "../pages/SignUpPage/SignUpPage";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import PasswordPage from "../pages/PasswordPage/PasswordPage";


const routes = [
  {
    path: "/",
    page: HomePage,
    layout: MainLayout,
  },
  {
    path: "/contact",
    page: ContactPage,
    layout: MainLayout,
  },
  {
    path: "*",
    page: NotFoundPage,
   
  },
  {
    path: "/new-arrivals",
    page: NewArrivalsPage,
 
  },
  {
    path: "/products",
    page: ProductPage,
   
  },
  {
    path: "/collection",
    page: FashionCollectionPage,
   
  },
  {
    path: "/cart",
    page: CartPage,
  
  },
  {
    path: "/checkout",
    page: CheckoutPage,
  
  },
  {
    path: "/user",
    layout: UserLayout, // Sử dụng layout riêng cho User
    
    children: [
      
      {
        path: "account/profile",
        page: ProfilePage,
      },
      {
        path: "account/password",
        page: PasswordPage,
      }
    
    ],
  },

  {
    path: "/product-detail",
    page: ProductDetailPage,
 
  },
  {
    path: "sign-in",
    page: SignInPage,
   
  },
  {
    path: "sign-up",
    page: SignUpPage,
    isShowHeader: false,
  },
  
  
 
];
export default routes;
